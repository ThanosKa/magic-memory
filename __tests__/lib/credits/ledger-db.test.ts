import { describe, it, expect, vi, beforeEach } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { asClerkUserId, asUserId, createCreditLedger } from "@/lib/credits/ledger"
import { supabaseLedgerDb } from "@/lib/credits/ledger-db"

vi.mock("@/lib/supabase/server")
vi.mock("@/lib/logger", () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}))

type Lookup = { data: { id: string } | null; error: { message: string } | null }
type RpcAnswer = { data: unknown; error: { message: string } | null }

function fakeAdminClient(lookup: Lookup, rpcAnswer: RpcAnswer = { data: null, error: null }) {
  const maybeSingle = vi.fn().mockResolvedValue(lookup)
  const eq = vi.fn().mockReturnValue({ maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const from = vi.fn().mockReturnValue({ select })
  const rpc = vi.fn().mockResolvedValue(rpcAnswer)
  vi.mocked(getSupabaseAdminClient).mockReturnValue(
    { from, rpc } as unknown as ReturnType<typeof getSupabaseAdminClient>,
  )
  return { from, select, eq, rpc }
}

describe("supabaseLedgerDb", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("finds users.id by clerk_user_id", async () => {
    const client = fakeAdminClient({ data: { id: "3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c" }, error: null })

    await expect(supabaseLedgerDb().findUserId("user_123")).resolves.toEqual({
      id: "3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c",
    })
    expect(client.from).toHaveBeenCalledWith("users")
    expect(client.select).toHaveBeenCalledWith("id")
    expect(client.eq).toHaveBeenCalledWith("clerk_user_id", "user_123")
  })

  it("answers missing when no row has the Clerk id", async () => {
    fakeAdminClient({ data: null, error: null })

    await expect(supabaseLedgerDb().findUserId("user_123")).resolves.toEqual({
      missing: true,
    })
  })

  it("answers the error message when the lookup fails", async () => {
    fakeAdminClient({ data: null, error: { message: "connection reset" } })

    await expect(supabaseLedgerDb().findUserId("user_123")).resolves.toEqual({
      error: "connection reset",
    })
  })

  it("calls the SQL function through rpc and answers the error message", async () => {
    const client = fakeAdminClient(
      { data: null, error: null },
      { data: null, error: { message: "RPC error" } },
    )

    const answer = await supabaseLedgerDb().call("rollback_restoration", {
      p_restoration_id: "restoration-uuid",
    })

    expect(answer).toEqual({ data: null, error: "RPC error" })
    expect(client.rpc).toHaveBeenCalledWith("rollback_restoration", {
      p_restoration_id: "restoration-uuid",
    })
  })
})

describe("createCreditLedger() on the Supabase adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("grants through the admin client's rpc with today's arguments", async () => {
    const client = fakeAdminClient({ data: null, error: null }, { data: true, error: null })

    const result = await createCreditLedger().grantPurchase(asUserId("3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c"), {
      stripePaymentId: "pi_123",
      credits: 20,
      amountPaid: 999,
      packageType: "starter",
    })

    expect(result).toEqual({ ok: true, granted: true })
    expect(client.rpc).toHaveBeenCalledWith("grant_purchase_credits", {
      p_user_id: "3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c",
      p_stripe_payment_id: "pi_123",
      p_credits: 20,
      p_amount_paid: 999,
      p_package_type: "starter",
    })
  })

  it("obtains one admin client per operation, as the old functions do", async () => {
    const client = fakeAdminClient(
      { data: { id: "3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c" }, error: null },
      { data: [{ paid_credits: 3 }], error: null },
    )
    const ledger = createCreditLedger()

    await expect(ledger.balance(asClerkUserId("user_123"))).resolves.toEqual({
      ok: true,
      paidCredits: 3,
    })
    expect(getSupabaseAdminClient).toHaveBeenCalledTimes(1)
    expect(client.rpc).toHaveBeenCalledWith("check_user_credits", { p_user_id: "3f2b8c1e-5a4d-4e7a-9b6c-1d2e3f4a5b6c" })

    await ledger.balance(asClerkUserId("user_123"))
    expect(getSupabaseAdminClient).toHaveBeenCalledTimes(2)
  })
})

describe("the LedgerDb seam stays internal", () => {
  const ROOT = path.resolve(__dirname, "../../..")

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = path.join(dir, name)
      if (statSync(full).isDirectory()) return sourceFiles(full)
      return /\.tsx?$/.test(name) ? [full] : []
    })
  }

  it("is not imported from app/ or components/", () => {
    const importers = ["app", "components"]
      .flatMap((dir) => sourceFiles(path.join(ROOT, dir)))
      .filter((file) => readFileSync(file, "utf8").includes("credits/ledger-db"))
      .map((file) => path.relative(ROOT, file))

    expect(importers).toEqual([])
  })
})
