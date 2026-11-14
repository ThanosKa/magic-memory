import { describe, it, expect, vi, beforeEach } from "vitest"
import logger from "@/lib/logger"
import {
  asClerkUserId,
  asUserId,
  createCreditLedger,
} from "@/lib/credits/ledger"
import type { LedgerDb, LedgerFunction, UserLookup } from "@/lib/credits/ledger-db"

vi.mock("@/lib/logger", () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}))

type Answer = { data: unknown; error: string | null } | Error

/**
 * The fake `LedgerDb`: users keyed by Clerk id, one scripted answer per SQL
 * function, and a record of every call. An `Error` answer is thrown.
 */
function fakeLedgerDb({
  users = {},
  lookup,
  answers = {},
}: {
  users?: Record<string, string>
  lookup?: UserLookup | Error
  answers?: Partial<Record<LedgerFunction, Answer>>
} = {}) {
  const calls: Array<{ fn: LedgerFunction; args: Record<string, unknown> }> = []
  const db: LedgerDb = {
    async findUserId(clerkUserId) {
      if (lookup instanceof Error) throw lookup
      if (lookup) return lookup
      const id = users[clerkUserId]
      return id ? { id } : { missing: true }
    },
    async call(fn, args) {
      calls.push({ fn, args })
      const answer = answers[fn] ?? { data: null, error: null }
      if (answer instanceof Error) throw answer
      return answer
    },
  }
  return { db, calls }
}

const CLERK_ID = asClerkUserId("clerk_user_123")
const USER_ID = asUserId("user-uuid")

