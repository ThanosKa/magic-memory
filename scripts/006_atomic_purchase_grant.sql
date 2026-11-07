-- Atomic, idempotent credit grant for Stripe purchases.
-- Run this in the Supabase SQL Editor BEFORE deploying the webhook that calls it.
--
-- If the unique index below fails, the same payment is already recorded twice.
-- Find those rows, and settle them by hand, with:
--   SELECT stripe_payment_id, COUNT(*) FROM purchases
--   GROUP BY stripe_payment_id HAVING COUNT(*) > 1;

-- A 100% discount checkout is a real purchase with an amount of 0.
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_amount_paid_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_amount_paid_check CHECK (amount_paid >= 0);

-- One payment can be recorded only once. This replaces the plain lookup index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_stripe_payment_id_unique
ON purchases (stripe_payment_id);
DROP INDEX IF EXISTS idx_purchases_stripe_payment_id;

-- Records the purchase and adds the credits together, or does neither.
-- Returns TRUE when credits were added, FALSE when this payment was already granted.
CREATE OR REPLACE FUNCTION grant_purchase_credits(
  p_user_id UUID,
  p_stripe_payment_id TEXT,
  p_credits INTEGER,
  p_amount_paid INTEGER,
  p_package_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  INSERT INTO purchases (user_id, stripe_payment_id, credits_purchased, amount_paid, package_type)
  VALUES (p_user_id, p_stripe_payment_id, p_credits, p_amount_paid, p_package_type)
  ON CONFLICT (stripe_payment_id) DO NOTHING
  RETURNING id INTO v_purchase_id;

  IF v_purchase_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE users
  SET paid_credits = paid_credits + p_credits, updated_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

-- This function hands out credits and runs with its owner's rights, so only the
-- server may call it. Postgres lets everyone execute a new function by default,
-- and the anon key can reach public functions through the Data API.
REVOKE ALL ON FUNCTION grant_purchase_credits(UUID, TEXT, INTEGER, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION grant_purchase_credits(UUID, TEXT, INTEGER, INTEGER, TEXT) TO service_role;
