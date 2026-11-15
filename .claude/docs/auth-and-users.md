# Auth and users

## Route protection

- `proxy.ts` protects the `/restore` and `/profile` pages. It lets everything through when the Clerk env vars are missing or Clerk fails to load, so it is never the check an API route relies on.
- A new protected page goes in the `createRouteMatcher` list in `proxy.ts`.

## Two user ids

- `auth()` returns the Clerk id, stored in `users.clerk_user_id`. Foreign keys and SQL functions use `users.id` (UUID).
- Translate with a `clerk_user_id` lookup first, as the credit ledger in `lib/credits/ledger.ts` does for `balance` and `chargeRestoration`.

## Creating the `users` row

- `user.created` in `app/api/clerk/webhook/route.ts` calls `provisionUser` too, so both entry points follow one Provisioning rule. "created" sends the welcome email; "already_existed" (a retried webhook, or the fallback got there first) answers 200 and writes nothing; "relinked" answers 200, sends no welcome email and logs it; a failure answers 500 so Clerk retries.
- `GET /api/credits` reads the row with `findUser` and calls `provisionUser` (both in `lib/users/index.ts`) when it answers `missing`. This closes the race where a new signup loads the app before the webhook lands and sees 0 credits. An `error` answer is not `missing`: the route answers 500 and never calls Clerk or `provisionUser`.
- When the email already exists under another Clerk id (user recreated, or a dev-to-prod instance switch), `provisionUser` re-links the row to the new id at once, from whichever entry point comes first, keeping its credits and history. A row is re-linked only when the email is the Clerk user's primary address, Clerk reports it verified and it is not empty; otherwise `provisionUser` fails (the webhook answers 500, `GET /api/credits` answers 500) and writes nothing. The re-link also sets the name and image when Clerk sent them, and keeps the stored ones when not. This is safe because other tables reference `users.id`.
- Known and accepted risk (owner decision): the re-link matches on email alone and does not check that the old Clerk id is gone. If Clerk user A changes email and A's `user.updated` is late or lost, a new Clerk user B who verifies A's old address could take A's row. The same email-only match also hands a deleted account's row and history to a new signup with that email if the deleted account's `user.deleted` webhook has not landed yet. Closing it needs a Clerk `users.getUser(oldClerkId)` not-found check.
- Keep the `provisionUser` upsert away from existing rows: it must never change the balance of a user who already has a row. It inserts or does nothing on a `clerk_user_id` conflict (`ignoreDuplicates`), then returns the existing row untouched.

## Clerk webhook

- Verify with `svix` on the raw `request.text()` body, then parse the event with the Zod schema in the route.
- Answer 500 on a database failure so Clerk retries.
- `user.deleted` deletes the row; `ON DELETE CASCADE` removes restorations and purchases.

## Clerk styling

Clerk's appearance is built from the theme tokens in `lib/theme/clerk-appearance.ts`.
