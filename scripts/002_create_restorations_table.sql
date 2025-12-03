-- Create restorations table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS restorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  restored_image_url TEXT NOT NULL,
  used_free_credit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_restorations_user_id ON restorations(user_id);
CREATE INDEX IF NOT EXISTS idx_restorations_created_at ON restorations(created_at);

-- Enable Row Level Security
ALTER TABLE restorations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own restorations
CREATE POLICY "Users can read own restorations" ON restorations
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ) OR auth.role() = 'service_role'
  );

-- Policy: Service role can insert restorations
CREATE POLICY "Service role can insert restorations" ON restorations
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Users can delete their own restorations
CREATE POLICY "Users can delete own restorations" ON restorations
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ) OR auth.role() = 'service_role'
  );
