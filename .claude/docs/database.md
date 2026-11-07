# Database

Supabase Postgres, with no ORM and no migration tool. Ask the developer before running anything against Supabase.

## Changing the schema

1. Add the next numbered file in `scripts/` (`NNN_short_description.sql`).
2. Grant access in the same file: Supabase stopped granting Data API access to new public tables on 2026-10-30, and `scripts/005_data_api_grants.sql` only covers tables that existed when it ran. A new table needs `grant all on <table> to service_role`.
3. Have the developer run it in the Supabase SQL Editor. A fresh database runs every file in numeric order.
4. Update the Zod schemas in `lib/validations/index.ts`, which mirror the tables.

## SQL functions

- Follow `scripts/006_atomic_purchase_grant.sql`: `SECURITY DEFINER`, `SET search_path = public`, `REVOKE ALL ... FROM PUBLIC, anon, authenticated`, then `GRANT EXECUTE ... TO service_role`. Skipping the revoke leaves the function callable with the public key, because Postgres lets everyone execute a new function by default.
- Wrap each one in `lib/supabase/transactions.ts`, translating the Clerk id to `users.id` first.

## Access model

- Application code uses `getSupabaseAdminClient()` only. `getSupabaseServerClient()` and `getSupabaseBrowserClient()` exist but nothing calls them.
- The service role bypasses row-level security, and the RLS policies check `auth.uid()`, which Clerk sessions do not set. User isolation therefore rests on the query filters in server code.
