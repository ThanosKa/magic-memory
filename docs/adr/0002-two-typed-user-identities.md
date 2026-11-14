# Two typed user identities

Status: accepted (2026-11-10)

A User has two ids: the Clerk id (`users.clerk_user_id`, from Clerk) and the User id (`users.id`, the row's own id). Routes start from the Clerk id, because that is what `auth()` returns. Everything stored uses the User id.

## Decision

Clerk id and User id stay two separate identities, each its own branded type, so the compiler rejects one passed where the other is expected. They are not unified into one id.

## Why

- The User id travels in the metadata of Stripe checkout sessions. Sessions already open when a change ships still carry the old value, and the webhook must keep finding the User with it.
- Foreign keys (`purchases`, `restorations` and others) reference `users.id`, not `clerk_user_id`. Re-link depends on this: the Clerk id changes when a User is recreated or an instance switches, and nothing else has to move.
- Both ids are plain strings, so mixing them up type-checks and fails only at run time. Separate types make that a compile error.

## Rejected

- Unifying them, so Clerk id is the key everywhere. A review proposed it. It would break open Stripe sessions, rewrite every foreign key, and make Re-link impossible without rewriting history.
- Plain `string` for both: the status quo that allows the mix-up.
