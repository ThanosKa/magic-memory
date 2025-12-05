import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
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
    const { userId } = await auth()

    if (!userId) {
      logger.warn({ userId: "anonymous" }, "Unauthorized credits request")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    logger.debug({ userId }, "Fetching user credits")

    const supabase = getSupabaseAdminClient()

    const { data: user, error } = await supabase.from("users").select("*").eq("clerk_user_id", userId).single()

    if (error || !user) {
      logger.error({ userId, error: error?.message }, "User not found in database")
      return NextResponse.json(
        { success: false, error: "User not found. Please contact support." },
        { status: 404 }
      )
    }

    let hasFreeDaily = true
    const redis = getRedisClient()

    if (redis) {
      hasFreeDaily = !(await hasUsedFreeCredit(userId))
      logger.debug({ userId, hasFreeDaily, source: "redis" }, "Free credit check from Redis")
    } else {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      const { count } = await supabase
        .from("restorations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("used_free_credit", true)
        .gte("created_at", today.toISOString())

      hasFreeDaily = (count ?? 0) === 0
      logger.debug({ userId, hasFreeDaily, source: "database" }, "Free credit check from database")
    }

    const paidCredits = user?.paid_credits ?? 0
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
