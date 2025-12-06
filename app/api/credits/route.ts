import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger from "@/lib/logger"
import { hasUsedFreeCredit, getRedisClient } from "@/lib/redis"
import { z } from "zod"

const creditResponseSchema = z.object({
  paidCredits: z.number().int().min(0),
  hasFreeDaily: z.boolean(),
  totalCredits: z.number().int().min(0),
  freeResetTime: z.string().optional(),
})

export async function GET() {
  try {
    const authResult = await auth()
    const userId = authResult?.userId

    if (!userId) {
      logger.warn({ userId: "anonymous" }, "Unauthorized credits request")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    logger.debug({ userId }, "Fetching user credits")

    const supabase = getSupabaseAdminClient()

    let { data: user, error } = await supabase.from("users").select("*").eq("clerk_user_id", userId).single()

    if ((error || !user) && process.env.NODE_ENV === "development") {
      logger.warn({ userId }, "User not found in dev mode, attempting to create")

      try {
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId)
        const email = clerkUser.emailAddresses[0]?.emailAddress

        if (!email) {
          logger.error({ userId }, "User not found in database and no email from Clerk")
          return NextResponse.json(
            { success: false, error: "User not found. Please contact support." },
            { status: 404 }
          )
        }

        const { data: newUser, error: createError } = await supabase
          .from("users")
          .upsert({
            clerk_user_id: userId,
            email,
            paid_credits: 0,
          }, { onConflict: "email" })
          .select()
          .single()

        if (createError || !newUser) {
          logger.error({ userId, error: createError?.message }, "Failed to create user in dev mode")
          return NextResponse.json(
            { success: false, error: "Failed to create user. Please contact support." },
            { status: 500 }
          )
        }

        user = newUser
        logger.info({ userId, email }, "User created in dev mode")
      } catch (clerkError) {
        const errorMessage = clerkError instanceof Error ? clerkError.message : "Unknown error"
        logger.error({ userId, error: errorMessage }, "Failed to fetch user from Clerk")
        return NextResponse.json(
          { success: false, error: "Failed to fetch user details. Please contact support." },
          { status: 500 }
        )
      }
    } else if (error || !user) {
      logger.error({ userId, error: error?.message }, "User not found in database")
      return NextResponse.json(
        { success: false, error: "User not found. Please contact support." },
        { status: 404 }
      )
    }


    let hasFreeDaily = false
    let     paidCredits = 0

    const { data: creditData, error: creditError } = await supabase.rpc("check_user_credits", {
      p_user_id: user.id,
    })

    if (creditError) {
      logger.error({ userId, error: creditError.message }, "Failed to check credits")
      return NextResponse.json({ success: false, error: "Failed to fetch credits" }, { status: 500 })
    }

    const creditResult = Array.isArray(creditData) ? creditData[0] : creditData
    hasFreeDaily = creditResult?.has_free_daily ?? false
    paidCredits = creditResult?.paid_credits ?? 0

    logger.debug({ userId, hasFreeDaily, paidCredits, source: "database" }, "Credits fetched from database")

    const totalCredits = paidCredits + (hasFreeDaily ? 1 : 0)

    const now = new Date()
    const midnight = new Date(now)
    midnight.setUTCHours(24, 0, 0, 0)
    const freeResetTime = midnight.toISOString()

    const responseData = {
      paidCredits,
      hasFreeDaily,
      totalCredits,
      freeResetTime,
    }

    const validatedResponse = creditResponseSchema.safeParse(responseData)
    if (!validatedResponse.success) {
      logger.error({ userId, error: validatedResponse.error.message }, "Internal data validation error")
      return NextResponse.json({ success: false, error: "Internal data validation error" }, { status: 500 })
    }

    logger.info({ userId, totalCredits, paidCredits, hasFreeDaily }, "Credits fetched successfully")

    return NextResponse.json({
      success: true,
      data: validatedResponse.data,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error({ error: errorMessage }, "Internal server error in GET /api/credits")
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
