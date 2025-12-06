import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { POST } from "@/app/api/stripe/webhook/route"
import { CREDIT_PACKAGES } from "@/lib/constants"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/logger")

const { mockStripeConstructEvent } = vi.hoisted(() => {
    return { mockStripeConstructEvent: vi.fn() }
})

vi.mock("stripe", () => {
    return {
        default: function () {
            return {
                webhooks: {
                    constructEvent: mockStripeConstructEvent,
                },
            }
        },
    }
})

function createMockRequest(body: string, signature = "valid_signature"): NextRequest {
    return {
        text: () => Promise.resolve(body),
        headers: new Headers({
            "stripe-signature": signature,
        }),
    } as unknown as NextRequest
}

describe("POST /api/stripe/webhook", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockStripeConstructEvent.mockReset()
    })

    it("returns 400 for invalid signature", async () => {
        mockStripeConstructEvent.mockImplementation(() => {
            throw new Error("Invalid signature")
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toContain("signature verification failed")
    })

    it("returns received: true for non-checkout events", async () => {
        mockStripeConstructEvent.mockReturnValue({
            type: "payment_intent.succeeded",
            data: { object: {} },
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)
    })

    it("skips duplicate payments (idempotency)", async () => {
        const mockSession = {
            id: "cs_test_123",
            metadata: {
                userId: "user-uuid",
                packageType: "starter",
                credits: "100",
                priceId: "price_starter",
            },
            payment_intent: "pi_existing",
            amount_total: 999,
            currency: "eur",
        }

        mockStripeConstructEvent.mockReturnValue({
            type: "checkout.session.completed",
            id: "evt_123",
            data: { object: mockSession },
        })

        const mockSupabase = {
            from: vi.fn((table: string) => {
                if (table === "purchases") {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({ data: { id: "existing-purchase" }, error: null }),
                            }),
                        }),
                        insert: vi.fn(),
                    }
                }
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { paid_credits: 0 }, error: null }),
                        }),
                    }),
                    update: vi.fn().mockReturnValue({
                        eq: vi.fn().mockResolvedValue({ error: null }),
                    }),
                }
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const originalPriceId = CREDIT_PACKAGES.starter.priceId
        Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", { value: "price_starter", writable: true, configurable: true })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)

        Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", { value: originalPriceId, writable: true, configurable: true })
    })

    it("adds correct credits for valid starter package", async () => {
        const mockSession = {
            id: "cs_test_123",
            metadata: {
                userId: "user-uuid",
                packageType: "starter",
                credits: "100",
                priceId: "price_starter",
            },
            payment_intent: "pi_new_123",
            amount_total: 999,
            currency: "eur",
        }

        mockStripeConstructEvent.mockReturnValue({
            type: "checkout.session.completed",
            id: "evt_123",
            data: { object: mockSession },
        })

        const mockUpdate = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
        })
        const mockInsert = vi.fn().mockResolvedValue({ error: null })

        const mockSupabase = {
            from: vi.fn((table: string) => {
                if (table === "purchases") {
                    return {
                        select: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
                            }),
                        }),
                        insert: mockInsert,
                    }
                }
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: { paid_credits: 50 }, error: null }),
                        }),
                    }),
                    update: mockUpdate,
                }
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        const originalPriceId = CREDIT_PACKAGES.starter.priceId
        Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", { value: "price_starter", writable: true, configurable: true })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)
        expect(mockUpdate).toHaveBeenCalledWith({ paid_credits: 150 })

        Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", { value: originalPriceId, writable: true, configurable: true })
    })
})
