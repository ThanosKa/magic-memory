import { vi } from "vitest"

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn(() => Promise.resolve({ userId: null })),
    clerkClient: vi.fn(() =>
        Promise.resolve({
            users: {
                getUser: vi.fn(),
            },
        })
    ),
}))

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
    getSupabaseAdminClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
                })),
            })),
            insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
            update: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
            })),
            delete: vi.fn(() => ({
                eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
            })),
            upsert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
                })),
            })),
        })),
        rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    createSupabaseServerClient: vi.fn(),
}))

// Mock Redis
vi.mock("@/lib/redis", () => ({
    getRedisClient: vi.fn(() => null),
    hasUsedFreeCredit: vi.fn(() => Promise.resolve(false)),
    markFreeCreditUsed: vi.fn(() => Promise.resolve(true)),
    getFreeCreditKey: vi.fn((userId: string) => `free_credit:${userId}:2024-01-01`),
    getSecondsUntilMidnightUTC: vi.fn(() => 3600),
}))

// Mock logger to silence output during tests
vi.mock("@/lib/logger", () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        child: vi.fn(() => ({
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
        })),
    },
}))

// Mock Replicate
vi.mock("replicate", () => ({
    default: vi.fn().mockImplementation(() => ({
        predictions: {
            create: vi.fn(() =>
                Promise.resolve({
                    id: "test-prediction-id",
                    status: "starting",
                })
            ),
            get: vi.fn(() =>
                Promise.resolve({
                    id: "test-prediction-id",
                    status: "succeeded",
                    output: "https://replicate.delivery/test-restored-image.png",
                })
            ),
        },
    })),
}))

// Mock Stripe
vi.mock("stripe", () => ({
    default: vi.fn().mockImplementation(() => ({
        webhooks: {
            constructEvent: vi.fn(),
        },
        checkout: {
            sessions: {
                create: vi.fn(() =>
                    Promise.resolve({
                        id: "cs_test_123",
                        url: "https://checkout.stripe.com/test",
                    })
                ),
            },
        },
    })),
}))

// Mock svix for Clerk webhooks
vi.mock("svix", () => ({
    Webhook: vi.fn().mockImplementation(() => ({
        verify: vi.fn(),
    })),
}))
