import { type NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import Replicate from "replicate";
import { markFreeCreditUsed, getRedisClient } from "@/lib/redis";
import logger from "@/lib/logger";
import {
  checkUserCredits,
  deductCreditAndRecordRestoration,
  rollbackRestoration,
} from "@/lib/supabase/transactions";

function getRateLimiter() {
  const redis = getRedisClient()
  if (!redis) return null

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:restore",
  })
}

const MAX_IMAGE_DIMENSION = 4000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const restoreFormDataSchema = z.object({
  originalFilename: z.string().trim().min(1).max(200).default("photo"),
});

async function validateImageDimensions(buffer: Buffer): Promise<{ valid: boolean; error?: string }> {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) {
    const width = buffer.readUInt32BE(16)
    const height = buffer.readUInt32BE(20)
    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      return { valid: false, error: `Image dimensions ${width}x${height} exceed maximum ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}` }
    }
    return { valid: true }
  }

  return { valid: true }
}

async function runReplicateWithPolling(imageBase64: string): Promise<string> {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })

  const prediction = await replicate.predictions.create({
    version: "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
    input: {
      img: imageBase64,
      version: "v1.4",
      scale: 2,
    },
  })

  logger.info({ predictionId: prediction.id }, "Replicate prediction created")

  const maxAttempts = 60
  let attempts = 0

  while (attempts < maxAttempts) {
    const status = await replicate.predictions.get(prediction.id)

    if (status.status === "succeeded") {
      logger.info({ predictionId: prediction.id }, "Replicate prediction succeeded")
      return status.output as string
    }

    if (status.status === "failed" || status.status === "canceled") {
      logger.error(
        { predictionId: prediction.id, status: status.status, error: status.error },
        "Replicate prediction failed",
      )
      throw new Error(`Restoration failed: ${status.error || status.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    attempts++
  }

  throw new Error("Restoration timed out after 60 seconds")
}

export async function POST(request: NextRequest) {
  // Prevent Next.js from caching any fetch calls (predictions polling GET requests)
  noStore()

  let restorationId: string | null = null
  let usedFreeCredit = false
  let userId: string | null = null

  try {
    const authResult = await auth()
    userId = authResult.userId

    if (!userId) {
      logger.warn({ userId: "anonymous" }, "Unauthorized restoration attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const rateLimiter = getRateLimiter()
    if (rateLimiter) {
      try {
        const { success, remaining } = await rateLimiter.limit(userId)
        if (!success) {
          logger.warn({ userId, remaining }, "Rate limit exceeded")
          return NextResponse.json(
            { success: false, error: "Too many requests. Please wait a minute before trying again." },
            { status: 429 }
          )
        }
      } catch (redisErr) {
        // Redis unavailable — log and continue rather than blocking restoration
        logger.warn({ userId, error: redisErr instanceof Error ? redisErr.message : String(redisErr) }, "Rate limiter unavailable, skipping")
      }
    }

    const formData = await request.formData();
    const file = formData.get("file");

    const originalFilenameRaw = formData.get("originalFilename");
    const parsedForm = restoreFormDataSchema.safeParse({
      originalFilename:
        typeof originalFilenameRaw === "string" ? originalFilenameRaw : undefined,
    });

    if (!parsedForm.success) {
      logger.warn(
        { userId, errors: parsedForm.error.flatten() },
        "Invalid restore form data"
      );
      return NextResponse.json(
        { success: false, error: "Invalid form data" },
        { status: 400 }
      );
    }

    const { originalFilename } = parsedForm.data;

    if (!(file instanceof File)) {
      logger.warn({ userId }, "No file provided")
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      logger.warn({ userId, fileType: file.type }, "Invalid file type")
      return NextResponse.json(
        { success: false, error: "Invalid file type. Supported: JPG, PNG, WebP" },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      logger.warn({ userId, fileSize: file.size }, "File too large")
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size: 10MB" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const dimensionCheck = await validateImageDimensions(buffer)
    if (!dimensionCheck.valid) {
      logger.warn({ userId, error: dimensionCheck.error }, "Image dimensions exceeded")
      return NextResponse.json({ success: false, error: dimensionCheck.error }, { status: 400 })
    }

    logger.info({ userId, fileSize: file.size, fileType: file.type }, "Restoration request received")

    const creditCheck = await checkUserCredits(userId)

    if (!creditCheck || !creditCheck.has_credits) {
      logger.warn({ userId, creditCheck }, "No credits available")
      return NextResponse.json(
        { success: false, error: "No credits available. Purchase more credits to continue." },
        { status: 403 },
      )
    }

    usedFreeCredit = creditCheck.should_use_free

    logger.info({ userId, useFreeCredit: usedFreeCredit }, "Starting AI restoration")

    const base64 = buffer.toString("base64")
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    const restoredImageUrl = await runReplicateWithPolling(dataUrl)

    logger.info({ userId }, "AI restoration complete")

    const deductResult = await deductCreditAndRecordRestoration(
      userId,
      `ephemeral:${originalFilename}`,
      restoredImageUrl,
      usedFreeCredit
    )

    if (!deductResult.success) {
      logger.error({ userId, error: deductResult.error_message }, "Failed to deduct credit")
      return NextResponse.json({ success: false, error: "Failed to record restoration" }, { status: 500 })
    }

    restorationId = deductResult.restoration_id

    if (usedFreeCredit && getRedisClient()) {
      await markFreeCreditUsed(userId)
      logger.info({ userId }, "Free credit marked as used in Redis")
    }

    logger.info(
      { userId, restorationId, usedFreeCredit },
      "Restoration completed successfully",
    )

    return NextResponse.json({
      success: true,
      data: {
        restoredImageUrl,
        usedFreeCredit,
        remainingPaidCredits: deductResult.remaining_paid_credits,
        restorationId,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to restore image"
    const errorCause = error instanceof Error && error.cause ? String(error.cause) : undefined
    logger.error({ userId, error: errorMessage, cause: errorCause }, "Restoration error")

    if (restorationId) {
      await rollbackRestoration(restorationId)
      logger.info({ userId, restorationId }, "Rolled back failed restoration")
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
