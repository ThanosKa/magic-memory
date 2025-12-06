import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { GET } from "@/app/api/credits/route"

vi.mock("@clerk/nextjs/server")
vi.mock("@/lib/supabase/server")
vi.mock("@/lib/redis")
vi.mock("@/lib/logger")

describe("GET /api/credits", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns 401 when not authenticated", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.success).toBe(false)
        expect(data.error).toBe("Unauthorized")
    })

    it("returns 404 when user not found in database", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
                    }),
                }),
            }),
            rpc: vi.fn(),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.success).toBe(false)
        expect(data.error).toContain("User not found")
    })

    it("returns correct credit balance with free and paid credits", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const mockUser = {
            id: "user-uuid",
            clerk_user_id: "clerk_user_123",
            paid_credits: 50,
            email: "test@example.com",
        }

        const mockCreditResult = {
            has_free_daily: true,
            paid_credits: 50,
        }

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
                    }),
                }),
            }),
            rpc: vi.fn().mockResolvedValue({ data: [mockCreditResult], error: null }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.data.paidCredits).toBe(50)
        expect(data.data.hasFreeDaily).toBe(true)
        expect(data.data.totalCredits).toBe(51)
    })

    it("includes freeResetTime as ISO string", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const mockUser = { id: "user-uuid", clerk_user_id: "clerk_user_123", paid_credits: 0, email: "test@example.com" }
        const mockCreditResult = { has_free_daily: false, paid_credits: 0 }

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
                    }),
                }),
            }),
            rpc: vi.fn().mockResolvedValue({ data: [mockCreditResult], error: null }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const response = await GET()
        const data = await response.json()

        expect(data.data.freeResetTime).toBeDefined()
        expect(new Date(data.data.freeResetTime).toISOString()).toBe(data.data.freeResetTime)
    })

    it("returns 500 when credit check RPC fails", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const mockUser = { id: "user-uuid", clerk_user_id: "clerk_user_123", email: "test@example.com" }

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
                    }),
                }),
            }),
            rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "RPC error" } }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.success).toBe(false)
    })

    it("calculates totalCredits as paid + free (1)", async () => {
        vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<ReturnType<typeof auth>>)

        const mockUser = { id: "user-uuid", clerk_user_id: "clerk_user_123", email: "test@example.com" }
        const mockCreditResult = { has_free_daily: true, paid_credits: 100 }

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
                    }),
                }),
            }),
            rpc: vi.fn().mockResolvedValue({ data: [mockCreditResult], error: null }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const response = await GET()
        const data = await response.json()

        expect(data.data.totalCredits).toBe(101)
        expect(data.data.paidCredits).toBe(100)
        expect(data.data.hasFreeDaily).toBe(true)
    })
})
