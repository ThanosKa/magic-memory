import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { POST } from "@/app/api/stripe/create-checkout/route";
import { CREDIT_PACKAGES } from "@/lib/constants";

vi.mock("@clerk/nextjs/server");
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/logger");

const { mockStripeCheckoutCreate } = vi.hoisted(() => {
  return { mockStripeCheckoutCreate: vi.fn() };
});

vi.mock("stripe", () => {
  return {
    default: function () {
      return {
        checkout: {
          sessions: {
            create: mockStripeCheckoutCreate,
          },
        },
      };
    },
  };
});

function createMockRequest(body: Record<string, unknown>): NextRequest {
  return {
    json: () => Promise.resolve(body),
  } as unknown as NextRequest;
}

describe("POST /api/stripe/create-checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStripeCheckoutCreate.mockReset();
    mockStripeCheckoutCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    });
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<
      ReturnType<typeof auth>
    >);

    const request = createMockRequest({ packageType: "starter" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid package type", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    const request = createMockRequest({ packageType: "invalid" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("returns error when user not found in database", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
          }),
        }),
      }),
    };
    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const originalPriceId = CREDIT_PACKAGES.starter.priceId;
    Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", {
      value: "price_starter",
      writable: true,
      configurable: true,
    });

    const request = createMockRequest({ packageType: "starter" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");

    Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", {
      value: originalPriceId,
      writable: true,
      configurable: true,
    });
  });

  it("returns checkout URL on success", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    const mockUser = {
      id: "user-uuid",
      email: "kazakis.th@gmail.com",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
          }),
        }),
      }),
    };
    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const originalPriceId = CREDIT_PACKAGES.starter.priceId;
    Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", {
      value: "price_starter",
      writable: true,
      configurable: true,
    });

    const request = createMockRequest({ packageType: "starter" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.url).toBe("https://checkout.stripe.com/test");

    Object.defineProperty(CREDIT_PACKAGES.starter, "priceId", {
      value: originalPriceId,
      writable: true,
      configurable: true,
    });
  });

  it("includes correct metadata in checkout session", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    const mockUser = { id: "user-uuid", email: "kazakis.th@gmail.com" };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
          }),
        }),
      }),
    };
    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const originalPriceId = CREDIT_PACKAGES.growth.priceId;
    Object.defineProperty(CREDIT_PACKAGES.growth, "priceId", {
      value: "price_growth",
      writable: true,
      configurable: true,
    });

    const request = createMockRequest({ packageType: "growth" });
    await POST(request);

    expect(mockStripeCheckoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          userId: "user-uuid",
          clerkUserId: "clerk_user_123",
          packageType: "growth",
          credits: "350",
        }),
      })
    );

    Object.defineProperty(CREDIT_PACKAGES.growth, "priceId", {
      value: originalPriceId,
      writable: true,
      configurable: true,
    });
  });
});
