import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { POST } from "@/app/api/restore/route"
import { getRedisClient, markFreeCreditUsed } from "@/lib/redis"
import logger from "@/lib/logger"
import type { CreditLedger } from "@/lib/credits/ledger"

const ledger = vi.hoisted(() => ({
    balance: vi.fn<CreditLedger["balance"]>(),
    chargeRestoration: vi.fn<CreditLedger["chargeRestoration"]>(),
    grantPurchase: vi.fn<CreditLedger["grantPurchase"]>(),
    reverseRestoration: vi.fn<CreditLedger["reverseRestoration"]>(),
}))

vi.mock("@clerk/nextjs/server")
vi.mock("@/lib/supabase/server")
vi.mock("@/lib/credits/ledger", async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/lib/credits/ledger")>()),
    createCreditLedger: () => ledger,
}))
vi.mock("@/lib/redis")
vi.mock("@/lib/logger")

const mockPredictionsCreate = vi.fn()
const mockPredictionsGet = vi.fn()

vi.mock("replicate", () => {
    const MockReplicate = function () {
        return {
            predictions: {
                create: mockPredictionsCreate,
                get: mockPredictionsGet,
            },
        }
    }
    return { default: MockReplicate }
})

function createMockRequest(file?: File | null, originalFilename?: string): NextRequest {
    const formData = new FormData()
    if (file) {
        formData.append("file", file)
    }
    if (originalFilename) {
        formData.append("originalFilename", originalFilename)
    }

    return {
        formData: () => Promise.resolve(formData),
        headers: new Headers(),
    } as unknown as NextRequest
}

function createMockFile(
    name: string,
    type: string,
    size?: number
): File {
    const blob = new Blob(["test"], { type })
    const file = new File([blob], name, { type })
    if (size !== undefined) {
        Object.defineProperty(file, "size", { value: size })
    }
    return file
}