describe("createCreditLedger", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("balance", () => {
    it("returns the paid credits of the user's row", async () => {
      const { db, calls } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: {
          check_user_credits: {
            data: [{ has_credits: true, has_free_daily: false, paid_credits: 7, should_use_free: false }],
            error: null,
          },
        },
      })

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toEqual({ ok: true, paidCredits: 7 })
      expect(calls).toEqual([{ fn: "check_user_credits", args: { p_user_id: "user-uuid" } }])
    })

    it("gives user_not_found when no row has the Clerk id", async () => {
      const { db, calls } = fakeLedgerDb()

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toEqual({ ok: false, reason: "user_not_found" })
      expect(calls).toEqual([])
      expect(logger.error).toHaveBeenCalledWith(
        { error: null, userId: "clerk_user_123" },
        "User not found for credit check",
      )
    })

    it("gives db_error when the user lookup fails", async () => {
      const { db } = fakeLedgerDb({ lookup: { error: "connection reset" } })

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "connection reset" })
      expect(logger.error).toHaveBeenCalledWith(
        { error: "connection reset", userId: "clerk_user_123" },
        "User not found for credit check",
      )
    })

    it("gives db_error when check_user_credits fails", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: { check_user_credits: { data: null, error: "RPC error" } },
      })

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "RPC error" })
      expect(logger.error).toHaveBeenCalledWith(
        { error: "RPC error", userId: "clerk_user_123" },
        "Error checking user credits",
      )
    })

    it("gives db_error when check_user_credits answers no row", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: { check_user_credits: { data: [], error: null } },
      })

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toMatchObject({ ok: false, reason: "db_error" })
    })

    it("catches an exception as db_error", async () => {
      const { db } = fakeLedgerDb({ lookup: new Error("socket closed") })

      const result = await createCreditLedger(() => db).balance(CLERK_ID)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "Internal error" })
      expect(logger.error).toHaveBeenCalledWith(
        { error: "socket closed", userId: "clerk_user_123" },
        "Exception checking user credits",
      )
    })

    it("lets a failure to open the database escape, as today", async () => {
      const ledger = createCreditLedger(() => {
        throw new Error("Supabase admin environment variables are missing")
      })

      await expect(ledger.balance(CLERK_ID)).rejects.toThrow(
        "Supabase admin environment variables are missing",
      )
    })
  })

  describe("chargeRestoration", () => {
    const restoration = { originalUrl: "ephemeral:photo.jpg", restoredUrl: "https://r/1.png" }

    function deductAnswer(row: Record<string, unknown>): Answer {
      return { data: [row], error: null }
    }

    it("charges one credit and returns the restoration and remaining credits", async () => {
      const { db, calls } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: {
          deduct_credit_and_record_restoration: deductAnswer({
            success: true,
            restoration_id: "restoration-uuid",
            remaining_paid_credits: 4,
            error_message: null,
          }),
        },
      })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: true, restorationId: "restoration-uuid", remainingCredits: 4 })
      expect(calls).toEqual([
        {
          fn: "deduct_credit_and_record_restoration",
          args: {
            p_user_id: "user-uuid",
            p_original_url: "ephemeral:photo.jpg",
            p_restored_url: "https://r/1.png",
            p_use_free_credit: false,
          },
        },
      ])
    })

    it("gives no_credits when SQL answers No paid credits available", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: {
          deduct_credit_and_record_restoration: deductAnswer({
            success: false,
            restoration_id: null,
            remaining_paid_credits: 0,
            error_message: "No paid credits available",
          }),
        },
      })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "no_credits" })
    })

    it("gives user_not_found when SQL answers User not found", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: {
          deduct_credit_and_record_restoration: deductAnswer({
            success: false,
            restoration_id: null,
            remaining_paid_credits: 0,
            error_message: "User not found",
          }),
        },
      })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "user_not_found" })
    })

    it("gives user_not_found without a log when no row has the Clerk id", async () => {
      const { db, calls } = fakeLedgerDb()

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "user_not_found" })
      expect(calls).toEqual([])
      expect(logger.error).not.toHaveBeenCalled()
    })

    it("gives db_error without a log when the user lookup fails", async () => {
      const { db } = fakeLedgerDb({ lookup: { error: "connection reset" } })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "connection reset" })
      expect(logger.error).not.toHaveBeenCalled()
    })

    it("gives db_error when deduct_credit_and_record_restoration fails", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: { deduct_credit_and_record_restoration: { data: null, error: "Transaction failed" } },
      })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "Transaction failed" })
      expect(logger.error).toHaveBeenCalledWith(
        { error: "Transaction failed", userId: "clerk_user_123" },
        "Error deducting credit",
      )
    })

    it("catches an exception as db_error", async () => {
      const { db } = fakeLedgerDb({
        users: { clerk_user_123: "user-uuid" },
        answers: { deduct_credit_and_record_restoration: new Error("socket closed") },
      })

      const result = await createCreditLedger(() => db).chargeRestoration(CLERK_ID, restoration)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "Internal error" })
      expect(logger.error).toHaveBeenCalledWith(
        { error: "socket closed", userId: "clerk_user_123" },
        "Exception deducting credit",
      )
    })
  })

  describe("grantPurchase", () => {
    const purchase = {
      stripePaymentId: "pi_123",
      credits: 20,
      amountPaid: 999,
      packageType: "starter",
    }

    it("grants the purchase by users.id with no user lookup", async () => {
      const { db, calls } = fakeLedgerDb({
        lookup: new Error("must not look up"),
        answers: { grant_purchase_credits: { data: true, error: null } },
      })

      const result = await createCreditLedger(() => db).grantPurchase(USER_ID, purchase)

      expect(result).toEqual({ ok: true, granted: true })
      expect(calls).toEqual([
        {
          fn: "grant_purchase_credits",
          args: {
            p_user_id: "user-uuid",
            p_stripe_payment_id: "pi_123",
            p_credits: 20,
            p_amount_paid: 999,
            p_package_type: "starter",
          },
        },
      ])
    })

    it("gives granted: false when the payment was already granted", async () => {
      const { db } = fakeLedgerDb({
        answers: { grant_purchase_credits: { data: false, error: null } },
      })

      const result = await createCreditLedger(() => db).grantPurchase(USER_ID, purchase)

      expect(result).toEqual({ ok: true, granted: false })
    })

    it("gives db_error when grant_purchase_credits fails", async () => {
      const { db } = fakeLedgerDb({
        answers: { grant_purchase_credits: { data: null, error: "foreign key violation" } },
      })

      const result = await createCreditLedger(() => db).grantPurchase(USER_ID, purchase)

      expect(result).toEqual({ ok: false, reason: "db_error", message: "foreign key violation" })
    })

    it("refuses the wrong identity at compile time", () => {
      const ledger = createCreditLedger(() => fakeLedgerDb().db)
      // @ts-expect-error a Clerk id is not a users.id
      expect(() => ledger.grantPurchase(CLERK_ID, purchase)).not.toThrow()
      // @ts-expect-error a plain string is not a Clerk id
      expect(() => ledger.balance("clerk_user_123")).not.toThrow()
    })

    it("lets an exception escape, so the webhook still answers 400 as today", async () => {
      const { db } = fakeLedgerDb({
        answers: { grant_purchase_credits: new Error("socket closed") },
      })

      await expect(
        createCreditLedger(() => db).grantPurchase(USER_ID, purchase),
      ).rejects.toThrow("socket closed")
    })
  })

  describe("reverseRestoration", () => {
    it("reverses the restoration and logs it", async () => {
      const { db, calls } = fakeLedgerDb({
        answers: { rollback_restoration: { data: true, error: null } },
      })

      const result = await createCreditLedger(() => db).reverseRestoration("restoration-uuid")

      expect(result).toBe(true)
      expect(calls).toEqual([
        { fn: "rollback_restoration", args: { p_restoration_id: "restoration-uuid" } },
      ])
      expect(logger.info).toHaveBeenCalledWith(
        { restorationId: "restoration-uuid" },
        "Restoration rolled back successfully",
      )
    })

    it("answers false when SQL finds no such restoration", async () => {
      const { db } = fakeLedgerDb({
        answers: { rollback_restoration: { data: false, error: null } },
      })

      await expect(
        createCreditLedger(() => db).reverseRestoration("restoration-uuid"),
      ).resolves.toBe(false)
    })

    it("answers false when rollback_restoration fails", async () => {
      const { db } = fakeLedgerDb({
        answers: { rollback_restoration: { data: null, error: "Rollback failed" } },
      })

      const result = await createCreditLedger(() => db).reverseRestoration("restoration-uuid")

      expect(result).toBe(false)
      expect(logger.error).toHaveBeenCalledWith(
        { error: "Rollback failed", restorationId: "restoration-uuid" },
        "Error rolling back restoration",
      )
    })

    it("catches an exception and answers false", async () => {
      const { db } = fakeLedgerDb({
        answers: { rollback_restoration: new Error("socket closed") },
      })

      const result = await createCreditLedger(() => db).reverseRestoration("restoration-uuid")

      expect(result).toBe(false)
      expect(logger.error).toHaveBeenCalledWith(
        { error: "socket closed", restorationId: "restoration-uuid" },
        "Exception rolling back restoration",
      )
    })
  })
})
