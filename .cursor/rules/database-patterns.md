# Database Patterns for Cursor

## Supabase Client Usage

### Server-side (API routes, Server Components)

\`\`\`typescript
import { createSupabaseServerClient } from "@/lib/supabase/server"

const supabase = createSupabaseServerClient()

// Query
const { data, error } = await supabase
  .from("users")
  .select("id, email, paid_credits")
  .eq("clerk_user_id", userId)
  .single()

// Insert
const { data, error } = await supabase
  .from("restorations")
  .insert({
    user_id: dbUser.id,
    original_image_url: imageUrl,
    restored_image_url: restoredUrl,
    used_free_credit: true,
  })
  .select()
  .single()

// Update
const { error } = await supabase
  .from("users")
  .update({ paid_credits: newCredits })
  .eq("id", userId)
\`\`\`

### Client-side (rare, prefer server)

\`\`\`typescript
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const supabase = createSupabaseBrowserClient()
// Same query patterns
\`\`\`

## Atomic Credit Operations

For credit operations, use the RPC functions:

\`\`\`typescript
// Check credits
const { data } = await supabase.rpc("check_user_credits", {
  p_user_id: dbUser.id,
})

// Deduct credit and record restoration
const { data, error } = await supabase.rpc("deduct_credit_and_record_restoration", {
  p_user_id: dbUser.id,
  p_use_free: useFreeCredit,
  p_original_url: originalUrl,
  p_restored_url: restoredUrl,
})

// Rollback on failure
await supabase.rpc("rollback_restoration", {
  p_restoration_id: restorationId,
  p_user_id: dbUser.id,
  p_was_free: wasFreeCredit,
})
\`\`\`

## Migration Files

Place in `scripts/` folder with numbered prefixes:

\`\`\`
scripts/
├── 001_create_users_table.sql
├── 002_create_restorations_table.sql
├── 003_create_purchases_table.sql
├── 004_create_storage_bucket.sql
└── 005_create_atomic_credit_functions.sql
\`\`\`

Run manually in Supabase SQL Editor (in order).

## RLS Policies

Always add RLS policies for new tables:

\`\`\`sql
-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data"
  ON your_table FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- Service role can do anything
CREATE POLICY "Service role full access"
  ON your_table FOR ALL
  USING (auth.role() = 'service_role');
