# AI Agent Guide

Instructions below are for AI assistants. Keep responses concise and aligned with the `.cursor` canonical files.

## Project Overview

**magic-memory** - AI-powered photo restoration SaaS using GFPGAN model

**Core Flow:** User uploads old photo → NSFW check → Supabase Storage → Replicate GFPGAN → Restored image → Credit deduction → Download

## Repo Map

- Primary framework: **Next.js 15 App Router** + TypeScript + React 19
- Auth in `proxy.ts` (Clerk route protection); API routes in `app/api/`
- Photo restoration logic in `app/api/restore/`, `app/api/upload/`
- Credit system in `app/api/credits/`, `lib/redis.ts` (free), `lib/supabase/` (paid)
- Payment handling in `app/api/stripe/`
- UI components in `components/` (shadcn/ui)
- Validations in `lib/validations/` (Zod schemas)
- Database migrations in `scripts/`

## Runbook

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build` (includes type-checking)
- Start: `pnpm start`
- Lint: `pnpm lint` (ESLint - code quality & best practices)
- Type check: `pnpm type-check` (TypeScript compiler without emit)
- SEO audit: `pnpm run seo:audit` (comprehensive SEO validation)

**Pre-commit checklist:** Always run `pnpm lint` and `pnpm type-check` before committing code to catch issues early.

## Behavior Rules

- Preferred package manager: **pnpm**; never install libraries without asking
- Server Components by default; `"use client"` only when needed (hooks, events)
- Tailwind CSS only; use `cn()` for conditional classes
- Always validate API input with Zod schemas
- Use SWR for client-side data fetching, never `useEffect`
- Atomic transactions for credit operations (RPC functions)
- Log all errors with Pino logger and request context

## Agent Permissions

- **AGENTS MUST NEVER install dependencies without explicit permission from the user.**
- Do not execute destructive git commands (`git reset --hard`, `git push --force`)
- Ask before running database migrations or modifying `.env` files
- Never bypass Zod validation in API routes
- Never use `any` type - use `unknown` with type guards

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Auth:** Clerk (Google OAuth)
- **AI:** Replicate (GFPGAN model)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Payments:** Stripe
- **Rate Limiting:** Upstash Redis
- **Validation:** Zod
- **Animations:** Framer Motion
- **Logging:** Pino
- **Data Fetching:** SWR

## Code Style & Stack

- See `.cursor/rules/code-style.mdc` for full coding conventions
- See `.cursor/rules/api-patterns.mdc` for API route templates
- See `.cursor/rules/component-patterns.mdc` for React patterns
- Prefer `type` over `interface`; use Zod for runtime validation
- Server Components by default; file naming: `kebab-case.tsx`
- Import order: React/Next → third-party → components → utils → types

## References

- Canonical files: `.cursor/rules/*.mdc` (coding patterns) and `.cursor/agents/*.mdc` (project context)
- For planning requests, refer to this AGENTS.md guide
- Environment setup: see `.env.example` in project root
