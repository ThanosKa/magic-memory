import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase/server"

export type LedgerFunction =
  | "check_user_credits"
  | "deduct_credit_and_record_restoration"
  | "grant_purchase_credits"
  | "rollback_restoration"

export type UserLookup = { id: string } | { missing: true } | { error: string }

export type LedgerDb = {
  findUserId(clerkUserId: string): Promise<UserLookup>
  call(
    fn: LedgerFunction,
    args: Record<string, unknown>,
  ): Promise<{ data: unknown; error: string | null }>
}

const userRowSchema = z.object({ id: z.string() })

export function supabaseLedgerDb(): LedgerDb {
  const supabase = getSupabaseAdminClient()

  return {
    async findUserId(clerkUserId) {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle()

      if (error) return { error: error.message }
      const row = userRowSchema.safeParse(data)
      return row.success ? { id: row.data.id } : { missing: true }
    },

    async call(fn, args) {
      const { data, error } = await supabase.rpc(fn, args)
      return { data, error: error ? error.message : null }
    },
  }
}
