import { type NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { getRedisClient } from "@/lib/redis";
import logger from "@/lib/logger";
import { restorePhoto } from "@/lib/restore/restorer";
import { asClerkUserId, createCreditLedger } from "@/lib/credits/ledger";

const ledger = createCreditLedger()

function getRateLimiter() {
  const redis = getRedisClient()
  if (!redis) return null

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    // Analytics writes run after the response and Workers cancel them without ctx.waitUntil: https://developers.cloudflare.com/workers/runtime-apis/context/#waituntil
    analytics: false,
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

export async function POST(request: NextRequest) {
  noStore()

  let restorationId: string | null = null
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

    const clerkUserId = asClerkUserId(userId)
    const creditCheck = await ledger.balance(clerkUserId)

    if (!creditCheck.ok && creditCheck.reason === "db_error") {
      logger.error({ userId, error: creditCheck.message }, "Failed to check credits")
      return NextResponse.json(
        { success: false, error: "We couldn't check your credits. Please try again." },
        { status: 503 },
      )
    }

    if (!creditCheck.ok || creditCheck.paidCredits <= 0) {
      logger.warn({ userId, creditCheck }, "No paid credits available")
      return NextResponse.json(
        { success: false, error: "No credits available. Purchase more credits to continue." },
        { status: 403 },
      )
    }

    logger.info({ userId }, "Starting AI restoration")

    const restoredImageUrl = await restorePhoto({ photo: { bytes: buffer, mimeType: file.type } })

    logger.info({ userId }, "AI restoration complete")

    const charge = await ledger.chargeRestoration(clerkUserId, {
      originalUrl: `ephemeral:${originalFilename}`,
      restoredUrl: restoredImageUrl,
    })

    if (!charge.ok) {
      const chargeError = charge.reason === "db_error" ? charge.message : charge.reason
      logger.error({ userId, error: chargeError }, "Failed to deduct credit")
      return NextResponse.json({ success: false, error: "Failed to record restoration" }, { status: 500 })
    }

    restorationId = charge.restorationId

    logger.info({ userId, restorationId }, "Restoration completed successfully")

    return NextResponse.json({
      success: true,
      data: {
        restoredImageUrl,
        remainingPaidCredits: charge.remainingCredits,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to restore image"
    const errorCause = error instanceof Error && error.cause ? String(error.cause) : undefined
    logger.error({ userId, error: errorMessage, cause: errorCause }, "Restoration error")

    if (restorationId) {
      await ledger.reverseRestoration(restorationId)
      logger.info({ userId, restorationId }, "Rolled back failed restoration")
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
