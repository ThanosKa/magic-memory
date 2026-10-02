import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureUser } from "@/lib/supabase/ensure-user";

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
  };
  return c;
}

function fakeClient(params: { upsert: unknown; update?: unknown }) {
  const upsertChain = chain(params.upsert);
  const updateChain = chain(params.update);
  const table = {
    upsert: vi.fn(() => upsertChain),
    update: vi.fn(() => updateChain),
  };
  const supabase = { from: vi.fn(() => table) };
  // Test double: only the used query-builder surface is implemented.
  return { supabase: supabase as unknown as SupabaseClient, table, updateChain };
}

describe("ensureUser", () => {
  it("returns created user", async () => {
    const { supabase } = fakeClient({ upsert: { data: row, error: null } });
    const r = await ensureUser({ supabase, clerkUserId: "new", email: "a@b.c", name: null });
    expect(r).toEqual({ ok: true, user: row, relinked: false });
  });

  it("re-links existing row on email conflict", async () => {
    const { supabase, table, updateChain } = fakeClient({
      upsert: {
        data: null,
        error: { code: "23505", message: 'duplicate key value violates unique constraint "users_email_key"' },
      },
      update: { data: row, error: null },
    });
    const r = await ensureUser({ supabase, clerkUserId: "new", email: "a@b.c", name: "N" });
    expect(table.update).toHaveBeenCalledWith({ clerk_user_id: "new", name: "N" });
    expect(updateChain.eq).toHaveBeenCalledWith("email", "a@b.c");
    expect(r).toEqual({ ok: true, user: row, relinked: true });
  });

  it("fails on other errors", async () => {
    const { supabase } = fakeClient({ upsert: { data: null, error: { code: "XX", message: "boom" } } });
    const r = await ensureUser({ supabase, clerkUserId: "new", email: "a@b.c", name: null });
    expect(r).toEqual({ ok: false, message: "boom" });
  });
});
