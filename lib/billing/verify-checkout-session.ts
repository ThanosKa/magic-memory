import { z } from "zod";
import type Stripe from "stripe";
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants";

/**
 * The money rules of a Purchase, kept pure: no I/O, no logging, no clock.
 * `verifyCheckoutSession` answers "grant these credits" or "reject for this
 * reason"; the Stripe webhook route does everything else.
 *
 * The metadata keys below (`userId`, `packageType`, `credits`, `priceId`) are a
 * stable contract with checkout sessions opened before a deploy: a session can
 * be paid after a newer build is live, so never rename or require new keys.
 */
const stripeMetadataSchema = z.object({
  userId: z.string().min(1),
  packageType: z.string().min(1),
  credits: z.string().regex(/^\d+$/),
  priceId: z.string().min(1),
});

export type RejectionReason =
  | "invalid_metadata"
  | "missing_payment_id"
  | "unknown_package"
  | "price_mismatch"
  | "amount_mismatch"
  | "wrong_currency";

/** The exact log text per rejection reason; log filters depend on it. */
export const REJECTION_LOG_MESSAGE: Record<RejectionReason, string> = {
  invalid_metadata: "Missing or invalid metadata in checkout session",
  missing_payment_id: "Missing payment intent in checkout session",
  unknown_package: "Unknown package type in checkout session",
  price_mismatch: "Price id mismatch for checkout session",
  amount_mismatch: "Amount mismatch for checkout session",
  wrong_currency: "Unexpected currency for checkout session",
};

export type PurchaseVerdict =
  | {
      ok: true;
      grant: {
        /** `users.id`, not the Clerk id. */
        userId: string;
        stripePaymentId: string;
        /** From `metadata.credits`, not from the Credit pack. */
        credits: number;
        /** After discount. */
        amountPaid: number;
        packageType: PackageType;
        packageName: string;
      };
    }
  | {
      ok: false;
      reason: RejectionReason;
      logContext: Record<string, unknown>;
    };

type PackageTable = Record<
  string,
  { name: string; price: number; priceId: string } | undefined
>;

/**
 * Checks a completed checkout session against the Credit packs, in order:
 * metadata, payment id, known pack, price id, amount (discounts included),
 * currency `eur`. `packages` exists only for tests and defaults to the real
 * Credit packs.
 */
export function verifyCheckoutSession(
  session: Stripe.Checkout.Session,
  packages: PackageTable = CREDIT_PACKAGES,
): PurchaseVerdict {
  const parseResult = stripeMetadataSchema.safeParse(session.metadata || {});

  if (!parseResult.success) {
    return {
      ok: false,
      reason: "invalid_metadata",
      logContext: {
        sessionId: session.id,
        errors: parseResult.error.flatten(),
      },
    };
  }

  const { userId, packageType, credits, priceId } = parseResult.data;
  const paymentIntent = session.payment_intent as string | null;
  const amountTotal = session.amount_total ?? 0;
  const amountDiscount =
    session.total_details?.amount_discount && session.amount_subtotal
      ? session.total_details.amount_discount
      : 0;

  const isFullyDiscounted =
    (session.payment_status === "paid" ||
      session.payment_status === "no_payment_required") &&
    amountTotal === 0;

  const paymentId = paymentIntent ?? (isFullyDiscounted ? session.id : null);

  if (!paymentId) {
    return {
      ok: false,
      reason: "missing_payment_id",
      logContext: { sessionId: session.id },
    };
  }

  const pkg = packages[packageType];

  if (!pkg) {
    return {
      ok: false,
      reason: "unknown_package",
      logContext: { packageType },
    };
  }

  if (!pkg.priceId || pkg.priceId !== priceId) {
    return {
      ok: false,
      reason: "price_mismatch",
      logContext: { packageType, priceId },
    };
  }

  const amountSubtotal = session.amount_subtotal ?? session.amount_total;

  const subtotalMatchesPackage = amountSubtotal === pkg.price;
  const totalWithDiscountMatchesPackage =
    amountSubtotal && amountDiscount
      ? amountTotal + amountDiscount === pkg.price
      : false;

  if (!subtotalMatchesPackage && !totalWithDiscountMatchesPackage) {
    return {
      ok: false,
      reason: "amount_mismatch",
      logContext: {
        packageType,
        expected: pkg.price,
        subtotal: amountSubtotal,
        total: amountTotal,
        discount: amountDiscount,
      },
    };
  }

  if (session.currency?.toLowerCase() !== "eur") {
    return {
      ok: false,
      reason: "wrong_currency",
      logContext: { currency: session.currency, packageType },
    };
  }

  return {
    ok: true,
    grant: {
      userId,
      stripePaymentId: paymentId,
      credits: Number.parseInt(credits, 10),
      amountPaid: amountTotal,
      packageType: packageType as PackageType,
      packageName: pkg.name,
    },
  };
}
