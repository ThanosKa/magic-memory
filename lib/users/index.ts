import logger from "@/lib/logger";
import type { SupabaseClient } from "@supabase/supabase-js";

export const SIGNUP_CREDITS = 1;

const UNIQUE_VIOLATION = "23505";

export type NewUserProfile = {
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl?: string | null;
  emailVerified?: boolean;
};

export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string;
  paid_credits: number | null;
};

export type WelcomeEmailSender = (args: { to: string; name: string | null }) => Promise<unknown>;

export type ProvisionOutcome = "created" | "already_existed" | "relinked";

export type ProvisionResult =
  | { ok: true; user: UserRow; outcome: ProvisionOutcome }
  | { ok: false; message: string };

export type FindUserResult =
  | { status: "found"; user: UserRow }
  | { status: "missing" }
  | { status: "error"; message: string };

export async function findUser({
  clerkUserId,
  supabase,
}: {
  clerkUserId: string;
  supabase: SupabaseClient;
}): Promise<FindUserResult> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) return { status: "error", message: error.message };
  if (!data) return { status: "missing" };
  return { status: "found", user: data };
}

export async function provisionUser({
  profile,
  supabase,
  sendWelcomeEmail,
}: {
  profile: NewUserProfile;
  supabase: SupabaseClient;
  sendWelcomeEmail: WelcomeEmailSender;
}): Promise<ProvisionResult> {
  const { clerkUserId, email, name, imageUrl, emailVerified } = profile;

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
      await sendWelcomeEmail({ to: email, name });
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

  if (emailVerified !== true || email === "") {
    return { ok: false, message: "Email belongs to another user and is not verified for re-linking" };
  }

  const { data: relinked, error: relinkError } = await supabase
    .from("users")
    .update({
      clerk_user_id: clerkUserId,
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
