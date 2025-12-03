import { getSupabaseAdminClient } from "./server"
import { dbLogger } from "@/lib/logger"

export interface CreditCheckResult {
  has_credits: boolean
  has_free_daily: boolean
  paid_credits: number
  should_use_free: boolean
}

export interface DeductCreditResult {
  success: boolean
  restoration_id: string | null
  remaining_paid_credits: number
  error_message: string | null
}

// Atomically check if user has credits available
export async function checkUserCredits(userId: string): Promise<CreditCheckResult | null> {
  const supabase = getSupabaseAdminClient()

  try {
    // First get the internal user ID from clerk_user_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (userError || !user) {
      dbLogger.error({ error: userError, userId }, "User not found for credit check")
      return null
    }

    const { data, error } = await supabase.rpc("check_user_credits", {
      p_user_id: user.id,
    })

    if (error) {
      dbLogger.error({ error, userId }, "Error checking user credits")
      return null
    }

    // RPC returns an array, get first result
    const result = Array.isArray(data) ? data[0] : data
    return result as CreditCheckResult
  } catch (error) {
    dbLogger.error({ error, userId }, "Exception checking user credits")
    return null
  }
}

// Atomically deduct credit and record restoration
export async function deductCreditAndRecordRestoration(
  userId: string,
  originalUrl: string,
  restoredUrl: string,
  useFreeCredit: boolean,
): Promise<DeductCreditResult> {
  const supabase = getSupabaseAdminClient()

  try {
    // First get the internal user ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (userError || !user) {
      return {
        success: false,
        restoration_id: null,
        remaining_paid_credits: 0,
        error_message: "User not found",
      }
    }

    const { data, error } = await supabase.rpc("deduct_credit_and_record_restoration", {
      p_user_id: user.id,
      p_original_url: originalUrl,
      p_restored_url: restoredUrl,
      p_use_free_credit: useFreeCredit,
    })

    if (error) {
      dbLogger.error({ error, userId }, "Error deducting credit")
      return {
        success: false,
        restoration_id: null,
        remaining_paid_credits: 0,
        error_message: error.message,
      }
    }

    const result = Array.isArray(data) ? data[0] : data
    return result as DeductCreditResult
  } catch (error) {
    dbLogger.error({ error, userId }, "Exception deducting credit")
    return {
      success: false,
      restoration_id: null,
      remaining_paid_credits: 0,
      error_message: "Internal error",
    }
  }
}

// Rollback a restoration if something fails after credit deduction
export async function rollbackRestoration(restorationId: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  try {
    const { data, error } = await supabase.rpc("rollback_restoration", {
      p_restoration_id: restorationId,
    })

    if (error) {
      dbLogger.error({ error, restorationId }, "Error rolling back restoration")
      return false
    }

    dbLogger.info({ restorationId }, "Restoration rolled back successfully")
    return data as boolean
  } catch (error) {
    dbLogger.error({ error, restorationId }, "Exception rolling back restoration")
    return false
  }
}
