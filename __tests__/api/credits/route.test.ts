import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";
import { GET } from "@/app/api/credits/route";

vi.mock("@clerk/nextjs/server");
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/redis");
vi.mock("@/lib/logger");

function mockClerkUserWithoutEmail() {
  return vi.mocked(clerkClient).mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        emailAddresses: [],
        firstName: null,
        lastName: null,
      }),
    },
  } as unknown as Awaited<ReturnType<typeof clerkClient>>);
}

function mockClerkUserWithEmail() {
  return vi.mocked(clerkClient).mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        emailAddresses: [{ emailAddress: "a@b.c" }],
        firstName: null,
        lastName: null,
      }),
    },
  } as unknown as Awaited<ReturnType<typeof clerkClient>>);
}

function mockSupabaseWithUser(user: { paid_credits: number } | null) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue(
            user ? { data: user, error: null } : { data: null, error: null }
          ),
        }),
      }),
    }),
  };
}

/**
 * The User read fails, while a Provisioning write would succeed with a fresh
 * 1-credit row. `single` answers like `maybeSingle` so code that still asks
 * for exactly one row reaches the write instead of throwing.
 */
function mockSupabaseWithReadError(message: string) {
  const readResult = { data: null, error: { message } };
  const writeChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { paid_credits: 1 }, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: { paid_credits: 1 }, error: null }),
  };
  const table = {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(readResult),
        maybeSingle: vi.fn().mockResolvedValue(readResult),
      }),
    }),
    insert: vi.fn().mockReturnValue(writeChain),
    upsert: vi.fn().mockReturnValue(writeChain),
    update: vi.fn().mockReturnValue(writeChain),
  };
  return { supabase: { from: vi.fn().mockReturnValue(table) }, table };
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

  it("returns 404 when user not found in database and Clerk has no email", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      mockSupabaseWithUser(null) as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    mockClerkUserWithoutEmail();

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("User not found");
  });

  it("returns 500 and writes nothing when the User read fails", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk_user_123" } as Awaited<
      ReturnType<typeof auth>
    >);

    const { supabase, table } = mockSupabaseWithReadError("fetch failed");
    vi.mocked(getSupabaseAdminClient).mockReturnValue(
      supabase as unknown as ReturnType<typeof getSupabaseAdminClient>
    );

    mockClerkUserWithEmail();
    const logError = vi.spyOn(logger, "error");

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      success: false,
      error: "Failed to load credits. Please try again.",
    });
    expect(response.status).toBe(500);
    expect(clerkClient).not.toHaveBeenCalled();
    expect(table.insert).not.toHaveBeenCalled();
    expect(table.upsert).not.toHaveBeenCalled();
    expect(table.update).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(
      { userId: "clerk_user_123", error: "fetch failed" },
      "Failed to read user from database"
    );
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
});
