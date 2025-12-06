import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { POST } from "@/app/api/clerk/webhook/route"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/logger")

const mockWebhookVerify = vi.fn()

vi.mock("svix", () => {
    return {
        Webhook: function () {
            return {
                verify: mockWebhookVerify,
            }
        },
    }
})

function createMockRequest(
    body: string,
    headers: Record<string, string> = {}
): NextRequest {
    const defaultHeaders = {
        "svix-id": "msg_123",
        "svix-timestamp": "1234567890",
        "svix-signature": "v1,abc123",
        ...headers,
    }

    return {
        text: () => Promise.resolve(body),
        headers: new Headers(defaultHeaders),
    } as unknown as NextRequest
}

describe("POST /api/clerk/webhook", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockWebhookVerify.mockReset()
        process.env.CLERK_WEBHOOK_SECRET = "whsec_test123"
    })

    it("returns 400 for missing svix headers", async () => {
        const request = {
            text: () => Promise.resolve("{}"),
            headers: new Headers({}),
        } as unknown as NextRequest

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Missing svix headers")
    })

    it("returns 400 for invalid signature", async () => {
        mockWebhookVerify.mockImplementation(() => {
            throw new Error("Invalid signature")
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe("Invalid signature")
    })

    it("inserts new user on user.created event", async () => {
        const mockInsert = vi.fn().mockResolvedValue({ error: null })

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                insert: mockInsert,
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        mockWebhookVerify.mockReturnValue({
            type: "user.created",
            data: {
                id: "clerk_user_123",
                email_addresses: [{ email_address: "kazakis.th@gmail.com" }],
                first_name: "John",
                last_name: "Doe",
                image_url: "https://example.com/photo.jpg",
            },
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)
        expect(mockInsert).toHaveBeenCalledWith({
            clerk_user_id: "clerk_user_123",
            email: "kazakis.th@gmail.com",
            name: "John Doe",
            profile_image: "https://example.com/photo.jpg",
            paid_credits: 0,
        })
    })

    it("updates user on user.updated event", async () => {
        const mockUpdate = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
        })

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                update: mockUpdate,
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        mockWebhookVerify.mockReturnValue({
            type: "user.updated",
            data: {
                id: "clerk_user_123",
                email_addresses: [{ email_address: "kazakis.th@gmail.com" }],
                first_name: "Jane",
                last_name: "Smith",
                image_url: "https://example.com/new-photo.jpg",
            },
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)
        expect(mockUpdate).toHaveBeenCalledWith({
            email: "kazakis.th@gmail.com",
            name: "Jane Smith",
            profile_image: "https://example.com/new-photo.jpg",
        })
    })

    it("deletes user on user.deleted event", async () => {
        const mockDelete = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
        })

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                delete: mockDelete,
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        mockWebhookVerify.mockReturnValue({
            type: "user.deleted",
            data: {
                id: "clerk_user_123",
            },
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.received).toBe(true)
        expect(mockDelete).toHaveBeenCalled()
    })

    it("handles user with no name gracefully", async () => {
        const mockInsert = vi.fn().mockResolvedValue({ error: null })

        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                insert: mockInsert,
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        mockWebhookVerify.mockReturnValue({
            type: "user.created",
            data: {
                id: "clerk_user_123",
                email_addresses: [{ email_address: "kazakis.th@gmail.com" }],
                first_name: null,
                last_name: null,
                image_url: null,
            },
        })

        const request = createMockRequest("{}")
        await POST(request)

        expect(mockInsert).toHaveBeenCalledWith({
            clerk_user_id: "clerk_user_123",
            email: "kazakis.th@gmail.com",
            name: null,
            profile_image: null,
            paid_credits: 0,
        })
    })

    it("returns 500 when database insert fails", async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                insert: vi.fn().mockResolvedValue({ error: { message: "Database error" } }),
            }),
        }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)

        mockWebhookVerify.mockReturnValue({
            type: "user.created",
            data: {
                id: "clerk_user_123",
                email_addresses: [{ email_address: "kazakis.th@gmail.com" }],
                first_name: "John",
                last_name: "Doe",
                image_url: null,
            },
        })

        const request = createMockRequest("{}")
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe("Failed to create user")
    })
})
