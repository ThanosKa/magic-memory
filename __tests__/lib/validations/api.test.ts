import { describe, it, expect } from "vitest"
import { createCheckoutRequestSchema } from "@/lib/validations/api"

describe("API validation schemas", () => {
    describe("createCheckoutRequestSchema", () => {
        it("accepts valid package types", () => {
            expect(createCheckoutRequestSchema.safeParse({ packageType: "starter" }).success).toBe(true)
            expect(createCheckoutRequestSchema.safeParse({ packageType: "growth" }).success).toBe(true)
            expect(createCheckoutRequestSchema.safeParse({ packageType: "premium" }).success).toBe(true)
        })

        it("rejects invalid package types", () => {
            const result = createCheckoutRequestSchema.safeParse({ packageType: "invalid" })
            expect(result.success).toBe(false)
        })

        it("rejects missing packageType", () => {
            const result = createCheckoutRequestSchema.safeParse({})
            expect(result.success).toBe(false)
        })
    })
})
