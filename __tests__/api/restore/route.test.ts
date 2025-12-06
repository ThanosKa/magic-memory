import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { POST } from "@/app/api/restore/route"
import { checkUserCredits, deductCreditAndRecordRestoration } from "@/lib/supabase/transactions"
import { getRedisClient, markFreeCreditUsed } from "@/lib/redis"

vi.mock("@clerk/nextjs/server")
vi.mock("@/lib/supabase/server")
vi.mock("@/lib/supabase/transactions")
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

        vi.mocked(checkUserCredits).mockResolvedValue({
            has_credits: false,
            has_free_daily: false,
            paid_credits: 0,
            should_use_free: false,
        })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile)
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(403)
        expect(data.success).toBe(false)
        expect(data.error).toContain("No credits available")
    })

    it("uses free credit when available", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        vi.mocked(checkUserCredits).mockResolvedValue({
            has_credits: true,
            has_free_daily: true,
            paid_credits: 50,
            should_use_free: true,
        })

        vi.mocked(deductCreditAndRecordRestoration).mockResolvedValue({
            success: true,
            restoration_id: "restoration-uuid",
            remaining_paid_credits: 50,
            error_message: null,
        })

        vi.mocked(markFreeCreditUsed).mockResolvedValue(true)

        mockPredictionsCreate.mockResolvedValue({ id: "pred-123", status: "starting" })
        mockPredictionsGet.mockResolvedValue({
            id: "pred-123",
            status: "succeeded",
            output: "https://replicate.delivery/restored.png",
        })

        const validFile = createMockFile("test.jpg", "image/jpeg")
        const request = createMockRequest(validFile, "my-photo.jpg")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.data.usedFreeCredit).toBe(true)
        expect(data.data.restoredImageUrl).toBeDefined()
    })

    it("uses paid credit when no free available", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        vi.mocked(checkUserCredits).mockResolvedValue({
            has_credits: true,
            has_free_daily: false,
            paid_credits: 50,
            should_use_free: false,
        })

        vi.mocked(deductCreditAndRecordRestoration).mockResolvedValue({
            success: true,
            restoration_id: "restoration-uuid",
            remaining_paid_credits: 49,
            error_message: null,
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

        vi.mocked(checkUserCredits).mockResolvedValue({
            has_credits: true,
            has_free_daily: true,
            paid_credits: 0,
            should_use_free: true,
        })

        vi.mocked(deductCreditAndRecordRestoration).mockResolvedValue({
            success: true,
            restoration_id: "restoration-uuid",
            remaining_paid_credits: 0,
            error_message: null,
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
        expect(data.data.restorationId).toBe("restoration-uuid")
    })
})
