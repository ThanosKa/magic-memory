-- Only the server may call the credit functions from 004.
-- They run with their owner's rights, Postgres lets everyone execute a new function
-- by default, and the anon key can reach public functions through the Data API.
-- The app calls them through the service role, so its behaviour does not change.
-- Safe to run before or after deploying the matching code.

REVOKE ALL ON FUNCTION check_user_credits(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION deduct_credit_and_record_restoration(UUID, TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION rollback_restoration(UUID) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION check_user_credits(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION deduct_credit_and_record_restoration(UUID, TEXT, TEXT, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION rollback_restoration(UUID) TO service_role;
