# Contributing to magic-memory

Thank you for helping build magic-memory. This guide explains how to set up your environment, propose changes, and get reviews efficiently.

## Ground rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Default to transparency: document decisions in issues or PRs.
- Keep secrets out of commits and CI logs.

## Getting started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/ThanosKa/magic-memory.git
   cd magic-memory
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env.local
   # add Clerk, Supabase, Stripe, Replicate, Upstash keys
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/short-description
   ```

## Development workflow

Run locally:

```bash
pnpm dev
```

Quality gates (run before pushing):

```bash
pnpm lint
pnpm type-check
pnpm test:run
pnpm build
```

For SEO checks:

```bash
pnpm run seo:audit
```

## Style and conventions

- TypeScript strict; avoid `any`.
- Validate inputs with Zod in API routes.
- Use Tailwind + shadcn/ui for styling; prefer server components unless client hooks are required.
- Logging via Pino with request context; avoid console logs.
- Follow Conventional Commits (e.g., `feat: add restore uploader`).
- Keep PRs scoped and include tests when adding logic.

## Pull requests

- Fill out the PR template with summary, testing, and screenshots if UI changes.
- Link related issues and note breaking changes.
- Ensure CI passes (lint, type-check, tests, build).
- Request review once ready; convert to draft if still in progress.

## Filing issues

- For bugs, include steps to reproduce, expected vs actual behavior, and environment details.
- For features, describe the problem, proposal, and alternatives considered.
- Use `good first issue` for newcomer-friendly tasks.

## Security

Report vulnerabilities privately per [SECURITY.md](SECURITY.md); do not open public issues for security reports.
