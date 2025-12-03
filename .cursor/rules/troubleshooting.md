# Troubleshooting Guide for Cursor

## Common Errors

### "Missing publishableKey" from Clerk
**Cause**: Clerk env vars not set
**Fix**: Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to environment

### "relation does not exist" from Supabase
**Cause**: Database migrations not run
**Fix**: Run all SQL files in `scripts/` folder in order via Supabase SQL Editor

### "No credits available"
**Cause**: User has no free or paid credits
**Fix**: Check Redis for free credit status, check Supabase for paid credits

### Image upload fails
**Cause**: Could be NSFW detection, file size, or Storage permissions
**Fix**: 
1. Check browser console for NSFW warnings
2. Verify file < 10MB
3. Check Supabase Storage bucket policies

### Stripe webhook not working
**Cause**: Webhook secret mismatch or endpoint not configured
**Fix**:
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Ensure webhook endpoint is `/api/stripe/webhook`
3. Check Stripe webhook logs

### Restoration times out
**Cause**: Replicate API taking too long
**Fix**: The API has a 60s timeout. Large images may need longer. Consider:
1. Resizing images before upload
2. Increasing timeout (if self-hosted)

## Debug Logging

Enable debug logs by checking:
1. Browser DevTools Console for client errors
2. Server logs for API errors (Pino logs)
3. Supabase logs for database errors
4. Stripe dashboard for payment errors

## Testing Checklist

- [ ] Auth flow works (sign in/out)
- [ ] Free credit resets at midnight UTC
- [ ] Paid credit purchase works
- [ ] Image upload succeeds
- [ ] NSFW detection blocks inappropriate images
- [ ] Restoration completes successfully
- [ ] Download works with correct filename
- [ ] "Restore Another" clears state properly
\`\`\`

```tsx file="" isHidden
