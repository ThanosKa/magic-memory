import Stripe from "stripe";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey, {
    // @ts-expect-error stripe-node types accept only the latest API version, see https://github.com/stripe/stripe-node#using-old-api-versions-with-typescript
    apiVersion: "2025-11-17.clover",
  });
}
