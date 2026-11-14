import type { SupabaseClient } from "@supabase/supabase-js";
import { SIGNUP_CREDITS } from "@/lib/users";

const UNIQUE_VIOLATION = "23505";

interface EnsureUserParams {
  supabase: SupabaseClient;
  clerkUserId: string;
  email: string;
  name: string | null;
}

export interface UserRow {
  id: string;
  clerk_user_id: string;
  email: string;
  paid_credits: number | null;
}

type EnsureUserResult =
  | { ok: true; user: UserRow; relinked: boolean }
  | { ok: false; message: string };

/**
 * Creates the users row for a Clerk user, or returns the row that Clerk id
 * already has without changing any of its columns. If a row with the same
 * email already exists under a different clerk_user_id (Clerk user
 * deleted/recreated, or dev->prod instance switch), re-link it to the new
 * Clerk id instead of failing.
 * Safe: other tables reference users.id (uuid), not clerk_user_id.
 */
export async function ensureUser(
  params: EnsureUserParams
): Promise<EnsureUserResult> {
  const { supabase, clerkUserId, email, name } = params;

  // Insert or do nothing: a conflict on clerk_user_id returns no row and
  // leaves the existing row, and its Balance, as it was.
  const { data: created, error } = await supabase
    .from("users")
    .upsert(
      { clerk_user_id: clerkUserId, email, name, paid_credits: SIGNUP_CREDITS },
      { onConflict: "clerk_user_id", ignoreDuplicates: true }
    )
    .select()
    .maybeSingle();

  if (!error && created) {
    return { ok: true, user: created, relinked: false };
  }

  if (!error) {
    const { data: existing, error: readError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (readError || !existing) {
      return {
        ok: false,
        message: readError?.message ?? "User row not found after insert conflict",
      };
    }
    return { ok: true, user: existing, relinked: false };
  }

  const isEmailConflict =
    error?.code === UNIQUE_VIOLATION && error.message.includes("users_email_key");
  if (!isEmailConflict) {
    return { ok: false, message: error?.message ?? "Unknown error" };
  }

  const { data: relinked, error: relinkError } = await supabase
    .from("users")
    .update({ clerk_user_id: clerkUserId, name })
    .eq("email", email)
    .select()
    .single();

  if (relinkError || !relinked) {
    return { ok: false, message: relinkError?.message ?? "Relink failed" };
  }
  return { ok: true, user: relinked, relinked: true };
}
