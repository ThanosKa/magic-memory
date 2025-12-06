<div align="center">

<h1>✨ Magic Memory ✨</h1>

[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Radix-8A3FFC?style=for-the-badge)](https://ui.shadcn.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Replicate](https://img.shields.io/badge/Replicate-GFPGAN-0F9D58?style=for-the-badge)](https://replicate.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-00E9A3?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![pnpm](https://img.shields.io/badge/pnpm-FFCF00?style=for-the-badge&logo=pnpm&logoColor=black)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/thaka/magic-memory?style=for-the-badge&logo=github)](https://github.com/thaka/magic-memory/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthaka%2Fmagic-memory)

<p>AI-powered photo restoration SaaS that revives old, blurry, or damaged photos with GFPGAN, safe-by-default uploads, no persistent image storage, and a transparent credit system.</p>

[Report Bug](https://github.com/thaka/magic-memory/issues/new?template=bug_report.md) · [Request Feature](https://github.com/thaka/magic-memory/issues/new?template=feature_request.md) · [Discussions](https://github.com/thaka/magic-memory/discussions)

</div>

---

## 📸 Screenshot

<div align="center">
  <img src="./public/og-image-restore.png" alt="Magic Memory restored photo preview" width="90%" />
</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
  - [SEO and Performance](#seo-and-performance)
  - [Enhanced UX](#enhanced-ux)
- [Demo](#demo)
- [How It Works](#how-it-works)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
  - [Run Locally](#run-locally)
  - [Testing](#testing)
  - [SEO Check](#seo-check)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [CI](#ci)
- [Contributing](#contributing)
- [Security](#security)
- [Acknowledgments](#acknowledgments)
- [Star History](#star-history)
- [Contact](#contact)
- [Support](#support)
- [License](#license)
- [Back to Top](#back-to-top)

---

## About

Magic Memory lets anyone restore old, blurry, or damaged photos in seconds. Upload a photo, pass an on-device NSFW check, pay with credits, and download a sharper, cleaner result processed with GFPGAN on Replicate. Auth is handled by Clerk, payments by Stripe, data by Supabase, and safety by Upstash Redis rate limits.

## Features

- One-click restoration with GFPGAN on Replicate.
- Client-side NSFW detection before the upload leaves the browser.
- Credit system with a daily free credit plus paid packs that never expire.
- Real-time restoration status, before/after slider, and direct download of results.
- Supabase-backed history (metadata only, no binary image storage) so users can revisit prior restorations.
- Authentication with Clerk; payments via Stripe Checkout.
- Rate limiting via Upstash Redis; structured logging with Pino; validation via Zod.

### SEO and Performance

- Next.js Metadata API for dynamic Open Graph and Twitter cards.
- Core Web Vitals tracking during development.
- SEO audit script (`pnpm seo:audit`) against the running app.
- Optimized assets and Tailwind v4 for lean output.

### Enhanced UX

- Smooth navigation with responsive layouts and shadcn/ui components.
- Animated interactions for CTA buttons and upload states.
- Clear progress states while Replicate jobs run.
- Accessible forms, keyboard support, and consistent focus handling.

## Demo

- Run locally with `pnpm dev` at `http://localhost:3000`.
- Deploy to Vercel with the one-click button above and plug in your env vars.

Quick preview of the flow: upload → NSFW check → Replicate GFPGAN → credit deduction → download and view history (no persistent binary storage).

## How It Works

1. User uploads an image; client-side NSFW scanning blocks unsafe files.
2. Clerk session guards the request; credit balance is checked before processing.
3. The image stays in memory, is encoded, and sent to Replicate for restoration (no Supabase Storage writes).
4. Replicate runs GFPGAN and returns an enhanced image URL.
5. Restoration metadata, credit usage, and timestamps are recorded in Supabase.
6. The user can preview with a before/after slider and download the result.

## Built With

| Category      | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                                 |
| Language      | TypeScript (strict)                                     |
| Styling       | Tailwind CSS v4 + shadcn/ui                             |
| Auth          | Clerk                                                   |
| Database      | Supabase (PostgreSQL; metadata only, no binary storage) |
| AI            | GFPGAN on Replicate                                     |
| Rate limiting | Upstash Redis                                           |
| Payments      | Stripe                                                  |
| Data fetching | SWR                                                     |
| Validation    | Zod                                                     |
| Logging       | Pino                                                    |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Accounts: Clerk, Supabase, Stripe, Replicate, Upstash Redis

### Installation

```bash
git clone https://github.com/thaka/magic-memory.git
cd magic-memory
pnpm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Fill in Clerk, Supabase (URL, anon, service role), Stripe (secret, webhook, publishable, price IDs), Replicate token, Upstash Redis URL/token, and NEXT_PUBLIC_APP_URL.
```

### Database Setup

Run the SQL migrations in order:

```bash
psql "$SUPABASE_DB_URL" -f scripts/001_create_users_table.sql \
  -f scripts/002_create_restorations_table.sql \
  -f scripts/003_create_purchases_table.sql \
  -f scripts/004_create_atomic_credit_functions.sql
```

### Run Locally

```bash
pnpm dev
# http://localhost:3000
```

### Testing

- `pnpm lint` — ESLint quality gate.
- `pnpm type-check` — TypeScript without emit.
- `pnpm test:run` — Vitest suite used in CI.
- `pnpm test:coverage` — Vitest with coverage.

### SEO Check

```bash
# Terminal 1
pnpm dev

# Terminal 2
pnpm seo:audit
```

Optionally target a deployed URL:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com pnpm seo:audit
```

## Usage

1. Sign in with Clerk.
2. Upload a photo; NSFW filtering runs client-side.
3. Confirm credit use (daily free credit or paid pack).
4. Wait for the Replicate job; watch progress in real time.
5. Compare before/after and download the restored image.
6. View history and receipts in your account.

## Project Structure

```
magic-memory/
├── app/                 # App Router routes and API endpoints
├── components/          # UI, upload flow, restore experience
├── lib/                 # Supabase clients, Redis, logger, validations
├── scripts/             # SQL migrations and SEO audit script
├── __tests__/           # Vitest coverage for APIs and libs
└── .github/             # CI workflow and templates
```

## Architecture

- App Router pages in `app/`; API handlers in `app/api/`.
- Auth via Clerk middleware in `proxy.ts`.
- Credits tracked in Supabase with atomic SQL functions; daily free credit plus non-expiring paid credits.
- No binary storage; only restoration metadata/URLs in Supabase; rate limiting via Upstash Redis.
- AI restoration through Replicate GFPGAN; metadata persisted for history.
- Logging with Pino and validation with Zod; SWR for client data fetching.

## Deployment

- Vercel: click the button above, set all environment variables, and deploy.
- Manual: `pnpm build` then `pnpm start` on Node 20+ with the same env vars as `.env.local`.

Production checklist:

- Update all environment variables for production.
- Enable Supabase connection pooling.
- Configure Clerk production instance and webhooks.
- Set Stripe live keys and webhook secrets.
- Add Upstash Redis production tokens.
- Configure custom domain and error tracking if desired.

## CI

`.github/workflows/ci.yml` runs lint, type-check, Vitest, and build on Node 20 and 22.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Use the issue templates for bugs and features, and the PR template when submitting changes.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Avoid filing public issues for security concerns.

## Acknowledgments

- [GFPGAN](https://github.com/TencentARC/GFPGAN)
- [Replicate](https://replicate.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)

## Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=thaka/magic-memory&type=Date)](https://star-history.com/#thaka/magic-memory&Date)

</div>

## Contact

- GitHub Issues: [Open an issue](https://github.com/thaka/magic-memory/issues)
- Discussions: [Join the conversation](https://github.com/thaka/magic-memory/discussions)
- X: [@KazakisThanos](https://x.com/KazakisThanos)
- Email: kazakis.th@gmail.com

## Support

[Buy Me a Coffee](https://buymeacoffee.com/thaka)

## License

Apache License 2.0. See [LICENSE](LICENSE).

---

<div id="back-to-top" align="center">

[Back to Top](#readme)

</div>
