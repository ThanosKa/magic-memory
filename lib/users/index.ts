import logger from "@/lib/logger";
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
  /**
   * True only when `email` is the Clerk user's primary address and Clerk has
   * verified it. A row is re-linked by email, so anything else never re-links.
   */
  emailVerified?: boolean;
};

export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string;
  paid_credits: number | null;
};

/** Sends the welcome email. The real one is `sendWelcomeEmail` from `@/lib/email`. */
export type WelcomeEmailSender = (to: string, name: string | null) => Promise<unknown>;

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
 * Provisions the users row for a Clerk user and, when it created the row,
 * sends the welcome email, so every new User gets one email whichever entry
 * point wins the race.
 *
 * Invariants:
 * - The welcome email is sent only on "created", once, and awaited before this
 *   returns (the Worker can cancel work left running after the response). A
 *   failed send never fails Provisioning or changes the result.
 * - Never changes any column of an existing row for that Clerk id; the
 *   outcome is "already_existed" and the row comes back as it was.
 * - If a row with the same non-empty, verified primary email exists under another clerk_user_id (Clerk
 *   user deleted and recreated, or a dev-to-prod instance switch), it is
 *   re-linked to the new Clerk id ("relinked"), keeping its credits and
 *   history. Only the Clerk id, and the name and image when Clerk sent them,
 *   change. Safe: other tables reference users.id, not clerk_user_id.
 * - Two concurrent calls for one Clerk id give one "created" and one
 *   "already_existed", because the insert is insert-or-nothing.
 */
export async function provisionUser(
  profile: NewUserProfile,
  { supabase, sendWelcomeEmail }: { supabase: SupabaseClient; sendWelcomeEmail: WelcomeEmailSender }
): Promise<ProvisionResult> {
  const { clerkUserId, email, name, imageUrl, emailVerified } = profile;

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
    try {
      await sendWelcomeEmail(email, name);
    } catch (err) {
      logger.error(
        { error: err instanceof Error ? err.message : String(err), to: email },
        "Welcome email sender threw"
      );
    }
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

  // Re-linking moves a row's credits and history to a new Clerk id, so it
  // needs an email Clerk has verified as the primary one, and never an empty one.
  if (emailVerified !== true || email === "") {
    return { ok: false, message: "Email belongs to another user and is not verified for re-linking" };
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
