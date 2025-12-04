import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger, { logError, createRequestContext } from "@/lib/logger"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const uploadResponseSchema = z.object({
  url: z.string().url(),
  path: z.string(),
  signedUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  const ctx = createRequestContext(null, "upload_photo")

  try {
    const { userId } = await auth()
    ctx.userId = userId || "anonymous"

    if (!userId) {
      logger.warn(ctx, "Unauthorized upload attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const originalFilename = formData.get("originalFilename") as string | null

    if (!file) {
      logger.warn({ ...ctx }, "No file provided")
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    logger.info({ ...ctx, fileSize: file.size, fileType: file.type }, "Upload request received")

    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      logger.warn({ ...ctx, fileType: file.type }, "Invalid file type rejected")
      return NextResponse.json(
        { success: false, error: "Invalid file type. Supported: JPG, PNG, WebP" },
        { status: 400 },
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      logger.warn({ ...ctx, fileSize: file.size }, "File too large rejected")
      return NextResponse.json({ success: false, error: "File too large. Maximum size: 10MB" }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    const fileExtension = file.name.split(".").pop() || "jpg"
    const uniqueId = uuidv4()
    const baseFilename = originalFilename
      ? originalFilename.replace(/\.[^/.]+$/, "")
      : file.name.replace(/\.[^/.]+$/, "")

    const fileName = `user_${userId}/${uniqueId}.${fileExtension}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage.from("photos").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
      metadata: {
        originalFilename: baseFilename,
      },
    })

    if (error) {
      logError(logger, error, { ...ctx, action: "storage_upload" })
      return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 })
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("photos")
      .createSignedUrl(data.path, 3600)

    if (signedUrlError) {
      logger.warn({ ...ctx, error: signedUrlError }, "Failed to create signed URL")
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(data.path)

    logger.info({ ...ctx, path: data.path, fileSize: file.size }, "File uploaded successfully")

    const responseData = {
      url: publicUrl,
      path: data.path,
      signedUrl: signedUrlData?.signedUrl,
      originalFilename: baseFilename,
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    logError(logger, error, { ...ctx })
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
