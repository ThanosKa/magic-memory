import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";
import { z } from "zod";

const creditResponseSchema = z.object({
  paidCredits: z.number().int().min(0),
  hasFreeDaily: z.boolean(),
  totalCredits: z.number().int().min(0),
  freeResetTime: z.string().optional(),
});

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      logger.warn({ userId: "anonymous" }, "Unauthorized credits request");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    logger.debug({ userId }, "Fetching user credits");

    const supabase = getSupabaseAdminClient();

    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();
    let user = userData;

    if (error || !user) {
      logger.warn(
        { userId },
        "User not found in database, attempting to create"
      );

      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
          logger.error(
            { userId },
            "User not found in database and no email from Clerk"
          );
          return NextResponse.json(
            {
              success: false,
              error: "User not found. Please contact support.",
            },
            { status: 404 }
          );
        }

        const name =
          [clerkUser.firstName, clerkUser.lastName]
            .filter(Boolean)
            .join(" ") || null;

        const { data: newUser, error: createError } = await supabase
          .from("users")
          .upsert(
            {
              clerk_user_id: userId,
              email,
              name,
              paid_credits: 1,
            },
            { onConflict: "clerk_user_id" }
          )
          .select()
          .single();

        if (createError || !newUser) {
          logger.error(
            { userId, error: createError?.message },
            "Failed to create user"
          );
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create user. Please contact support.",
            },
            { status: 500 }
          );
        }

        user = newUser;
        logger.info({ userId, email }, "User auto-created from Clerk");
      } catch (clerkError) {
        const errorMessage =
          clerkError instanceof Error ? clerkError.message : "Unknown error";
        logger.error(
          { userId, error: errorMessage },
          "Failed to fetch user from Clerk"
        );
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch user details. Please contact support.",
          },
          { status: 500 }
        );
      }
    }

    const paidCredits = user.paid_credits ?? 0;
    const hasFreeDaily = false;
    const totalCredits = paidCredits;

    logger.debug(
      { userId, paidCredits, source: "database" },
      "Credits fetched from database"
    );

    const responseData = {
      paidCredits,
      hasFreeDaily,
      totalCredits,
    };

    const validatedResponse = creditResponseSchema.safeParse(responseData);
    if (!validatedResponse.success) {
      logger.error(
        { userId, error: validatedResponse.error.message },
        "Internal data validation error"
      );
      return NextResponse.json(
        { success: false, error: "Internal data validation error" },
        { status: 500 }
      );
    }

    logger.info(
      { userId, totalCredits, paidCredits, hasFreeDaily },
      "Credits fetched successfully"
    );

    return NextResponse.json({
      success: true,
      data: validatedResponse.data,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error(
      { error: errorMessage },
      "Internal server error in GET /api/credits"
    );
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