describe("POST /api/restore", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(getRedisClient).mockReturnValue(null)
        mockPredictionsCreate.mockReset()
        mockPredictionsGet.mockReset()
    })

    it("returns 401 when not authenticated", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)

        const request = createMockRequest()
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.success).toBe(false)
        expect(data.error).toBe("Unauthorized")
    })

    it("returns 400 for missing file", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const request = createMockRequest(null)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toBe("No file provided")
    })

    it("returns 400 for invalid file type", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const invalidFile = createMockFile("test.gif", "image/gif")
        const request = createMockRequest(invalidFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toContain("Invalid file type")
    })

    it("returns 400 for oversized file", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const largeFile = createMockFile("large.jpg", "image/jpeg", 15 * 1024 * 1024)
        const request = createMockRequest(largeFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.success).toBe(false)
        expect(data.error).toContain("File too large")
    })

    it("returns 403 when no credits available", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        ledger.balance.mockResolvedValue({ ok: true, paidCredits: 0 })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.success).toBe(false)
        expect(data.error).toContain("No credits available")
    })

    it("returns 403 even when SQL function reports free daily credit available", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        ledger.balance.mockResolvedValue({ ok: true, paidCredits: 0 })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile, "my-photo.jpg")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.success).toBe(false)
        expect(data.error).toContain("No credits available")
        expect(ledger.chargeRestoration).not.toHaveBeenCalled()
        expect(vi.mocked(markFreeCreditUsed)).not.toHaveBeenCalled()
    })

    it("uses paid credit when no free available", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        ledger.balance.mockResolvedValue({ ok: true, paidCredits: 50 })

        ledger.chargeRestoration.mockResolvedValue({
            ok: true,
            restorationId: "restoration-uuid",
            remainingCredits: 49,
        })

        mockPredictionsCreate.mockResolvedValue({ id: "pred-123", status: "starting" })
        mockPredictionsGet.mockResolvedValue({
            id: "pred-123",
            status: "succeeded",
            output: "https://replicate.delivery/restored.png",
        })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.data.usedFreeCredit).toBe(false)
        expect(data.data.remainingPaidCredits).toBe(49)
    })

    it("returns restored image URL on success", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        ledger.balance.mockResolvedValue({ ok: true, paidCredits: 5 })

        ledger.chargeRestoration.mockResolvedValue({
            ok: true,
            restorationId: "restoration-uuid",
            remainingCredits: 4,
        })

        const expectedUrl = "https://replicate.delivery/test-restored.png"
        mockPredictionsCreate.mockResolvedValue({ id: "pred-123", status: "starting" })
        mockPredictionsGet.mockResolvedValue({
            id: "pred-123",
            status: "succeeded",
            output: expectedUrl,
        })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.data.restoredImageUrl).toBe(expectedUrl)
        expect(data.data).not.toHaveProperty("restorationId")
    })

    it("returns 500 and never charges when Replicate fails", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        ledger.balance.mockResolvedValue({ ok: true, paidCredits: 5 })

        mockPredictionsCreate.mockResolvedValue({ id: "pred-123", status: "starting" })
        mockPredictionsGet.mockResolvedValue({
            id: "pred-123",
            status: "failed",
            error: "model crashed",
        })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.success).toBe(false)
        expect(data.error).toBe("Restoration failed: model crashed")
        expect(ledger.chargeRestoration).not.toHaveBeenCalled()
    })

    describe("through the credit ledger", () => {
        const NO_CREDITS = "No credits available. Purchase more credits to continue."

        function succeedRestorer(output = "https://replicate.delivery/restored.png") {
            mockPredictionsCreate.mockResolvedValue({ id: "pred-123", status: "starting" })
            mockPredictionsGet.mockResolvedValue({ id: "pred-123", status: "succeeded", output })
        }

        beforeEach(() => {
            vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)
            ledger.balance.mockReset()
            ledger.chargeRestoration.mockReset()
            ledger.reverseRestoration.mockReset()
            vi.spyOn(logger, "warn").mockImplementation(() => {})
            vi.spyOn(logger, "error").mockImplementation(() => {})
        })

        afterEach(() => {
            vi.restoreAllMocks()
        })

        it.each([
            { reason: "user_not_found", failure: { ok: false, reason: "user_not_found" } as const },
            { reason: "db_error", failure: { ok: false, reason: "db_error", message: "connection refused" } as const },
            { reason: "no_credits", failure: { ok: false, reason: "no_credits" } as const },
        ])("answers 403 when the Balance read gives $reason, before the Restorer runs", async ({ failure }) => {
            ledger.balance.mockResolvedValue(failure)

            const response = await POST(createMockRequest(createMockFile("test.jpg", "image/jpeg")))
            const data = await response.json()

            expect(response.status).toBe(403)
            expect(data).toEqual({ success: false, error: NO_CREDITS })
            expect(mockPredictionsCreate).not.toHaveBeenCalled()
            expect(ledger.chargeRestoration).not.toHaveBeenCalled()
            expect(logger.warn).toHaveBeenCalledWith(
                { userId: "clerk_user_123", creditCheck: failure },
                "No paid credits available",
            )
        })

        it("answers 403 when the Balance is below zero", async () => {
            ledger.balance.mockResolvedValue({ ok: true, paidCredits: -1 })

            const response = await POST(createMockRequest(createMockFile("test.jpg", "image/jpeg")))

            expect(response.status).toBe(403)
            expect(mockPredictionsCreate).not.toHaveBeenCalled()
        })

        it("reads the Balance and Charges by the caller's Clerk id after the Restorer succeeds", async () => {
            ledger.balance.mockResolvedValue({ ok: true, paidCredits: 3 })
            ledger.chargeRestoration.mockResolvedValue({
                ok: true,
                restorationId: "restoration-uuid",
                remainingCredits: 2,
            })
            succeedRestorer("https://replicate.delivery/out.png")

            const response = await POST(
                createMockRequest(createMockFile("test.jpg", "image/jpeg"), "grandma.jpg"),
            )
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toEqual({
                success: true,
                data: {
                    restoredImageUrl: "https://replicate.delivery/out.png",
                    usedFreeCredit: false,
                    remainingPaidCredits: 2,
                },
            })
            expect(ledger.balance).toHaveBeenCalledWith("clerk_user_123")
            expect(ledger.chargeRestoration).toHaveBeenCalledTimes(1)
            expect(ledger.chargeRestoration).toHaveBeenCalledWith("clerk_user_123", {
                originalUrl: "ephemeral:grandma.jpg",
                restoredUrl: "https://replicate.delivery/out.png",
                useFreeCredit: false,
            })
            expect(ledger.reverseRestoration).not.toHaveBeenCalled()
        })

        it.each([
            { failure: { ok: false, reason: "no_credits" } as const, logged: "no_credits" },
            { failure: { ok: false, reason: "user_not_found" } as const, logged: "user_not_found" },
            { failure: { ok: false, reason: "db_error", message: "Internal error" } as const, logged: "Internal error" },
        ])("answers 500 when the Charge gives $failure.reason, and reverses nothing", async ({ failure, logged }) => {
            ledger.balance.mockResolvedValue({ ok: true, paidCredits: 1 })
            ledger.chargeRestoration.mockResolvedValue(failure)
            succeedRestorer()

            const response = await POST(createMockRequest(createMockFile("test.jpg", "image/jpeg")))
            const data = await response.json()

            expect(response.status).toBe(500)
            expect(data).toEqual({ success: false, error: "Failed to record restoration" })
            expect(logger.error).toHaveBeenCalledWith(
                { userId: "clerk_user_123", error: logged },
                "Failed to deduct credit",
            )
            expect(ledger.reverseRestoration).not.toHaveBeenCalled()
        })
    })
})
