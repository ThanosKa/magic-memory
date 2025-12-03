# AI Agent Guidelines for RestorePhotos

This document provides guidance for AI coding assistants (Claude, GPT, Cursor, Copilot, etc.) working on the RestorePhotos codebase.

## Quick Context

RestorePhotos is an AI-powered SaaS that restores old photos using GFPGAN. Users get 1 free restoration/day and can purchase credit packages.

## Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Next.js 15 App Router + React + Tailwind + Framer Motion   │
├─────────────────────────────────────────────────────────────┤
│                     API Layer (Route Handlers)               │
│  /api/credits | /api/upload | /api/restore | /api/stripe    │
├─────────────────────────────────────────────────────────────┤
│                      External Services                       │
│  Clerk (Auth) | Supabase (DB+Storage) | Replicate (AI)      │
│  Stripe (Payments) | Upstash Redis (Rate Limiting)          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Files to Understand First

1. **`lib/constants.ts`** - Credit packages, pricing, app config
2. **`lib/env.ts`** - Environment variable validation (Zod)
3. **`lib/validations/`** - All Zod schemas for API/DB
4. **`lib/supabase/`** - Database client setup
5. **`middleware.ts`** - Auth protection logic

## Coding Standards

### TypeScript
- Strict mode enabled
- Prefer `type` over `interface` for object shapes
- Use Zod for runtime validation, infer types from schemas
- No `any` - use `unknown` and narrow

### React/Next.js
- Server Components by default, `"use client"` only when needed
- Use `useSWR` for data fetching in client components
- Colocate components with pages when page-specific
- Extract reusable components to `components/`

### Styling
- Tailwind CSS only, no inline styles
- Use `cn()` helper for conditional classes
- Follow design tokens in `globals.css`
- Framer Motion for animations

### API Routes
- Always validate input with Zod
- Use `createRequestContext()` from logger for request tracing
- Return consistent response shape: `{ success, data?, error? }`
- Handle errors gracefully, log with Pino

### Database
- Use Supabase client, not raw SQL in app code
- Migrations go in `scripts/` folder
- RLS policies required for all tables
- Use atomic transactions for credit operations

## Common Tasks

### Adding a New API Endpoint

\`\`\`typescript
// app/api/example/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { logger } from "@/lib/logger"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const RequestSchema = z.object({
  field: z.string().min(1),
})

export async function POST(request: Request) {
  const log = logger.child({ route: "POST /api/example" })
  
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    // ... database operations

    log.info({ userId }, "Operation completed")
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    log.error({ error }, "Operation failed")
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}
\`\`\`

### Adding a New Component

\`\`\`tsx
// components/feature/my-component.tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-6"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </motion.div>
  )
}
\`\`\`

### Modifying Credits Logic

The credit system uses Redis for free credits (with TTL) and Supabase for paid credits:

1. **Free credits**: `lib/redis.ts` - `hasFreeCredit()`, `useFreeCredit()`
2. **Paid credits**: `lib/supabase/transactions.ts` - Atomic operations
3. **Credit check**: `app/api/credits/route.ts` - Combines both

## Don'ts

- Don't bypass Zod validation
- Don't use `any` type
- Don't make database calls without error handling
- Don't forget to log errors with context
- Don't skip RLS policies on new tables
- Don't use `useEffect` for data fetching (use SWR)
- Don't add new env vars without updating `lib/env.ts`

## File Naming

- Components: `kebab-case.tsx` (e.g., `restore-uploader.tsx`)
- Utils: `kebab-case.ts` (e.g., `nsfw-detection.ts`)
- API routes: `route.ts` inside folder
- Types: Colocate or in `types/` folder

## Testing Locally

\`\`\`bash
# Check types
pnpm type-check

# Lint
pnpm lint

# Dev server
pnpm dev
\`\`\`

## Related Documentation

- [.cursor/rules/](.cursor/rules/) - IDE-specific rules
- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
