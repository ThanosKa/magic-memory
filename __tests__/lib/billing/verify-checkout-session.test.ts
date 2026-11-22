import { describe, it, expect } from "vitest";
import type Stripe from "stripe";
import {
  checkoutMetadata,
  REJECTION_LOG_MESSAGE,
  verifyCheckoutSession,
} from "@/lib/billing/verify-checkout-session";

const PACKAGES = {
  starter: { name: "Starter", credits: 20, price: 1000, priceId: "price_starter" },
  empty: { name: "Empty", credits: 5, price: 500, priceId: "" },
};

function session(overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_1",
    payment_intent: "pi_1",
    payment_status: "paid",
    amount_total: 1000,
    amount_subtotal: 1000,
    total_details: { amount_discount: 0 },
    currency: "eur",
    metadata: {
      userId: "user-uuid",
      packageType: "starter",
      credits: "20",
      priceId: "price_starter",
    },
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

describe("verifyCheckoutSession", () => {
  it("grants a normal Purchase, taking credits from metadata", () => {
    const verdict = verifyCheckoutSession({ session: session({
        metadata: {
          userId: "user-uuid",
          packageType: "starter",
          credits: "25",
          priceId: "price_starter",
        },
      }), packages: PACKAGES });

    expect(verdict).toEqual({
      ok: true,
      grant: {
        userId: "user-uuid",
        stripePaymentId: "pi_1",
        credits: 25,
        amountPaid: 1000,
        packageType: "starter",
        packageName: "Starter",
      },
      creditsMismatch: { metadataCredits: 25, packCredits: 20 },
    });
  });

  it("reports no credits mismatch when metadata matches the Credit pack", () => {
    const verdict = verifyCheckoutSession({ session: session(), packages: PACKAGES });

    expect(verdict.ok).toBe(true);
    expect(verdict.ok && verdict.creditsMismatch).toBeUndefined();
  });

  it("grants a discounted Purchase and records the amount after discount", () => {
    const verdict = verifyCheckoutSession({ session: session({
        amount_total: 800,
        total_details: { amount_discount: 200 },
      }), packages: PACKAGES });

    expect(verdict).toMatchObject({ ok: true, grant: { amountPaid: 800 } });
  });

  it("grants a 100% discount using the session id as payment id", () => {
    const verdict = verifyCheckoutSession({ session: session({
        payment_intent: null,
        payment_status: "no_payment_required",
        amount_total: 0,
        total_details: { amount_discount: 1000 },
      }), packages: PACKAGES });

    expect(verdict).toMatchObject({
      ok: true,
      grant: { stripePaymentId: "cs_1", amountPaid: 0 },
    });
  });

  it("only counts a discount when a subtotal is present", () => {
    const verdict = verifyCheckoutSession({ session: session({
        amount_total: 800,
        amount_subtotal: null,
        total_details: { amount_discount: 200 },
      }), packages: PACKAGES });

    expect(verdict).toMatchObject({ ok: false, reason: "amount_mismatch" });
  });

  it("rejects invalid metadata", () => {
    const verdict = verifyCheckoutSession({ session: session({ metadata: { userId: "u", credits: "abc" } }), packages: PACKAGES });

    expect(verdict).toMatchObject({
      ok: false,
      reason: "invalid_metadata",
      logContext: { sessionId: "cs_1" },
    });
    expect(
      (verdict as { logContext: Record<string, unknown> }).logContext,
    ).toHaveProperty("errors");
  });

  it("rejects a missing payment id", () => {
    const verdict = verifyCheckoutSession({ session: session({ payment_intent: null, amount_total: 1000 }), packages: PACKAGES });

    expect(verdict).toEqual({
      ok: false,
      reason: "missing_payment_id",
      logContext: { sessionId: "cs_1" },
    });
  });

  it("rejects an unknown package", () => {
    const verdict = verifyCheckoutSession({ session: session({
        metadata: {
          userId: "u",
          packageType: "gold",
          credits: "1",
          priceId: "p",
        },
      }), packages: PACKAGES });

    expect(verdict).toEqual({
      ok: false,
      reason: "unknown_package",
      logContext: { packageType: "gold" },
    });
  });

  it("rejects a price id mismatch, and a pack with no price id", () => {
    const wrong = verifyCheckoutSession({ session: session({
        metadata: {
          userId: "u",
          packageType: "starter",
          credits: "1",
          priceId: "price_other",
        },
      }), packages: PACKAGES });
    const unset = verifyCheckoutSession({ session: session({
        metadata: {
          userId: "u",
          packageType: "empty",
          credits: "1",
          priceId: "x",
        },
      }), packages: PACKAGES });

    expect(wrong).toEqual({
      ok: false,
      reason: "price_mismatch",
      logContext: { packageType: "starter", priceId: "price_other" },
    });
    expect(unset).toMatchObject({ ok: false, reason: "price_mismatch" });
  });

  it("rejects an amount mismatch with the amounts in the log context", () => {
    const verdict = verifyCheckoutSession({ session: session({ amount_total: 900, amount_subtotal: 900 }), packages: PACKAGES });

    expect(verdict).toEqual({
      ok: false,
      reason: "amount_mismatch",
      logContext: {
        packageType: "starter",
        expected: 1000,
        subtotal: 900,
        total: 900,
        discount: 0,
      },
    });
  });

  it("rejects a currency other than eur", () => {
    const verdict = verifyCheckoutSession({ session: session({ currency: "usd" }), packages: PACKAGES });

    expect(verdict).toEqual({
      ok: false,
      reason: "wrong_currency",
      logContext: { currency: "usd", packageType: "starter" },
    });
  });

  it("accepts the currency in upper case", () => {
    expect(
      verifyCheckoutSession({ session: session({ currency: "EUR" }), packages: PACKAGES }).ok,
    ).toBe(true);
  });

  it("keeps today's log text for every reason", () => {
    expect(REJECTION_LOG_MESSAGE).toEqual({
      invalid_metadata: "Missing or invalid metadata in checkout session",
      missing_payment_id: "Missing payment intent in checkout session",
      unknown_package: "Unknown package type in checkout session",
      price_mismatch: "Price id mismatch for checkout session",
      amount_mismatch: "Amount mismatch for checkout session",
      wrong_currency: "Unexpected currency for checkout session",
    });
  });
});

describe("checkoutMetadata", () => {
  it("builds exactly the keys and string values checkout sessions carry", () => {
    expect(
      checkoutMetadata({
        userId: "user-uuid",
        clerkUserId: "user_clerk",
        packageType: "starter",
        credits: 25,
        priceId: "price_starter",
      }),
    ).toEqual({
      userId: "user-uuid",
      clerkUserId: "user_clerk",
      packageType: "starter",
      credits: "25",
      priceId: "price_starter",
    });
  });

  it("produces metadata that verifyCheckoutSession reads back", () => {
    const metadata = checkoutMetadata({
      userId: "user-uuid",
      clerkUserId: "user_clerk",
      packageType: "starter",
      credits: 20,
      priceId: "price_starter",
    });

    const verdict = verifyCheckoutSession({ session: session({ metadata }), packages: PACKAGES });

    expect(verdict.ok).toBe(true);
  });
});
