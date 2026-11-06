# Magic Memory

AI photo restoration SaaS on the Next.js 16 App Router. A signed-in user uploads an old photo, GFPGAN on Replicate restores it, and a successful run costs one prepaid credit.

## Data flow

- **Restore**: `components/restore/restore-uploader.tsx` → `POST /api/restore` (multipart, image held in memory) → Replicate (polled) → SQL function `deduct_credit_and_record_restoration` → Replicate output URL back to the browser
- **Purchase**: `components/pricing/pricing-cards.tsx` → `POST /api/stripe/create-checkout` → Stripe Checkout → `POST /api/stripe/webhook` adds credits and records the purchase
- **New user**: Clerk → `POST /api/clerk/webhook` creates the `users` row; `GET /api/credits` creates it as a fallback when the webhook has not landed
- **Balance**: the header and the uploader read `GET /api/credits` through SWR

## What the layout does not show

- `proxy.ts` is Next 16's middleware; it guards the `/restore` and `/profile` pages only, so each API route calls `auth()` itself
- Server data access goes through `getSupabaseAdminClient()` (service role) and SQL functions; there is no ORM
- `scripts/` holds the numbered SQL migrations, applied by hand, plus the file-based `seo-audit.ts`
- Redis (Upstash) only rate-limits `/api/restore`, and the route keeps working when Redis is down
- Tests live in `__tests__/`, mirroring the source tree
- Env vars are listed in `.env.example` and read straight from `process.env`; there is no validation module

## Commands

pnpm only. Run tests once with `pnpm test:run` (`pnpm test` is watch mode). Before committing run `pnpm lint`, `pnpm type-check` and `pnpm test:run`, the three checks CI runs before its build step. CI also runs `pnpm build` on pull requests, with placeholder env values (see `.github/workflows/ci.yml`). `pnpm build` ignores type errors (`ignoreBuildErrors` in `next.config.mjs`), so it never replaces `pnpm type-check`. `pnpm test:coverage` fails until `@vitest/coverage-v8` is installed.

## Before working on

- Any code (writing, editing or reviewing a diff) → read `CODING_STANDARDS.md`; every rule there applies
- Credits, `/api/restore`, Stripe checkout or webhook, credit packs or prices → read `.claude/docs/credits-and-billing.md`
- Clerk webhook, `users` rows or route protection → read `.claude/docs/auth-and-users.md`
- Schema, SQL functions or migrations → read `.claude/docs/database.md`
- Marketing copy or SEO pages → read `.agents/product-marketing-context.md` (its prices and free-credit claims are out of date; `lib/constants.ts` wins), then run `pnpm seo:audit`

## Git

- Commits: `type(scope): description`, lower case, e.g. `fix(header): show sign-in buttons while Clerk is loading`. Types in use: feat, fix, refactor, perf, chore, docs, test
- Branches: `type/short-name` from `main` (`feat/darkroom-ui`, `chore/env-example-sync`), merged through a PR using `.github/pull_request_template.md`
- If your change makes a line in these docs false, fix that line in the same PR.
- Run `git reset --hard` or `git push --force` only when the developer asks for that exact command

## Guardrails

- Ask the developer before installing a dependency, running a migration against Supabase or editing a `.env*` file
- Keep image bytes in memory: the privacy page promises we never store photos, so uploads and results stay out of Supabase Storage and every other store we own; the database holds metadata and the Replicate URL
- Keep secrets server-side (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `REPLICATE_API_TOKEN`, `CLERK_SECRET_KEY`, webhook secrets); client code reads only `NEXT_PUBLIC_*`
- Change a credit balance only through the paths in `.claude/docs/credits-and-billing.md`
