# Auth and users

## Route protection

- `proxy.ts` protects the `/restore` and `/profile` pages. It lets everything through when the Clerk env vars are missing or Clerk fails to load, so it is never the check an API route relies on.
- A new protected page goes in the `createRouteMatcher` list in `proxy.ts`.

## Two user ids

- `auth()` returns the Clerk id, stored in `users.clerk_user_id`. Foreign keys and SQL functions use `users.id` (UUID).
- Translate with a `clerk_user_id` lookup first, as `lib/supabase/transactions.ts` does.

## Creating the `users` row

- `user.created` in `app/api/clerk/webhook/route.ts` inserts the row and treats a duplicate key (`23505`) as success, because Clerk retries webhooks.
- `GET /api/credits` calls `ensureUser` (`lib/supabase/ensure-user.ts`) when no row is found. This closes the race where a new signup loads the app before the webhook lands and sees 0 credits.
- When the email already exists under another Clerk id (user recreated, or a dev-to-prod instance switch), `ensureUser` re-links the row to the new id, keeping its credits and history. This is safe because other tables reference `users.id`.
- Keep the `ensureUser` upsert away from existing rows: it must never change the balance of a user who already has a row.

## Clerk webhook

- Verify with `svix` on the raw `request.text()` body, then parse the event with the Zod schema in the route.
- Answer 500 on a database failure so Clerk retries.
- `user.deleted` deletes the row; `ON DELETE CASCADE` removes restorations and purchases.

## Clerk styling

Clerk's appearance is built from the theme tokens in `lib/theme/clerk-appearance.ts`.
