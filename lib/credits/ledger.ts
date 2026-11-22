import { z } from "zod"
import logger from "@/lib/logger"
import { supabaseLedgerDb, type LedgerDb } from "./ledger-db"

const INTERNAL_ERROR = "Internal error"

export type ClerkUserId = string & { readonly __brand: "ClerkUserId" }
export type UserId = string & { readonly __brand: "UserId" }

export function isClerkUserId(id: string): id is ClerkUserId {
  return id.length > 0
}

export function isUserId(id: string): id is UserId {
  return id.length > 0
}

export function asClerkUserId(id: string): ClerkUserId {
  if (!isClerkUserId(id)) throw new Error("Clerk user id is empty")
  return id
}

export function asUserId(id: string): UserId {
  if (!isUserId(id)) throw new Error("User id is empty")
  return id
}

export type LedgerFailure =
  | { ok: false; reason: "user_not_found" }
  | { ok: false; reason: "no_credits" }
  | { ok: false; reason: "db_error"; message: string }

export type CreditLedger = {
  balance(user: ClerkUserId): Promise<{ ok: true; paidCredits: number } | LedgerFailure>
  chargeRestoration(
    user: ClerkUserId,
    restoration: RestorationToCharge,
  ): Promise<{ ok: true; restorationId: string; remainingCredits: number } | LedgerFailure>
  grantPurchase(
    user: UserId,
    purchase: PurchaseToGrant,
  ): Promise<{ ok: true; granted: boolean } | LedgerFailure>
  reverseRestoration(restorationId: string): Promise<boolean>
}

export type PurchaseToGrant = {
  stripePaymentId: string
  credits: number
  amountPaid: number
  packageType: string
}

export type RestorationToCharge = {
  originalUrl: string
  restoredUrl: string
}

const creditRowSchema = z.object({ paid_credits: z.number() })

const deductRowSchema = z.object({
  success: z.boolean(),
  restoration_id: z.string().nullable(),
  remaining_paid_credits: z.number(),
  error_message: z.string().nullable(),
})

const CHARGE_REFUSALS: Record<string, LedgerFailure> = {
  "No paid credits available": { ok: false, reason: "no_credits" },
  "Free credit already used today": { ok: false, reason: "no_credits" },
  "User not found": { ok: false, reason: "user_not_found" },
}

const USER_NOT_FOUND = { ok: false, reason: "user_not_found" } as const

function dbError(message: string): LedgerFailure {
  return { ok: false, reason: "db_error", message }
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function firstRow(data: unknown): unknown {
  return Array.isArray(data) ? data[0] : data
}

export function createCreditLedger(openDb: () => LedgerDb = supabaseLedgerDb): CreditLedger {
  return {
    async balance(user) {
      const db = openDb()

      try {
        const found = await db.findUserId(user)
        if (!("id" in found)) {
          const lookupError = "error" in found ? found.error : null
          logger.error({ error: lookupError, userId: user }, "User not found for credit check")
          return lookupError === null ? USER_NOT_FOUND : dbError(lookupError)
        }

        const { data, error } = await db.call("check_user_credits", { p_user_id: found.id })
        if (error) {
          logger.error({ error, userId: user }, "Error checking user credits")
          return dbError(error)
        }

        const row = creditRowSchema.safeParse(firstRow(data))
        if (!row.success) return dbError("check_user_credits returned no row")
        return { ok: true, paidCredits: row.data.paid_credits }
      } catch (error) {
        logger.error({ error: messageOf(error), userId: user }, "Exception checking user credits")
        return dbError(INTERNAL_ERROR)
      }
    },

    async chargeRestoration(user, { originalUrl, restoredUrl }) {
      const db = openDb()

      try {
        const found = await db.findUserId(user)
        if ("missing" in found) return USER_NOT_FOUND
        if ("error" in found) return dbError(found.error)

        const { data, error } = await db.call("deduct_credit_and_record_restoration", {
          p_user_id: found.id,
          p_original_url: originalUrl,
          p_restored_url: restoredUrl,
          p_use_free_credit: false,
        })
        if (error) {
          logger.error({ error, userId: user }, "Error deducting credit")
          return dbError(error)
        }

        const row = deductRowSchema.safeParse(firstRow(data))
        if (!row.success) return dbError("deduct_credit_and_record_restoration returned no row")

        const { success, restoration_id, remaining_paid_credits, error_message } = row.data
        if (!success || restoration_id === null) {
          const refusal = error_message ?? "Charge refused"
          return CHARGE_REFUSALS[refusal] ?? dbError(refusal)
        }
        return { ok: true, restorationId: restoration_id, remainingCredits: remaining_paid_credits }
      } catch (error) {
        logger.error({ error: messageOf(error), userId: user }, "Exception deducting credit")
        return dbError(INTERNAL_ERROR)
      }
    },

    async grantPurchase(user, { stripePaymentId, credits, amountPaid, packageType }) {
      const db = openDb()

      const { data, error } = await db.call("grant_purchase_credits", {
        p_user_id: user,
        p_stripe_payment_id: stripePaymentId,
        p_credits: credits,
        p_amount_paid: amountPaid,
        p_package_type: packageType,
      })
      if (error) return dbError(error)
      return { ok: true, granted: data === true }
    },

    async reverseRestoration(restorationId) {
      const db = openDb()

      try {
        const { data, error } = await db.call("rollback_restoration", {
          p_restoration_id: restorationId,
        })
        if (error) {
          logger.error({ error, restorationId }, "Error rolling back restoration")
          return false
        }

        logger.info({ restorationId }, "Restoration rolled back successfully")
        return data === true
      } catch (error) {
        logger.error(
          { error: messageOf(error), restorationId },
          "Exception rolling back restoration",
        )
        return false
      }
    },
  }
}
