import { describe, it, expect, vi, beforeEach, afterAll } from "vitest"
import { NextRequest } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { POST } from "@/app/api/clerk/webhook/route"
import { sendWelcomeEmail } from "@/lib/email"
import logger from "@/lib/logger"
import { provisionUser } from "@/lib/users"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/logger")
vi.mock("@/lib/email", () => ({ sendWelcomeEmail: vi.fn() }))
// Wraps the real provisionUser so one test can run it against a fake client;
// the rest stub its answer.
vi.mock("@/lib/users", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/lib/users")>()
    return { ...actual, provisionUser: vi.fn(actual.provisionUser) }
})

const userRow = { id: "u1", clerk_user_id: "clerk_user_123", email: "kazakis.th@gmail.com", paid_credits: 1 }
const fakeSupabase = { from: vi.fn() }

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
    const originalWebhookSecret = process.env.CLERK_WEBHOOK_SECRET

    beforeEach(() => {
        vi.clearAllMocks()
        mockWebhookVerify.mockReset()
        process.env.CLERK_WEBHOOK_SECRET = "whsec_test123"
    })

    afterAll(() => {
        process.env.CLERK_WEBHOOK_SECRET = originalWebhookSecret
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
        expect(data.error).toBe("Webhook processing failed")
    })

    it("provisions a new user on user.created and sends the welcome email", async () => {
        vi.mocked(getSupabaseAdminClient).mockReturnValue(fakeSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)
        vi.mocked(provisionUser).mockResolvedValueOnce({ ok: true, user: userRow, outcome: "created" })
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

        const response = await POST(createMockRequest("{}"))
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.data?.received).toBe(true)
        expect(provisionUser).toHaveBeenCalledWith(
            {
                clerkUserId: "clerk_user_123",
                email: "kazakis.th@gmail.com",
                name: "John Doe",
                imageUrl: "https://example.com/photo.jpg",
                emailVerified: false,
            },
            { supabase: fakeSupabase }
        )
        expect(sendWelcomeEmail).toHaveBeenCalledWith("kazakis.th@gmail.com", "John Doe")
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
        expect(data.data?.received).toBe(true)
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
        expect(data.data?.received).toBe(true)
        expect(mockDelete).toHaveBeenCalled()
    })

    it("handles user with no name gracefully", async () => {
        vi.mocked(getSupabaseAdminClient).mockReturnValue(fakeSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)
        vi.mocked(provisionUser).mockResolvedValueOnce({ ok: true, user: userRow, outcome: "created" })
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

        await POST(createMockRequest("{}"))

        expect(provisionUser).toHaveBeenCalledWith(
            { clerkUserId: "clerk_user_123", email: "kazakis.th@gmail.com", name: null, imageUrl: null, emailVerified: false },
            { supabase: fakeSupabase }
        )
    })

    it("returns 500 when database insert fails", async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnValue({
                upsert: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
                    }),
                }),
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

    const userCreatedEvent = {
        type: "user.created",
        data: {
            id: "clerk_user_123",
            email_addresses: [
                { id: "e1", email_address: "kazakis.th@gmail.com", verification: { status: "verified" } },
            ],
            primary_email_address_id: "e1",
            first_name: "John",
            last_name: "Doe",
            image_url: null,
        },
    }

    it("answers 200 with no email when the row already existed", async () => {
        vi.mocked(getSupabaseAdminClient).mockReturnValue(fakeSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)
        vi.mocked(provisionUser).mockResolvedValueOnce({ ok: true, user: userRow, outcome: "already_existed" })
        mockWebhookVerify.mockReturnValue(userCreatedEvent)

        const response = await POST(createMockRequest("{}"))

        expect(response.status).toBe(200)
        expect(sendWelcomeEmail).not.toHaveBeenCalled()
    })

    const addr = (id: string, email: string, status: string) => ({
        id,
        email_address: email,
        verification: { status },
    })

    async function createdWith(email_addresses: unknown[], primary: string | null) {
        vi.mocked(getSupabaseAdminClient).mockReturnValue(fakeSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)
        vi.mocked(provisionUser).mockResolvedValueOnce({ ok: true, user: userRow, outcome: "created" })
        mockWebhookVerify.mockReturnValue({
            type: "user.created",
            data: { ...userCreatedEvent.data, email_addresses, primary_email_address_id: primary },
        })
        await POST(createMockRequest("{}"))
    }

    it("uses the primary address, not the first, and passes a verified one as verified", async () => {
        await createdWith([addr("e1", "other@x.com", "unverified"), addr("e2", "main@x.com", "verified")], "e2")
        expect(provisionUser).toHaveBeenCalledWith(
            expect.objectContaining({ email: "main@x.com", emailVerified: true }),
            expect.anything()
        )
    })

    it("passes an unverified primary address as not verified", async () => {
        await createdWith([addr("e1", "main@x.com", "unverified")], "e1")
        expect(provisionUser).toHaveBeenCalledWith(
            expect.objectContaining({ email: "main@x.com", emailVerified: false }),
            expect.anything()
        )
    })

    it("re-links the existing row to the new Clerk id on user.created", async () => {
        const relinkedRow = { id: "u1", clerk_user_id: "clerk_user_123", email: "kazakis.th@gmail.com", paid_credits: 5 }
        const chain = (result: unknown) => {
            const c = {
                select: vi.fn(() => c),
                eq: vi.fn(() => c),
                single: vi.fn().mockResolvedValue(result),
                maybeSingle: vi.fn().mockResolvedValue(result),
            }
            return c
        }
        const upsertChain = chain({
            data: null,
            error: {
                code: "23505",
                message: 'duplicate key value violates unique constraint "users_email_key"',
            },
        })
        const updateChain = chain({ data: relinkedRow, error: null })
        const table = { upsert: vi.fn(() => upsertChain), update: vi.fn(() => updateChain) }
        const mockSupabase = { from: vi.fn().mockReturnValue(table) }
        vi.mocked(getSupabaseAdminClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>)
        mockWebhookVerify.mockReturnValue(userCreatedEvent)
        const logWarn = vi.spyOn(logger, "warn")

        const response = await POST(createMockRequest("{}"))

        expect(response.status).toBe(200)
        expect(table.update).toHaveBeenCalledWith(
            expect.objectContaining({ clerk_user_id: "clerk_user_123" })
        )
        expect(table.update).toHaveBeenCalledWith(
            expect.not.objectContaining({ paid_credits: expect.anything() })
        )
        expect(updateChain.eq).toHaveBeenCalledWith("email", "kazakis.th@gmail.com")
        expect(sendWelcomeEmail).not.toHaveBeenCalled()
        expect(logWarn).toHaveBeenCalledWith(
            { userId: "clerk_user_123", email: "kazakis.th@gmail.com" },
            "Existing user row re-linked to new Clerk id"
        )
    })
})
