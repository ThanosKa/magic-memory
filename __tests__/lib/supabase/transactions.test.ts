import { describe, it, expect, vi, beforeEach } from "vitest"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import {
    checkUserCredits,
    deductCreditAndRecordRestoration,
    rollbackRestoration,
} from "@/lib/supabase/transactions"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/logger")

describe("transactions", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("checkUserCredits", () => {
        it("returns null when user not found", async () => {
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

            const result = await checkUserCredits("clerk_user_123")
            expect(result).toBeNull()
        })

        it("returns credit state from RPC when user exists", async () => {
            const mockCreditResult = {
                has_credits: true,
                has_free_daily: true,
                paid_credits: 50,
                should_use_free: true,
            }

            const mockSupabase = {
                from: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { id: "user-uuid" }, error: null }),
                        }),
                    }),
                }),
                rpc: vi.fn().mockResolvedValue({ data: [mockCreditResult], error: null }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await checkUserCredits("clerk_user_123")

            expect(result).toEqual(mockCreditResult)
            expect(mockSupabase.rpc).toHaveBeenCalledWith("check_user_credits", { p_user_id: "user-uuid" })
        })

        it("returns null when RPC fails", async () => {
            const mockSupabase = {
                from: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { id: "user-uuid" }, error: null }),
                        }),
                    }),
                }),
                rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "RPC error" } }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await checkUserCredits("clerk_user_123")
            expect(result).toBeNull()
        })
    })

    describe("deductCreditAndRecordRestoration", () => {
        it("returns success result when transaction succeeds", async () => {
            const mockResult = {
                success: true,
                restoration_id: "restoration-uuid",
                remaining_paid_credits: 49,
                error_message: null,
            }

            const mockSupabase = {
                from: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { id: "user-uuid" }, error: null }),
                        }),
                    }),
                }),
                rpc: vi.fn().mockResolvedValue({ data: [mockResult], error: null }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await deductCreditAndRecordRestoration(
                "clerk_user_123",
                "original.jpg",
                "restored.jpg",
                true
            )

            expect(result).toEqual(mockResult)
            expect(mockSupabase.rpc).toHaveBeenCalledWith("deduct_credit_and_record_restoration", {
                p_user_id: "user-uuid",
                p_original_url: "original.jpg",
                p_restored_url: "restored.jpg",
                p_use_free_credit: true,
            })
        })

        it("returns error when user not found", async () => {
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

            const result = await deductCreditAndRecordRestoration(
                "invalid_user",
                "original.jpg",
                "restored.jpg",
                false
            )

            expect(result.success).toBe(false)
            expect(result.error_message).toBe("User not found")
        })

        it("returns error when RPC fails", async () => {
            const mockSupabase = {
                from: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { id: "user-uuid" }, error: null }),
                        }),
                    }),
                }),
                rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "Transaction failed" } }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await deductCreditAndRecordRestoration(
                "clerk_user_123",
                "original.jpg",
                "restored.jpg",
                true
            )

            expect(result.success).toBe(false)
            expect(result.error_message).toBe("Transaction failed")
        })
    })

    describe("rollbackRestoration", () => {
        it("returns true when rollback succeeds", async () => {
            const mockSupabase = {
                rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await rollbackRestoration("restoration-uuid")

            expect(result).toBe(true)
            expect(mockSupabase.rpc).toHaveBeenCalledWith("rollback_restoration", {
                p_restoration_id: "restoration-uuid",
            })
        })

        it("returns false when rollback fails", async () => {
            const mockSupabase = {
                rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "Rollback failed" } }),
            }
            vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

            const result = await rollbackRestoration("restoration-uuid")
            expect(result).toBe(false)
        })
    })
})
