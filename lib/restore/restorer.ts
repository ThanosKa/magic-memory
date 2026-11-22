import Replicate from "replicate"
import { unstable_noStore as noStore } from "next/cache"
import logger from "@/lib/logger"

const MODEL_VERSION = "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c"
const DEFAULT_MAX_ATTEMPTS = 60
const POLL_INTERVAL_MS = 1000

export type ReplicateClient = {
  predictions: {
    create: (options: {
      version: string
      input: { img: string; version: string; scale: number }
    }) => Promise<{ id: string }>
    get: (id: string) => Promise<{ status: string; output?: unknown; error?: unknown }>
  }
}

export type RestorerDeps = {
  client?: ReplicateClient
  sleep?: (ms: number) => Promise<void>
  maxAttempts?: number
}

export class RestorationError extends Error {
  constructor(
    message: string,
    readonly reason: "failed" | "canceled" | "timed_out",
  ) {
    super(message)
    this.name = "RestorationError"
  }
}

export async function restorePhoto({
  photo,
  deps = {},
}: {
  photo: { bytes: Buffer; mimeType: string }
  deps?: RestorerDeps
}): Promise<string> {
  noStore()
  const replicate =
    deps.client ?? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)))
  const maxAttempts = deps.maxAttempts ?? DEFAULT_MAX_ATTEMPTS

  const imageBase64 = `data:${photo.mimeType};base64,${photo.bytes.toString("base64")}`

  const prediction = await replicate.predictions.create({
    version: MODEL_VERSION,
    input: {
      img: imageBase64,
      version: "v1.4",
      scale: 2,
    },
  })

  logger.info({ predictionId: prediction.id }, "Replicate prediction created")

  let attempts = 0

  while (attempts < maxAttempts) {
    const status = await replicate.predictions.get(prediction.id)

    if (status.status === "succeeded") {
      logger.info({ predictionId: prediction.id }, "Replicate prediction succeeded")
      if (typeof status.output !== "string") {
        logger.error({ predictionId: prediction.id }, "Replicate prediction returned no URL")
        throw new RestorationError("Restoration failed: no output URL", "failed")
      }
      return status.output
    }

    if (status.status === "failed" || status.status === "canceled") {
      logger.error(
        { predictionId: prediction.id, status: status.status, error: status.error },
        "Replicate prediction failed",
      )
      throw new RestorationError(
        `Restoration failed: ${status.error || status.status}`,
        status.status,
      )
    }

    await sleep(POLL_INTERVAL_MS)
    attempts++
  }

  throw new RestorationError("Restoration timed out after 60 seconds", "timed_out")
}
