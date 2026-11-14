# Ledger tests run real SQL in PGlite

Status: accepted (2026-11-10)

The money rules live in SQL functions (`scripts/004`, `006`, `007`): the row lock on a Charge, a Balance that never goes below zero, one Grant per payment, and the Reversal of a Charge. Tests of the credit ledger that mock the database only test the mock, so none of these rules were ever tested.

## Decision

The rules stay in SQL. The ledger's tests run them for real in [PGlite](https://pglite.dev), an in-process Postgres, through the ledger's `LedgerDb` seam (`__tests__/lib/credits/pglite-ledger-db.ts`, used by `ledger-sql.test.ts`). The adapter loads the repo's numbered scripts in order, after small stubs for the Supabase roles and `auth.uid()` / `auth.role()`.

PGlite is a test-only dev dependency. Nothing under `lib/` or `app/` imports it, so it does not reach the Worker bundle.

## Rejected

- A local Supabase in Docker: heavier, slower, and CI would need Docker and a running stack.
- Mocks of the database: they cannot catch a broken SQL rule.

## Limits

- PGlite runs one connection. It does not prove that two concurrent Charges at a Balance of 1 let only one through. That stays guaranteed by the row lock (`FOR UPDATE`) in SQL, and is untested.
- The tests run the repo's scripts, not what production runs. A function edited by hand in Supabase is not seen.
- The stubs do not enforce row-level security or role grants as Supabase does.
