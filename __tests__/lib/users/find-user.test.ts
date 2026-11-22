import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { findUser } from "@/lib/users";

const row = {
  id: "u1",
  clerk_user_id: "clerk_1",
  email: "a@b.c",
  paid_credits: 5,
};

function fakeClient(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn().mockResolvedValue(result),
  };
  const supabase = { from: vi.fn(() => query) };
  return { supabase: supabase as unknown as SupabaseClient, query };
}

describe("findUser", () => {
  it("reads the users row by Clerk id and returns it as found", async () => {
    const { supabase, query } = fakeClient({ data: row, error: null });
    const r = await findUser({ clerkUserId: "clerk_1", supabase });
    expect(supabase.from).toHaveBeenCalledWith("users");
    expect(query.select).toHaveBeenCalledWith("*");
    expect(query.eq).toHaveBeenCalledWith("clerk_user_id", "clerk_1");
    expect(r).toEqual({ status: "found", user: row });
  });

  it("answers missing when no row exists", async () => {
    const { supabase } = fakeClient({ data: null, error: null });
    expect(await findUser({ clerkUserId: "clerk_1", supabase })).toEqual({ status: "missing" });
  });

  it("answers error, never missing, when the read fails", async () => {
    const { supabase } = fakeClient({ data: null, error: { message: "db down" } });
    expect(await findUser({ clerkUserId: "clerk_1", supabase })).toEqual({
      status: "error",
      message: "db down",
    });
  });
});
