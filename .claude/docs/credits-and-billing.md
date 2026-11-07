# Credits and billing

Money rules. Every section applies to any diff that touches `app/api/restore/`, `app/api/stripe/`, `app/api/credits/`, `lib/supabase/transactions.ts` or `lib/constants.ts`; those changes ship with tests in `__tests__/`.

## The credit model

- One balance: `users.paid_credits` (`CHECK >= 0`). One successful restoration costs one credit. Credits never expire.
- All sales are final: `app/terms/page.tsx` promises no refunds under any circumstances. `rollback_restoration` reverses a technical failure and is not a refund path.
- A new user gets one one-time credit, set in two places that must agree: `app/api/clerk/webhook/route.ts` and `lib/supabase/ensure-user.ts`.
- The daily free credit was removed on purpose (commits `dca4871`, `fcd4c84`, `1555030`). `/api/restore` gates on `paid_credits` alone, and `/api/credits` reports `hasFreeDaily: false`, because adding it showed users a phantom credit that returned 403 when spent. `__tests__/api/restore/route.test.ts` holds the regression test.
- These free-credit leftovers are inert, so leave them unwired: the helpers in `lib/redis.ts`, the free columns from `check_user_credits`, `restorations.used_free_credit`, `APP_CONFIG.freeRestorationPerDay`.
- Public copy must not promise the daily credit back; `__tests__/copy/free-credit-claims.test.ts` fails if it does.

## `POST /api/restore`

- Keep the order: auth, rate limit, input validation, credit check, Replicate, then charge. A failed run costs nothing because the charge comes after Replicate succeeds.
- Charge only through the `deduct_credit_and_record_restoration` SQL function, via `deductCreditAndRecordRestoration` in `lib/supabase/transactions.ts`. It locks the user row, rejects an empty balance and inserts the `restorations` row in one transaction.
- Keep `noStore()` at the top of the handler: without it Next caches the Replicate polling requests.
- `restorations.original_image_url` holds the placeholder `ephemeral:<filename>`, because the original is never stored.
- The rate limit (10 per minute per user) fails open when Redis is unavailable, deliberately: a Redis outage must not block paying users.

## Stripe

- The webhook reads the raw `request.text()` body and verifies it with `stripe.webhooks.constructEventAsync` before trusting anything. The sync `constructEvent` throws on Cloudflare Workers.
- `metadata.userId` on the checkout session is `users.id` (UUID), not the Clerk id, which travels separately as `metadata.clerkUserId`.
- Before granting credits the webhook checks metadata, package, price id, amount (discounts included) and currency `eur` against `CREDIT_PACKAGES`. A mismatch is logged and answered with 200, since a retry cannot fix it.
- A 100% discount session has no `payment_intent`; the webhook uses `session.id` as the payment id.
- Grant credits only through the `grant_purchase_credits` SQL function (`scripts/006_atomic_purchase_grant.sql`), via `grantPurchaseCredits` in `lib/supabase/transactions.ts`. It records the purchase and adds the credits in one transaction, and the unique index on `purchases.stripe_payment_id` makes a redelivered event change nothing.
- A failed grant answers 500 so Stripe redelivers it. Answering 200 would leave a paid customer without credits.
- The API version is pinned with `@ts-expect-error` in `app/api/stripe/webhook/route.ts` and `app/api/stripe/create-checkout/route.ts`; change the two together.

## Credit packs

Packs live in `CREDIT_PACKAGES` in `lib/constants.ts`: 20, 60 and 120 credits at €9.99, €19.99 and €29.99, priced in cents. A pack change touches the Stripe prices (`NEXT_PUBLIC_STRIPE_PRICE_*`), the tests and the copy in `app/`, `lib/seo/`, `lib/blog/`, `public/pricing.md` and `public/llms.txt`; `git show --stat bf41562` is the model diff. Renaming a pack also touches the `package_type` check in `scripts/003_create_purchases_table.sql` and the enums in `lib/validations/`.
