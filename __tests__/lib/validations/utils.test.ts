import { describe, it, expect, vi } from "vitest"
import { z } from "zod"
import { parseRequestBody } from "@/lib/validations/utils"

vi.mock("@/lib/logger")

const testSchema = z.object({
    name: z.string(),
    age: z.number().positive(),
})

describe("validation utilities", () => {
    describe("parseRequestBody", () => {
        it("returns error for invalid JSON", async () => {
            const mockRequest = {
                json: () => Promise.reject(new Error("Invalid JSON")),
            } as unknown as Request

            const result = await parseRequestBody(mockRequest, testSchema)

            expect(result.success).toBe(false)
            if (!result.success) {
                const data = await result.error.json()
                expect(data.error).toBe("Invalid JSON body")
            }
        })

        it("returns validation errors for invalid data", async () => {
            const mockRequest = {
                json: () => Promise.resolve({ name: 123, age: -5 }),
            } as unknown as Request

            const result = await parseRequestBody(mockRequest, testSchema)

            expect(result.success).toBe(false)
            if (!result.success) {
                const data = await result.error.json()
                expect(data.error).toBe("Validation failed")
                expect(data.details).toBeDefined()
            }
        })

        it("returns parsed data for valid input", async () => {
            const mockRequest = {
                json: () => Promise.resolve({ name: "John", age: 25 }),
            } as unknown as Request

            const result = await parseRequestBody(mockRequest, testSchema)

            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data.name).toBe("John")
                expect(result.data.age).toBe(25)
            }
        })

        it("provides field-level error details", async () => {
            const mockRequest = {
                json: () => Promise.resolve({ name: 123 }),
            } as unknown as Request

            const result = await parseRequestBody(mockRequest, testSchema)

            expect(result.success).toBe(false)
            if (!result.success) {
                const data = await result.error.json()
                expect(data.details.name).toBeDefined()
                expect(data.details.age).toBeDefined()
            }
        })
    })
})
