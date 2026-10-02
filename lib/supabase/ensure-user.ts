import type { SupabaseClient } from "@supabase/supabase-js";

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
 * Creates the users row for a Clerk user. If a row with the same email already
 * exists under a different clerk_user_id (Clerk user deleted/recreated, or
 * dev->prod instance switch), re-link it to the new Clerk id instead of failing.
 * Safe: other tables reference users.id (uuid), not clerk_user_id.
 */
export async function ensureUser(
  params: EnsureUserParams
): Promise<EnsureUserResult> {
  const { supabase, clerkUserId, email, name } = params;

  const { data: created, error } = await supabase
    .from("users")
    .upsert(
      { clerk_user_id: clerkUserId, email, name, paid_credits: 1 },
      { onConflict: "clerk_user_id" }
    )
    .select()
    .single();

  if (!error && created) {
    return { ok: true, user: created, relinked: false };
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
