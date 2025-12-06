<div align="center">

# magic-memory

![magic-memory Banner](/public/og-image.png)

AI-powered photo restoration that brings your memories back to life.

[![CI](https://github.com/thaka/magic-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/thaka/magic-memory/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/thaka/magic-memory?style=social)](https://github.com/thaka/magic-memory/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

[Demo](https://magic-memory.app) · [Report Bug](https://github.com/thaka/magic-memory/issues/new?template=bug_report.md) · [Request Feature](https://github.com/thaka/magic-memory/issues/new?template=feature_request.md)

</div>

---

## Overview

magic-memory is a SaaS app that restores old, blurry, or damaged photos using the GFPGAN model on Replicate. It provides instant results, payments, a credit system, and a streamlined UX for uploads, safety checks, and downloads.

## Features

- AI restoration via GFPGAN on Replicate.
- Credit system with daily free credit plus paid packs that never expire.
- Real-time status updates and fast processing.
- Interactive before/after comparison slider.
- Client-side NSFW detection before upload.
- Authentication with Clerk; payments via Stripe; storage in Supabase.

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15/16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | Clerk |
| Database/Storage | Supabase (PostgreSQL + Storage) |
| AI | GFPGAN on Replicate |
| Rate limiting | Upstash Redis |
| Payments | Stripe |
| Logging | Pino |
| Data fetching | SWR |
| Validation | Zod |

## Quick start

### Prerequisites
- Node.js 20+
- pnpm
- Accounts: Clerk, Supabase, Stripe, Replicate, Upstash

### Setup
```bash
git clone https://github.com/thaka/magic-memory.git
cd magic-memory
pnpm install
cp .env.example .env.local
# add Clerk, Supabase, Stripe, Replicate, Upstash keys
```

### Database
Run the SQL scripts in `scripts/` (in order):
- `scripts/001_create_users_table.sql`
- `scripts/002_create_restorations_table.sql`
- `scripts/003_create_purchases_table.sql`
- `scripts/004_create_atomic_credit_functions.sql`

### Run
```bash
pnpm dev
# visit http://localhost:3000
```

## Project structure

```
magic-memory/
├── app/                # Next.js App Router pages and APIs
├── components/         # UI and feature components
├── lib/                # Supabase clients, Redis, logger, validations
├── scripts/            # Database migrations and SEO audit
├── __tests__/          # Vitest coverage for APIs and libs
└── .github/            # CI, issue/PR templates, funding
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm lint` | ESLint quality gate |
| `pnpm type-check` | TypeScript check without emit |
| `pnpm test:run` | Run Vitest in CI mode |
| `pnpm build` | Production build (includes type-check) |
| `pnpm start` | Start production server after build |
| `pnpm run seo:audit` | SEO audit script |

Pre-commit: run `pnpm lint` and `pnpm type-check`.

## Architecture at a glance

- **App Router** pages under `app/`; API routes live in `app/api/`.
- **Auth** via Clerk middleware in `proxy.ts`; protected routes include `/restore` and `/profile`.
- **Credits** tracked in Supabase with RPC functions; free daily credit resets and paid credits never expire.
- **Storage** uses Supabase Storage; rate limiting via Upstash Redis.
- **AI restore** calls Replicate GFPGAN; results stored and returned to the user.
- **Logging** with Pino; validations via Zod.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs pnpm lint, type-check, tests, and build on Node 20 and 22. Secrets are stubbed with safe placeholders.

## Contributing

We welcome contributions. Read the [Contributing Guide](CONTRIBUTING.md) and follow the [Code of Conduct](CODE_OF_CONDUCT.md). Use the issue templates for bugs and feature requests, and the PR template when submitting changes.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Do not open public issues for security reports.

## Funding

Support the project: [Buy Me a Coffee](https://buymeacoffee.com/thaka).

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Acknowledgments

- [GFPGAN](https://github.com/TencentARC/GFPGAN)
- [Replicate](https://replicate.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)
