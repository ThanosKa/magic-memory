import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { GET } from "@/app/api/credits/route";

vi.mock("@clerk/nextjs/server");
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/redis");
vi.mock("@/lib/logger");

function mockSupabaseWithUser(user: { paid_credits: number } | null) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue(
            user
              ? { data: user, error: null }
              : { data: null, error: { message: "Not found" } }
          ),
        }),
      }),
    }),
  };
}

describe("GET /api/credits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<
      ReturnType<typeof auth>
    >);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 404 when user not found in database", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabaseWithUser(null) as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("User not found");
  });

  it("returns paid credits only — hasFreeDaily is always false", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabaseWithUser({ paid_credits: 50 }) as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.paidCredits).toBe(50);
    expect(data.data.hasFreeDaily).toBe(false);
    expect(data.data.totalCredits).toBe(50);
  });

  it("returns 0 credits for a user with paid_credits = 0", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabaseWithUser({ paid_credits: 0 }) as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.paidCredits).toBe(0);
    expect(data.data.hasFreeDaily).toBe(false);
    expect(data.data.totalCredits).toBe(0);
  });

  it("grants exactly 1 credit to a fresh signup (paid_credits = 1 from webhook)", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabaseWithUser({ paid_credits: 1 }) as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.paidCredits).toBe(1);
    expect(data.data.totalCredits).toBe(1);
    expect(data.data.hasFreeDaily).toBe(false);
  });
});
