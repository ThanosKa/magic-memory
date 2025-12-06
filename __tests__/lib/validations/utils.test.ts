import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
    parseRequestBody,
    createApiResponse,
    createErrorResponse,
    formatZodError,
} from "@/lib/validations/utils"

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

    describe("createApiResponse", () => {
        it("wraps data in success response", async () => {
            const data = { id: 1, name: "Test" }
            const response = createApiResponse(data)
            const json = await response.json()

            expect(json.success).toBe(true)
            expect(json.data).toEqual(data)
        })

        it("uses default 200 status", () => {
            const response = createApiResponse({ test: true })
            expect(response.status).toBe(200)
        })

        it("accepts custom status code", () => {
            const response = createApiResponse({ created: true }, 201)
            expect(response.status).toBe(201)
        })
    })

    describe("createErrorResponse", () => {
        it("creates error response with message", async () => {
            const response = createErrorResponse("Something went wrong")
            const json = await response.json()

            expect(json.success).toBe(false)
            expect(json.error).toBe("Something went wrong")
        })

        it("uses default 500 status", () => {
            const response = createErrorResponse("Error")
            expect(response.status).toBe(500)
        })

        it("accepts custom status code", () => {
            const response = createErrorResponse("Not found", 404)
            expect(response.status).toBe(404)
        })
    })

    describe("formatZodError", () => {
        it("formats error with path and message", () => {
            const schema = z.object({
                email: z.string().email(),
                age: z.number().min(18),
            })

            const result = schema.safeParse({ email: "invalid", age: 10 })
            if (!result.success) {
                const formatted = formatZodError(result.error)
                expect(formatted).toContain("email")
                expect(formatted).toContain("age")
            }
        })

        it("joins multiple errors with comma", () => {
            const schema = z.object({
                a: z.string(),
                b: z.string(),
            })

            const result = schema.safeParse({ a: 123, b: 456 })
            if (!result.success) {
                const formatted = formatZodError(result.error)
                expect(formatted).toContain(",")
            }
        })
    })
})
