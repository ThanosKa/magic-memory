import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";
import { GET } from "@/app/api/credits/route";
import { POST } from "@/app/api/clerk/webhook/route";
import type { NextRequest } from "next/server";

vi.mock("@clerk/nextjs/server");
vi.mock("@/lib/supabase/server");
vi.mock("@/lib/logger");
// No test sends a real email: the sender is a double.
vi.mock("@/lib/email", () => ({ sendWelcomeEmail: vi.fn() }));

const mockWebhookVerify = vi.fn();
vi.mock("svix", () => ({
  Webhook: function () {
    return { verify: mockWebhookVerify };
  },
}));

type Row = { id: string; clerk_user_id: string; email: string; name: string | null; paid_credits: number };

/** An in-memory users table that answers like Supabase for the calls Provisioning makes. */
function fakeUsersTable() {
  const rows = new Map<string, Row>();
  const table = {
    upsert: (row: Omit<Row, "id">) => ({
      select: () => ({
        maybeSingle: async () => {
          if (rows.has(row.clerk_user_id)) return { data: null, error: null };
          const created = { id: `u${rows.size + 1}`, ...row };
          rows.set(row.clerk_user_id, created);
          return { data: created, error: null };
        },
      }),
    }),
    select: () => ({
      eq: (_column: string, clerkUserId: string) => ({
        maybeSingle: async () => ({ data: rows.get(clerkUserId) ?? null, error: null }),
      }),
    }),
  };
  return { supabase: { from: () => table }, rows };
}

function clerkHasUser() {
  vi.mocked(auth).mockResolvedValue({ userId: "clerk_new" } as Awaited<ReturnType<typeof auth>>);
  vi.mocked(clerkClient).mockResolvedValue({
    users: {
      getUser: vi.fn().mockResolvedValue({
        emailAddresses: [{ id: "e1", emailAddress: "ada@example.com", verification: { status: "verified" } }],
        primaryEmailAddressId: "e1",
        firstName: "Ada",
        lastName: "Lovelace",
      }),
    },
  } as unknown as Awaited<ReturnType<typeof clerkClient>>);
}

function webhookRequest(): NextRequest {
  return {
    text: () => Promise.resolve("{}"),
    headers: new Headers({ "svix-id": "m", "svix-timestamp": "1", "svix-signature": "v1,x" }),
  } as unknown as NextRequest;
}

const userCreated = {
  type: "user.created",
  data: {
    id: "clerk_new",
    email_addresses: [{ id: "e1", email_address: "ada@example.com", verification: { status: "verified" } }],
    primary_email_address_id: "e1",
    first_name: "Ada",
    last_name: "Lovelace",
    image_url: null,
  },
};

describe("the welcome email goes out from whichever path created the User", () => {
  const originalSecret = process.env.CLERK_WEBHOOK_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_WEBHOOK_SECRET = "whsec_test";
  });
  afterAll(() => {
    process.env.CLERK_WEBHOOK_SECRET = originalSecret;
  });

  it("GET /api/credits creating the User sends exactly one email, and a later user.created sends none", async () => {
    const { supabase, rows } = fakeUsersTable();
    vi.mocked(getSupabaseAdminClient).mockReturnValue(supabase as unknown as ReturnType<typeof getSupabaseAdminClient>);
    clerkHasUser();

    const credits = await GET();
    expect(credits.status).toBe(200);
    expect(rows.size).toBe(1);
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendWelcomeEmail).toHaveBeenCalledWith({ to: "ada@example.com", name: "Ada Lovelace" });

    mockWebhookVerify.mockReturnValue(userCreated);
    const webhook = await POST(webhookRequest());
    expect(webhook.status).toBe(200);
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });

  it("user.created winning the race sends one email, and a later GET /api/credits sends none", async () => {
    const { supabase } = fakeUsersTable();
    vi.mocked(getSupabaseAdminClient).mockReturnValue(supabase as unknown as ReturnType<typeof getSupabaseAdminClient>);
    clerkHasUser();

    mockWebhookVerify.mockReturnValue(userCreated);
    await POST(webhookRequest());
    await GET();

    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendWelcomeEmail).toHaveBeenCalledWith({ to: "ada@example.com", name: "Ada Lovelace" });
  });
});
