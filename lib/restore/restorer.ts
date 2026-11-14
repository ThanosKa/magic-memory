import Replicate from "replicate"
import logger from "@/lib/logger"

/**
 * Restores a photo through Replicate (GFPGAN) and returns the restored image URL.
 * Must be called inside a route handler that already called `noStore()`, so
 * Next.js does not cache the polling requests.
 */
export async function runReplicateWithPolling(imageBase64: string): Promise<string> {
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
