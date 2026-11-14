# Provisioning never updates an existing User

Status: accepted (2026-11-10)

Provisioning creates a User's `users` row the first time they appear, from the Clerk webhook or from `GET /api/credits` when the webhook has not landed. Both can run at once, and either can run for a User who already has a row.

## Decision

Provisioning is insert or nothing. On a conflict on `clerk_user_id` it changes no column of the existing row, returns the row as it was, and reports `already_existed`. It never uses an upsert that updates on conflict.

The one allowed change to an existing row is a Re-link: a row with the same email under another Clerk id gets the new Clerk id and keeps its Credits and history.

`findUser` answers `error`, never `missing`, when the read fails, so a database error is not mistaken for a new User.

## Why

An updating upsert wrote the Signup credit over the Balance of Users who already had a row, and reset paying customers' Balances. Insert or nothing makes that impossible: a second call cannot touch the first call's row, and two concurrent calls give one `created` and one `already_existed`.

A later cleanup can look like a simplification ("upsert with the new profile fields, so the row stays fresh"). That is the bug. Do not do it.

## Rejected

- An upsert that updates on conflict: resets the Balance.
- Reading first, then inserting: a race between the two callers, and a failed read looks like a missing row.
