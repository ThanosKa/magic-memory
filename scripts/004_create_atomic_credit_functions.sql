-- Atomic Credit Check and Deduction Functions
-- Run this in your Supabase SQL Editor after the other migrations

-- Function to check if user has available credits (free or paid)
CREATE OR REPLACE FUNCTION check_user_credits(p_user_id UUID)
RETURNS TABLE (
  has_credits BOOLEAN,
  has_free_daily BOOLEAN,
  paid_credits INTEGER,
  should_use_free BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record RECORD;
  v_free_used_today INTEGER;
  v_has_free BOOLEAN;
BEGIN
  -- Get user record
  SELECT * INTO v_user_record FROM users WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, FALSE, 0, FALSE;
    RETURN;
  END IF;
  
  -- Check if free credit used today (UTC)
  SELECT COUNT(*) INTO v_free_used_today
  FROM restorations
  WHERE user_id = p_user_id
    AND used_free_credit = TRUE
    AND created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');
  
  v_has_free := v_free_used_today = 0;
  
  RETURN QUERY SELECT 
    (v_has_free OR v_user_record.paid_credits > 0),
    v_has_free,
    v_user_record.paid_credits,
    v_has_free; -- Priority: use free first
END;
$$;

-- Function to atomically deduct credit and record restoration
CREATE OR REPLACE FUNCTION deduct_credit_and_record_restoration(
  p_user_id UUID,
  p_original_url TEXT,
  p_restored_url TEXT,
  p_use_free_credit BOOLEAN
)
RETURNS TABLE (
  success BOOLEAN,
  restoration_id UUID,
  remaining_paid_credits INTEGER,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record RECORD;
  v_restoration_id UUID;
  v_new_paid_credits INTEGER;
BEGIN
  -- Lock user row for update
  SELECT * INTO v_user_record FROM users WHERE id = p_user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0, 'User not found'::TEXT;
    RETURN;
  END IF;
  
  -- If caller wants to use free credit, verify it's still available (race-safe check)
  IF p_use_free_credit THEN
    DECLARE
      v_free_used_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO v_free_used_count
      FROM restorations
      WHERE user_id = p_user_id
        AND used_free_credit = TRUE
        AND created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');
      
      IF v_free_used_count > 0 THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, v_user_record.paid_credits, 'Free credit already used today'::TEXT;
        RETURN;
      END IF;
    END;
  END IF;
  
  -- Verify paid credits available if not using free
  IF NOT p_use_free_credit AND v_user_record.paid_credits <= 0 THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0, 'No paid credits available'::TEXT;
    RETURN;
  END IF;
  
  -- Insert restoration record
  INSERT INTO restorations (user_id, original_image_url, restored_image_url, used_free_credit)
  VALUES (p_user_id, p_original_url, p_restored_url, p_use_free_credit)
  RETURNING id INTO v_restoration_id;
  
  -- Deduct paid credit if not using free
  IF NOT p_use_free_credit THEN
    UPDATE users 
    SET paid_credits = paid_credits - 1, updated_at = NOW()
    WHERE id = p_user_id
    RETURNING paid_credits INTO v_new_paid_credits;
  ELSE
    v_new_paid_credits := v_user_record.paid_credits;
  END IF;
  
  RETURN QUERY SELECT TRUE, v_restoration_id, v_new_paid_credits, NULL::TEXT;
END;
$$;

-- Function to rollback a restoration (in case of failure after deduction)
CREATE OR REPLACE FUNCTION rollback_restoration(
  p_restoration_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_restoration RECORD;
BEGIN
  -- Get restoration record
  SELECT * INTO v_restoration FROM restorations WHERE id = p_restoration_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If paid credit was used, refund it
  IF NOT v_restoration.used_free_credit THEN
    UPDATE users 
    SET paid_credits = paid_credits + 1, updated_at = NOW()
    WHERE id = v_restoration.user_id;
  END IF;
  
  -- Delete the restoration record
  DELETE FROM restorations WHERE id = p_restoration_id;
  
  RETURN TRUE;
END;
$$;

-- Create partial unique index to enforce one free credit per user per day
-- This is a database-level constraint that makes it impossible to insert two free credits on the same day
-- The index only applies to rows where used_free_credit = TRUE and created_at is today (UTC)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_free_credit_per_user_per_day
ON restorations (user_id, (DATE_TRUNC('day', created_at AT TIME ZONE 'UTC')))
WHERE used_free_credit = TRUE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_user_credits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_credits(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION deduct_credit_and_record_restoration(UUID, TEXT, TEXT, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION rollback_restoration(UUID) TO service_role;
