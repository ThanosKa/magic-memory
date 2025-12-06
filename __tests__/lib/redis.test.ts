import { describe, it, expect } from "vitest"

describe("redis utilities", () => {
    describe("getSecondsUntilMidnightUTC", () => {
        it("calculates seconds correctly", async () => {
            const { getSecondsUntilMidnightUTC } = await import("@/lib/redis")

            const seconds = getSecondsUntilMidnightUTC()

            expect(seconds).toBeGreaterThan(0)
            expect(seconds).toBeLessThanOrEqual(86400)
        })
    })

    describe("getFreeCreditKey", () => {
        it("formats key with userId and current date", async () => {
            const { getFreeCreditKey } = await import("@/lib/redis")

            const key = getFreeCreditKey("user123")

            expect(key).toMatch(/^free_credit:user123:\d{4}-\d{2}-\d{2}$/)
        })
    })
})
