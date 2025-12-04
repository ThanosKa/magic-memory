import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger, { logError, createRequestContext } from "@/lib/logger"
import { parseRequestBody } from "@/lib/validations/utils"
import { restorePhotoRequestSchema } from "@/lib/validations/api"
import { checkUserCredits, deductCreditAndRecordRestoration, rollbackRestoration } from "@/lib/supabase/transactions"
import { markFreeCreditUsed, getRedisClient } from "@/lib/redis"
import Replicate from "replicate"
import { v4 as uuidv4 } from "uuid"

async function runReplicateWithPolling(imageUrl: string): Promise<string> {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  })

  const prediction = await replicate.predictions.create({
    version: "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
    input: {
      img: imageUrl,
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

async function uploadRestoredImage(
  imageUrl: string,
  userId: string,
  originalFilename: string,
): Promise<{ url: string; path: string }> {
  const supabase = getSupabaseAdminClient()

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error("Failed to fetch restored image from Replicate")
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const contentType = response.headers.get("content-type") || "image/png"
  const extension = contentType.includes("jpeg") ? "jpg" : "png"

  const fileName = `user_${userId}/${originalFilename}-restored-${uuidv4().slice(0, 8)}.${extension}`

  const { data, error } = await supabase.storage.from("photos").upload(fileName, buffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    logger.error({ error, userId }, "Failed to upload restored image")
    throw new Error("Failed to save restored image")
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(data.path)

  logger.info({ userId, path: data.path }, "Restored image uploaded to Storage")

  return { url: publicUrl, path: data.path }
}

export async function POST(request: NextRequest) {
  let restorationId: string | null = null
  let usedFreeCredit = false
  let userId: string | null = null

  const ctx = createRequestContext(null, "restore_photo")

  try {
    const authResult = await auth()
    userId = authResult.userId
    ctx.userId = userId || "anonymous"

    if (!userId) {
      logger.warn(ctx, "Unauthorized restoration attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const parseResult = await parseRequestBody(request, restorePhotoRequestSchema)
    if (!parseResult.success) {
      logger.warn({ ...ctx, error: "Invalid request body" }, "Validation failed")
      return parseResult.error
    }

    const { imageUrl, originalFilename = "photo" } = parseResult.data

    logger.info({ ...ctx, imageUrl }, "Restoration request received")

    const creditCheck = await checkUserCredits(userId)

    if (!creditCheck || !creditCheck.has_credits) {
      logger.warn({ ...ctx, creditCheck }, "No credits available")
      return NextResponse.json(
        { success: false, error: "No credits available. Purchase more credits to continue." },
        { status: 403 },
      )
    }

    usedFreeCredit = creditCheck.should_use_free

    logger.info({ ...ctx, useFreeCredit: usedFreeCredit }, "Starting AI restoration")

    const replicateOutput = await runReplicateWithPolling(imageUrl)

    logger.info({ ...ctx }, "AI restoration complete, uploading to storage")

    const { url: restoredImageUrl, path: restoredImagePath } = await uploadRestoredImage(
      replicateOutput,
      userId,
      originalFilename,
    )

    const deductResult = await deductCreditAndRecordRestoration(userId, imageUrl, restoredImageUrl, usedFreeCredit)

    if (!deductResult.success) {
      logError(logger, deductResult.error_message, { ...ctx, action: "deduct_credit" })
      return NextResponse.json({ success: false, error: "Failed to record restoration" }, { status: 500 })
    }

    restorationId = deductResult.restoration_id

    if (usedFreeCredit && getRedisClient()) {
      await markFreeCreditUsed(userId)
      logger.info({ ...ctx }, "Free credit marked as used in Redis")
    }

    logger.info(
      { ...ctx, restorationId, restoredImageUrl, usedFreeCredit },
      "Restoration completed successfully",
    )

    return NextResponse.json({
      success: true,
      data: {
        restoredImageUrl,
        restoredImagePath,
        usedFreeCredit,
        remainingPaidCredits: deductResult.remaining_paid_credits,
        restorationId,
      },
    })
  } catch (error) {
    logError(logger, error, { ...ctx, action: "restoration_error" })

    if (restorationId) {
      await rollbackRestoration(restorationId)
      logger.info({ ...ctx, restorationId }, "Rolled back failed restoration")
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to restore image"
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
