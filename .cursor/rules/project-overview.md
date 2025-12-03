# RestorePhotos Project Overview for Cursor

## What is RestorePhotos?

An AI-powered SaaS that restores old, blurry, or damaged photos using the GFPGAN model via Replicate API.

## Business Logic

### Credit System
- **Free**: 1 restoration/day, resets at midnight UTC (stored in Redis with TTL)
- **Paid**: 100/$9, 350/$19, 1000/$29 (stored in Supabase, never expire)
- **Priority**: Use free first, then paid
- **No credits = No service**

### User Flow
1. User signs in with Google (Clerk)
2. User uploads old photo
3. Client-side NSFW check (nsfwjs)
4. Upload to Supabase Storage
5. Call Replicate GFPGAN model
6. Store restored image in Supabase Storage
7. Deduct credit (atomic transaction)
8. User downloads restored photo

## Key Technical Decisions

1. **No ORM** - Direct Supabase client queries
2. **Atomic transactions** - RPC functions for credit operations
3. **Client-side NSFW** - Faster UX, less server load
4. **Redis for free credits** - TTL handles daily reset automatically
5. **Signed URLs** - Secure image access

## Environment Variables Required

See `.env.example` for full list. Key ones:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `REPLICATE_API_TOKEN`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`

## Common Development Tasks

### Add a new API endpoint
See `.cursor/rules/api-patterns.md`

### Add a new component
See `.cursor/rules/component-patterns.md`

### Modify database
1. Create new migration in `scripts/`
2. Run in Supabase SQL Editor
3. Update Zod schemas in `lib/validations/`

### Add environment variable
1. Add to `.env.example`
2. Add to `lib/env.ts` Zod schema
3. Use via `import { env } from "@/lib/env"`
