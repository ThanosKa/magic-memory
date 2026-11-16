import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { PGlite } from "@electric-sql/pglite"
import type { LedgerDb, LedgerFunction } from "@/lib/credits/ledger-db"

/**
 * The PGlite adapter for the ledger's `LedgerDb` seam: an in-process Postgres
 * loaded with the repo's numbered SQL scripts. Test-only; nothing in `lib/` or
 * `app/` imports it, so PGlite never reaches the Worker bundle.
 */

const SCRIPTS_DIR = path.resolve(__dirname, "../../../scripts")

/** What Supabase provides and the scripts assume: the roles and the `auth` helpers. */
const SUPABASE_STUBS = `
  CREATE ROLE anon NOLOGIN;
  CREATE ROLE authenticated NOLOGIN;
  CREATE ROLE service_role NOLOGIN;
  CREATE SCHEMA auth;
  CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULL::uuid $$;
  CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT 'service_role'::text $$;
`

/** These functions return one value; the others return a table of rows. */
const SCALAR_FUNCTIONS: ReadonlySet<LedgerFunction> = new Set([
  "grant_purchase_credits",
  "rollback_restoration",
])

export type PgliteLedger = {
  db: LedgerDb
  /** Runs SQL directly, for setting up and inspecting rows. */
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>
  close(): Promise<void>
}

/** Loads every `scripts/NNN_*.sql`, in order, into a fresh in-memory database. */
export async function createPgliteLedger(): Promise<PgliteLedger> {
  const pg = new PGlite()
  await pg.exec(SUPABASE_STUBS)

  const files = readdirSync(SCRIPTS_DIR)
    .filter((name) => /^\d{3}_.*\.sql$/.test(name))
    .sort()
  for (const file of files) {
    await pg.exec(readFileSync(path.join(SCRIPTS_DIR, file), "utf8"))
  }

  const query = async <T,>(sql: string, params: unknown[] = []) =>
    (await pg.query<T>(sql, params)).rows

  const db: LedgerDb = {
    async findUserId(clerkUserId) {
      try {
        const rows = await query<{ id: string }>("SELECT id FROM users WHERE clerk_user_id = $1", [
          clerkUserId,
        ])
        return rows[0] ? { id: rows[0].id } : { missing: true }
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) }
      }
    },

    async call(fn, args) {
      const names = Object.keys(args)
      const named = names.map((name, i) => `${name} => $${i + 1}`).join(", ")
      const scalar = SCALAR_FUNCTIONS.has(fn)
      const sql = scalar ? `SELECT ${fn}(${named}) AS result` : `SELECT * FROM ${fn}(${named})`
      try {
        const rows = await query<Record<string, unknown>>(
          sql,
          names.map((name) => args[name]),
        )
        return { data: scalar ? rows[0]?.result : rows, error: null }
      } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : String(error) }
      }
    },
  }

  return { db, query, close: () => pg.close() }
}
