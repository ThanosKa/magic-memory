import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import logger from "@/lib/logger"
import { POST } from "@/app/api/vitals/route"

function vitalsRequest(rating: "good" | "needs-improvement" | "poor") {
  return new NextRequest("https://magic-memory.dev/api/vitals", {
    method: "POST",
    body: JSON.stringify({
      name: "LCP",
      value: 4321.4,
      id: "v5-123",
      path: "/pricing",
      rating,
      navigationType: "navigate",
    }),
  })
}

describe("POST /api/vitals", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it.each(["good", "needs-improvement"] as const)(
    "accepts a %s metric without writing a log line",
    async (rating) => {
      const response = await POST(vitalsRequest(rating))

      expect(response.status).toBe(200)
      expect(vi.mocked(logger.info)).not.toHaveBeenCalled()
    },
  )

  it("logs a poor metric", async () => {
    const response = await POST(vitalsRequest("poor"))

    expect(response.status).toBe(200)
    expect(vi.mocked(logger.info)).toHaveBeenCalledWith(
      expect.objectContaining({ metric: "LCP", rating: "poor", value: 4321, path: "/pricing" }),
    )
  })

  it("rejects an invalid payload", async () => {
    const response = await POST(
      new NextRequest("https://magic-memory.dev/api/vitals", { method: "POST", body: "{}" }),
    )

    expect(response.status).toBe(400)
  })
})
