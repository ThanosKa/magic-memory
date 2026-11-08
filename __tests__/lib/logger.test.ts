// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// vitest.setup.ts replaces the logger with a stub for every other test.
vi.unmock("@/lib/logger")

async function loadWorkerLogger() {
  vi.resetModules()
  vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" })
  vi.stubEnv("NODE_ENV", "production")
  vi.stubEnv("LOG_LEVEL", "info")
  const { logger } = await import("@/lib/logger")
  return logger
}

function parseOnlyCall(spy: { mock: { calls: unknown[][] } }) {
  expect(spy.mock.calls).toHaveLength(1)
  return JSON.parse(String(spy.mock.calls[0][0])) as Record<string, unknown>
}

describe("logger on the Workers runtime", () => {
  let log: ReturnType<typeof vi.spyOn>
  let warn: ReturnType<typeof vi.spyOn>
  let error: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    log = vi.spyOn(console, "log").mockImplementation(() => {})
    warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    error = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("sends error lines to console.error so Cloudflare records them as errors", async () => {
    const logger = await loadWorkerLogger()

    logger.error({ userId: "user_1" }, "Failed to grant purchased credits")

    const line = parseOnlyCall(error)
    expect(line.msg).toBe("Failed to grant purchased credits")
    expect(line.userId).toBe("user_1")
    expect(log).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })

  it("sends fatal lines to console.error", async () => {
    const logger = await loadWorkerLogger()

    logger.fatal("Worker cannot start")

    expect(parseOnlyCall(error).msg).toBe("Worker cannot start")
  })

  it("sends warn lines to console.warn", async () => {
    const logger = await loadWorkerLogger()

    logger.warn("Rate limiter unavailable, skipping")

    expect(parseOnlyCall(warn).msg).toBe("Rate limiter unavailable, skipping")
    expect(log).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it("sends info lines to console.log", async () => {
    const logger = await loadWorkerLogger()

    logger.info("Restoration completed successfully")

    expect(parseOnlyCall(log).msg).toBe("Restoration completed successfully")
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it("keeps customer email addresses out of the logs", async () => {
    const logger = await loadWorkerLogger()

    logger.info({ userId: "user_1", email: "ana@example.com" }, "User created in database")
    logger.info({ to: "ana@example.com" }, "Welcome email sent")

    const lines = log.mock.calls.map((call) => String(call[0]))
    expect(lines).toHaveLength(2)
    expect(lines.join("\n")).not.toContain("ana@example.com")
    expect(JSON.parse(lines[0]).userId).toBe("user_1")
  })
})
