import { describe, it, expect } from "vitest"
import {
    createCheckoutRequestSchema,
    creditBalanceSchema,
    restoreResponseSchema,
    restorePhotoRequestSchema,
    uploadResponseSchema,
} from "@/lib/validations/api"

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

    describe("creditBalanceSchema", () => {
        it("validates complete credit balance object", () => {
            const validBalance = {
                paidCredits: 100,
                hasFreeDaily: true,
                totalCredits: 101,
                freeResetTime: "2024-01-01T00:00:00.000Z",
            }
            const result = creditBalanceSchema.safeParse(validBalance)
            expect(result.success).toBe(true)
        })

        it("rejects negative credits", () => {
            const invalidBalance = {
                paidCredits: -1,
                hasFreeDaily: true,
                totalCredits: 0,
            }
            const result = creditBalanceSchema.safeParse(invalidBalance)
            expect(result.success).toBe(false)
        })

        it("accepts optional freeResetTime", () => {
            const balance = {
                paidCredits: 50,
                hasFreeDaily: false,
                totalCredits: 50,
            }
            const result = creditBalanceSchema.safeParse(balance)
            expect(result.success).toBe(true)
        })

        it("requires hasFreeDaily to be boolean", () => {
            const invalidBalance = {
                paidCredits: 50,
                hasFreeDaily: "yes",
                totalCredits: 51,
            }
            const result = creditBalanceSchema.safeParse(invalidBalance)
            expect(result.success).toBe(false)
        })
    })

    describe("restoreResponseSchema", () => {
        it("validates complete restore response", () => {
            const validResponse = {
                restoredImageUrl: "https://example.com/restored.jpg",
                usedFreeCredit: true,
                remainingPaidCredits: 49,
                restorationId: "550e8400-e29b-41d4-a716-446655440000",
            }
            const result = restoreResponseSchema.safeParse(validResponse)
            expect(result.success).toBe(true)
        })

        it("requires valid URL format", () => {
            const invalidResponse = {
                restoredImageUrl: "not-a-url",
                usedFreeCredit: true,
            }
            const result = restoreResponseSchema.safeParse(invalidResponse)
            expect(result.success).toBe(false)
        })

        it("accepts minimal response with required fields", () => {
            const minimalResponse = {
                restoredImageUrl: "https://example.com/image.jpg",
                usedFreeCredit: false,
            }
            const result = restoreResponseSchema.safeParse(minimalResponse)
            expect(result.success).toBe(true)
        })
    })

    describe("restorePhotoRequestSchema", () => {
        it("validates request with image URL", () => {
            const validRequest = {
                imageUrl: "https://storage.example.com/photo.jpg",
                originalFilename: "my-photo.jpg",
            }
            const result = restorePhotoRequestSchema.safeParse(validRequest)
            expect(result.success).toBe(true)
        })

        it("requires valid URL format for imageUrl", () => {
            const invalidRequest = {
                imageUrl: "invalid-url",
            }
            const result = restorePhotoRequestSchema.safeParse(invalidRequest)
            expect(result.success).toBe(false)
        })

        it("provides default for optional originalFilename", () => {
            const request = {
                imageUrl: "https://example.com/photo.jpg",
            }
            const result = restorePhotoRequestSchema.safeParse(request)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.originalFilename).toBe("photo")
            }
        })
    })

    describe("uploadResponseSchema", () => {
        it("validates complete upload response", () => {
            const validResponse = {
                url: "https://storage.example.com/photo.jpg",
                path: "uploads/photo.jpg",
                signedUrl: "https://storage.example.com/signed/photo.jpg",
                originalFilename: "my-photo.jpg",
            }
            const result = uploadResponseSchema.safeParse(validResponse)
            expect(result.success).toBe(true)
        })

        it("accepts minimal response", () => {
            const minimalResponse = {
                url: "https://storage.example.com/photo.jpg",
                path: "uploads/photo.jpg",
            }
            const result = uploadResponseSchema.safeParse(minimalResponse)
            expect(result.success).toBe(true)
        })
    })
})
