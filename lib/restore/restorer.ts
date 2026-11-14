import Replicate from "replicate"
import logger from "@/lib/logger"

const MODEL_VERSION = "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c"
const DEFAULT_MAX_ATTEMPTS = 60
const POLL_INTERVAL_MS = 1000

/** The two Replicate calls the Restorer uses; tests pass a fake. */
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
  /** Default: a real Replicate client built per call from `REPLICATE_API_TOKEN`. */
  client?: ReplicateClient
  /** Default: waits the given milliseconds. */
  sleep?: (ms: number) => Promise<void>
  /** Default: 60 polls. */
  maxAttempts?: number
}

/**
 * Restores a photo (given as a data URL) through Replicate (GFPGAN) and returns the restored image URL.
 * Throws when the prediction fails, is canceled or times out.
 * Must be called inside a route handler that already called `noStore()`, so
 * Next.js does not cache the polling requests.
 */
export async function runReplicateWithPolling(
  imageBase64: string,
  deps: RestorerDeps = {},
): Promise<string> {
  const replicate =
    deps.client ?? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)))
  const maxAttempts = deps.maxAttempts ?? DEFAULT_MAX_ATTEMPTS

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
      return status.output as string
    }

    if (status.status === "failed" || status.status === "canceled") {
      logger.error(
        { predictionId: prediction.id, status: status.status, error: status.error },
        "Replicate prediction failed",
      )
      throw new Error(`Restoration failed: ${status.error || status.status}`)
    }

    await sleep(POLL_INTERVAL_MS)
    attempts++
  }

  throw new Error("Restoration timed out after 60 seconds")
}
