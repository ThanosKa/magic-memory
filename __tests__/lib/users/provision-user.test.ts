import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { provisionUser } from "@/lib/users";

vi.mock("@/lib/logger");

const row = {
  id: "u1",
  clerk_user_id: "new",
  email: "a@b.c",
  paid_credits: 5,
};

function chain(result: unknown) {
  const c = {
    select: vi.fn(() => c),
    eq: vi.fn(() => c),
    single: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
  return c;
}

function fakeClient(params: { upsert: unknown; update?: unknown; read?: unknown }) {
  const upsertChain = chain(params.upsert);
  const updateChain = chain(params.update);
  const readChain = chain(params.read);
  const table = {
    upsert: vi.fn((_row: unknown, _options: unknown) => upsertChain),
    update: vi.fn(() => updateChain),
    select: vi.fn(() => readChain),
  };
  const supabase = { from: vi.fn(() => table) };
  // Test double: only the used query-builder surface is implemented.
  return { supabase: supabase as unknown as SupabaseClient, table, updateChain, readChain };
}

const sendWelcomeEmail = vi.fn();

describe("provisionUser", () => {
  beforeEach(() => {
    sendWelcomeEmail.mockReset();
  });

  it("returns created user", async () => {
    const { supabase } = fakeClient({ upsert: { data: row, error: null } });
    const r = await provisionUser({ clerkUserId: "new", email: "a@b.c", name: null }, { supabase, sendWelcomeEmail });
    expect(r).toEqual({ ok: true, user: row, outcome: "created" });
  });

  it("re-links existing row on email conflict", async () => {
    const { supabase, table, updateChain } = fakeClient({
      upsert: {
        data: null,
        error: { code: "23505", message: 'duplicate key value violates unique constraint "users_email_key"' },
      },
      update: { data: row, error: null },
    });
    const r = await provisionUser({ clerkUserId: "new", email: "a@b.c", name: "N", emailVerified: true }, { supabase, sendWelcomeEmail });
    expect(table.update).toHaveBeenCalledWith({ clerk_user_id: "new", name: "N" });
    expect(updateChain.eq).toHaveBeenCalledWith("email", "a@b.c");
    expect(r).toEqual({ ok: true, user: row, outcome: "relinked" });
  });

  it("keeps the stored name when a re-link brings no name, and updates the image when given", async () => {
    const { supabase, table } = fakeClient({
      upsert: {
        data: null,
        error: { code: "23505", message: 'duplicate key value violates unique constraint "users_email_key"' },
      },
      update: { data: row, error: null },
    });
    await provisionUser(
      { clerkUserId: "new", email: "a@b.c", name: null, imageUrl: "https://x.y/i.png", emailVerified: true },
      { supabase, sendWelcomeEmail }
    );
    expect(table.update).toHaveBeenCalledWith({ clerk_user_id: "new", profile_image: "https://x.y/i.png" });
  });

  describe.each([
    ["the email is not verified", { email: "a@b.c", emailVerified: false }],
    ["verification is not stated", { email: "a@b.c" }],
    ["the email is empty", { email: "", emailVerified: true }],
  ])("never re-links when %s", (_label, extra) => {
    it("fails and writes nothing", async () => {
      const { supabase, table } = fakeClient({
        upsert: {
          data: null,
          error: { code: "23505", message: 'duplicate key value violates unique constraint "users_email_key"' },
        },
      });
      const r = await provisionUser({ clerkUserId: "new", name: "N", ...extra }, { supabase, sendWelcomeEmail });
      expect(r.ok).toBe(false);
      expect(table.update).not.toHaveBeenCalled();
    });
  });

  it("returns an existing row untouched when the Clerk id already has one", async () => {
    const existing = { ...row, paid_credits: 50 };
    const { supabase, table, readChain } = fakeClient({
      upsert: { data: null, error: null },
      read: { data: existing, error: null },
    });
    const r = await provisionUser({ clerkUserId: "new", email: "a@b.c", name: null }, { supabase, sendWelcomeEmail });
    expect(r).toEqual({ ok: true, user: existing, outcome: "already_existed" });
    expect(table.upsert).toHaveBeenCalledWith(
      { clerk_user_id: "new", email: "a@b.c", name: null, paid_credits: 1 },
      { onConflict: "clerk_user_id", ignoreDuplicates: true }
    );
    expect(readChain.eq).toHaveBeenCalledWith("clerk_user_id", "new");
    expect(table.update).not.toHaveBeenCalled();
  });

  it("leaves profile_image out of the insert unless an image URL is given", async () => {
    const { supabase, table } = fakeClient({ upsert: { data: row, error: null } });
    await provisionUser({ clerkUserId: "new", email: "a@b.c", name: null }, { supabase, sendWelcomeEmail });
    expect(table.upsert.mock.calls[0][0]).not.toHaveProperty("profile_image");
    await provisionUser(
      { clerkUserId: "new", email: "a@b.c", name: null, imageUrl: "https://x.y/i.png" },
      { supabase, sendWelcomeEmail }
    );
    expect(table.upsert.mock.calls[1][0]).toHaveProperty("profile_image", "https://x.y/i.png");
  });

  it("fails on other errors", async () => {
    const { supabase } = fakeClient({ upsert: { data: null, error: { code: "XX", message: "boom" } } });
    const r = await provisionUser({ clerkUserId: "new", email: "a@b.c", name: null }, { supabase, sendWelcomeEmail });
    expect(r).toEqual({ ok: false, message: "boom" });
  });

  describe("welcome email", () => {
    const profile = { clerkUserId: "new", email: "a@b.c", name: "N" };

    it("sends one email with the User's email and name on created", async () => {
      const { supabase } = fakeClient({ upsert: { data: row, error: null } });
      await provisionUser(profile, { supabase, sendWelcomeEmail });
      expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
      expect(sendWelcomeEmail).toHaveBeenCalledWith("a@b.c", "N");
    });

    it("sends none when the row already existed", async () => {
      const { supabase } = fakeClient({ upsert: { data: null, error: null }, read: { data: row, error: null } });
      await provisionUser(profile, { supabase, sendWelcomeEmail });
      expect(sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("sends none on relinked", async () => {
      const { supabase } = fakeClient({
        upsert: {
          data: null,
          error: { code: "23505", message: 'duplicate key value violates unique constraint "users_email_key"' },
        },
        update: { data: row, error: null },
      });
      const r = await provisionUser({ ...profile, emailVerified: true }, { supabase, sendWelcomeEmail });
      expect(r).toMatchObject({ ok: true, outcome: "relinked" });
      expect(sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("sends none on a database error", async () => {
      const { supabase } = fakeClient({ upsert: { data: null, error: { code: "XX", message: "boom" } } });
      const r = await provisionUser(profile, { supabase, sendWelcomeEmail });
      expect(r.ok).toBe(false);
      expect(sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("sends exactly one in total for two concurrent calls", async () => {
      // Insert-or-nothing: the first insert wins, the second hits the conflict.
      const upsertResults = [{ data: row, error: null }, { data: null, error: null }];
      const upsertChain = () => {
        const result = upsertResults.shift();
        const c = { select: () => c, maybeSingle: async () => result };
        return c;
      };
      const readChain = { select: () => readChain, eq: () => readChain, maybeSingle: async () => ({ data: row, error: null }) };
      const table = { upsert: upsertChain, select: () => readChain };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await Promise.all([
        provisionUser(profile, { supabase, sendWelcomeEmail }),
        provisionUser(profile, { supabase, sendWelcomeEmail }),
      ]);
      expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
    });

    it("is awaited before provisionUser returns", async () => {
      let finished = false;
      sendWelcomeEmail.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        finished = true;
      });
      const { supabase } = fakeClient({ upsert: { data: row, error: null } });
      await provisionUser(profile, { supabase, sendWelcomeEmail });
      expect(finished).toBe(true);
    });

    it("never fails Provisioning when the send throws", async () => {
      sendWelcomeEmail.mockImplementation(async () => {
        throw new Error("resend down");
      });
      const { supabase } = fakeClient({ upsert: { data: row, error: null } });
      const r = await provisionUser(profile, { supabase, sendWelcomeEmail });
      expect(r).toEqual({ ok: true, user: row, outcome: "created" });
    });
  });
});
