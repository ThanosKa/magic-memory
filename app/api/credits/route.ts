import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { apiLogger, authLogger, logError, createRequestContext } from "@/lib/logger"
import { hasUsedFreeCredit, getRedisClient } from "@/lib/redis"
import { z } from "zod"

const creditResponseSchema = z.object({
  paidCredits: z.number().int().min(0),
  hasFreeDaily: z.boolean(),
  totalCredits: z.number().int().min(0),
  freeResetTime: z.string().optional(),
})

export async function GET() {
  const ctx = createRequestContext(null, "get_credits")

  try {
    const { userId } = await auth()
    ctx.userId = userId || "anonymous"

    if (!userId) {
      authLogger.warn(ctx, "Unauthorized credits request")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    apiLogger.debug({ ...ctx }, "Fetching user credits")

    const supabase = getSupabaseAdminClient()

    let { data: user, error } = await supabase.from("users").select("*").eq("clerk_user_id", userId).single()

    if (error && error.code === "PGRST116") {
      const clerkUser = await currentUser()

      authLogger.info({ ...ctx, email: clerkUser?.emailAddresses[0]?.emailAddress }, "Creating new user")

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          clerk_user_id: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || "",
          name: clerkUser?.fullName || null,
          profile_image: clerkUser?.imageUrl || null,
          paid_credits: 0,
        })
        .select()
        .single()

      if (insertError) {
        logError(apiLogger, insertError, { ...ctx, action: "create_user" })
        return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
      }

      user = newUser
      authLogger.info({ ...ctx, dbUserId: newUser.id }, "New user created")
    }

    let hasFreeDaily = true
    const redis = getRedisClient()

    if (redis) {
      hasFreeDaily = !(await hasUsedFreeCredit(userId))
      apiLogger.debug({ ...ctx, hasFreeDaily, source: "redis" }, "Free credit check from Redis")
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
      apiLogger.debug({ ...ctx, hasFreeDaily, source: "database" }, "Free credit check from database")
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
      logError(apiLogger, validatedResponse.error, { ...ctx, action: "validate_response" })
      return NextResponse.json({ success: false, error: "Internal data validation error" }, { status: 500 })
    }

    apiLogger.info({ ...ctx, totalCredits, paidCredits, hasFreeDaily }, "Credits fetched successfully")

    return NextResponse.json({
      success: true,
      data: validatedResponse.data,
    })
  } catch (error) {
    logError(apiLogger, error, { ...ctx })
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
