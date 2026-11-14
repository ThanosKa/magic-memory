import type { SupabaseClient } from "@supabase/supabase-js";

/** Credits a new user starts with. The only place this value is defined. */
export const SIGNUP_CREDITS = 1;

const UNIQUE_VIOLATION = "23505";

/** What Provisioning needs to know about a Clerk user. */
export type NewUserProfile = {
  clerkUserId: string;
  email: string;
  name: string | null;
  /** Stored in `profile_image` when given; the column is left out otherwise. */
  imageUrl?: string | null;
};

export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string;
  paid_credits: number | null;
};

export type ProvisionOutcome = "created" | "already_existed" | "relinked";

export type ProvisionResult =
  | { ok: true; user: UserRow; outcome: ProvisionOutcome }
  | { ok: false; message: string };

export type FindUserResult =
  | { status: "found"; user: UserRow }
  | { status: "missing" }
  | { status: "error"; message: string };

/**
 * Reads the users row for a Clerk id. A failed read answers "error", never
 * "missing", so callers cannot mistake a database error for a new User and
 * provision over an existing Balance.
 */
export async function findUser(
  clerkUserId: string,
  { supabase }: { supabase: SupabaseClient }
): Promise<FindUserResult> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) return { status: "error", message: error.message };
  if (!data) return { status: "missing" };
  return { status: "found", user: data };
}

/**
 * Provisions the users row for a Clerk user. Sends no email.
 *
 * Invariants:
 * - Never changes any column of an existing row for that Clerk id; the
 *   outcome is "already_existed" and the row comes back as it was.
 * - If a row with the same email exists under another clerk_user_id (Clerk
 *   user deleted and recreated, or a dev-to-prod instance switch), it is
 *   re-linked to the new Clerk id ("relinked"), keeping its credits and
 *   history. Only the Clerk id, and the name and image when Clerk sent them,
 *   change. Safe: other tables reference users.id, not clerk_user_id.
 * - Two concurrent calls for one Clerk id give one "created" and one
 *   "already_existed", because the insert is insert-or-nothing.
 */
export async function provisionUser(
  profile: NewUserProfile,
  { supabase }: { supabase: SupabaseClient }
): Promise<ProvisionResult> {
  const { clerkUserId, email, name, imageUrl } = profile;

  // Insert or do nothing: a conflict on clerk_user_id returns no row and
  // leaves the existing row, and its Balance, as it was.
  const { data: created, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        email,
        name,
        paid_credits: SIGNUP_CREDITS,
        ...(imageUrl !== undefined && { profile_image: imageUrl }),
      },
      { onConflict: "clerk_user_id", ignoreDuplicates: true }
    )
    .select()
    .maybeSingle();

  if (!error && created) {
    return { ok: true, user: created, outcome: "created" };
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
    return { ok: true, user: existing, outcome: "already_existed" };
  }

  const isEmailConflict =
    error?.code === UNIQUE_VIOLATION && error.message.includes("users_email_key");
  if (!isEmailConflict) {
    return { ok: false, message: error?.message ?? "Unknown error" };
  }

  const { data: relinked, error: relinkError } = await supabase
    .from("users")
    .update({
      clerk_user_id: clerkUserId,
      // Keep the stored name and image when Clerk sends none.
      ...(name !== null && { name }),
      ...(imageUrl != null && { profile_image: imageUrl }),
    })
    .eq("email", email)
    .select()
    .single();

  if (relinkError || !relinked) {
    return { ok: false, message: relinkError?.message ?? "Relink failed" };
  }
  return { ok: true, user: relinked, outcome: "relinked" };
}
