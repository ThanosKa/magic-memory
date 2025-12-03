-- Create purchases table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL,
  credits_purchased INTEGER NOT NULL CHECK (credits_purchased > 0),
  amount_paid INTEGER NOT NULL CHECK (amount_paid > 0), -- in cents
  package_type TEXT NOT NULL CHECK (package_type IN ('starter', 'growth', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_id ON purchases(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- Enable Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own purchases
CREATE POLICY "Users can read own purchases" ON purchases
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
    ) OR auth.role() = 'service_role'
  );

-- Policy: Service role can insert purchases
CREATE POLICY "Service role can insert purchases" ON purchases
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
