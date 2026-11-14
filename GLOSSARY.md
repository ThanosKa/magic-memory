# Glossary

The words this repo uses for money, identity and pages. Use them in code, commits and copy. "Avoid" lists words that mean something else here or hide a distinction.

## Credits and money

- **Credit**: the prepaid unit spent on one successful Restoration. Never expires.
- **Balance**: how many Credits a User has now (`users.paid_credits`). Never below zero.
- **Credit pack**: one of the fixed bundles of Credits sold at a fixed euro price. Avoid: package, plan, tier.
- **Signup credit**: the single Credit a new User receives once, at Provisioning. Avoid: free credit.
- **Daily free credit**: a retired offer. Do not promise it in code or copy.
- **Charge**: taking one Credit for a Restoration that already succeeded. Avoid: deduction.
- **Grant**: adding a Credit pack's Credits after a Verified purchase. Avoid: top-up.
- **Reversal**: undoing a Charge after a technical failure. It is not a Refund. Avoid: rollback (in prose).
- **Refund**: returning money for a Purchase. Magic Memory offers none.
- **Purchase**: a completed Stripe checkout for one Credit pack, recorded once per payment.
- **Verified purchase**: a Purchase whose package, price, amount and currency match the Credit pack.

## People and rows

- **User**: a person with a Clerk account and one `users` row.
- **Clerk id**: the id Clerk gives the User (`users.clerk_user_id`).
- **User id**: the id of the User's `users` row (`users.id`). Foreign keys use it.
- **Provisioning**: creating a User's row the first time they appear, with their Signup credit. Avoid: ensure user.
- **Re-link**: attaching an existing User row to a new Clerk id with the same email. Avoid: merge.
- **Restoration**: one successful AI run on one uploaded photo. Avoid: job.

## Marketing

- **Use-case page**: a marketing page aimed at one kind of photo or need. Avoid: landing page.
