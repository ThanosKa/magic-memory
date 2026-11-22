// @vitest-environment node https://vitest.dev/guide/environment
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { asClerkUserId, asUserId, createCreditLedger } from "@/lib/credits/ledger"
import { createPgliteLedger, type PgliteLedger } from "./pglite-ledger-db"

vi.mock("@/lib/logger", () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}))

const CLERK_ID = asClerkUserId("clerk_user_sql")
const PURCHASE = {
  stripePaymentId: "pi_sql_1",
  credits: 5,
  amountPaid: 500,
  packageType: "starter",
}
const URLS = { originalUrl: "https://example.com/a.jpg", restoredUrl: "https://example.com/b.jpg" }

let pg: PgliteLedger
let userId: string
const ledger = createCreditLedger(() => pg.db)

async function setBalance(credits: number) {
  await pg.query("UPDATE users SET paid_credits = $1 WHERE id = $2", [credits, userId])
}

async function counts() {
  const [{ n: restorations }] = await pg.query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM restorations",
  )
  const [{ n: purchases }] = await pg.query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM purchases",
  )
  return { restorations, purchases }
}

beforeAll(async () => {
  pg = await createPgliteLedger()
}, 60_000)

afterAll(async () => {
  await pg.close()
})

beforeEach(async () => {
  await pg.query("TRUNCATE users CASCADE")
  const [row] = await pg.query<{ id: string }>(
    "INSERT INTO users (clerk_user_id, email) VALUES ($1, 'sql@example.com') RETURNING id",
    [CLERK_ID],
  )
  userId = row.id
})

describe("credit ledger on real SQL", () => {
  it("a Charge lowers the Balance by one and records a Restoration", async () => {
    await setBalance(3)

    const result = await ledger.chargeRestoration(CLERK_ID, URLS)

    expect(result).toMatchObject({ ok: true, remainingCredits: 2 })
    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 2 })
    const rows = await pg.query<{ id: string; original_image_url: string }>(
      "SELECT id, original_image_url FROM restorations WHERE user_id = $1",
      [userId],
    )
    expect(rows).toHaveLength(1)
    expect(rows[0].original_image_url).toBe(URLS.originalUrl)
    expect(result.ok && result.restorationId).toBe(rows[0].id)
  })

  it("a Charge at zero is rejected and writes nothing", async () => {
    await setBalance(0)

    const result = await ledger.chargeRestoration(CLERK_ID, URLS)

    expect(result).toEqual({ ok: false, reason: "no_credits" })
    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 0 })
    expect((await counts()).restorations).toBe(0)
  })

  it("the same payment id twice grants once", async () => {
    const first = await ledger.grantPurchase(asUserId(userId), PURCHASE)
    const second = await ledger.grantPurchase(asUserId(userId), PURCHASE)

    expect(first).toEqual({ ok: true, granted: true })
    expect(second).toEqual({ ok: true, granted: false })
    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 5 })
    expect((await counts()).purchases).toBe(1)
  })

  it("the Balance can never be stored below zero", async () => {
    await expect(setBalance(-1)).rejects.toThrow(/paid_credits/)
    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 0 })
  })

  it("a Reversal returns one credit and removes the Restoration", async () => {
    await setBalance(2)
    const charged = await ledger.chargeRestoration(CLERK_ID, URLS)
    if (!charged.ok) throw new Error("charge should succeed")

    expect(await ledger.reverseRestoration(charged.restorationId)).toBe(true)

    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 2 })
    expect((await counts()).restorations).toBe(0)
  })

  it("a Reversal of an unknown Restoration changes nothing", async () => {
    await setBalance(2)

    expect(await ledger.reverseRestoration("00000000-0000-0000-0000-000000000000")).toBe(false)
    expect(await ledger.balance(CLERK_ID)).toEqual({ ok: true, paidCredits: 2 })
  })
})
