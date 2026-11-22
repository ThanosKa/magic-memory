import { z } from "zod";
import type Stripe from "stripe";
import { CREDIT_PACKAGES } from "@/lib/constants";

const stripeMetadataSchema = z.object({
  userId: z.string().min(1),
  packageType: z.string().min(1),
  credits: z.string().regex(/^\d+$/),
  priceId: z.string().min(1),
});

export function checkoutMetadata(input: {
  userId: string;
  clerkUserId: string;
  packageType: string;
  credits: number;
  priceId: string;
}) {
  return {
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    packageType: input.packageType,
    credits: input.credits.toString(),
    priceId: input.priceId,
  };
}

export type RejectionReason =
  | "invalid_metadata"
  | "missing_payment_id"
  | "unknown_package"
  | "price_mismatch"
  | "amount_mismatch"
  | "wrong_currency";

export const CREDITS_MISMATCH_LOG_MESSAGE =
  "Purchased credits differ from Credit pack";

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
        userId: string;
        stripePaymentId: string;
        credits: number;
        amountPaid: number;
        packageType: string;
        packageName: string;
      };
      creditsMismatch?: { metadataCredits: number; packCredits: number };
    }
  | {
      ok: false;
      reason: RejectionReason;
      logContext: Record<string, unknown>;
    };

type PackageTable = Record<
  string,
  { name: string; credits: number; price: number; priceId: string } | undefined
>;

export function verifyCheckoutSession({
  session,
  packages = CREDIT_PACKAGES,
}: {
  session: Stripe.Checkout.Session;
  packages?: PackageTable;
}): PurchaseVerdict {
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
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : null;
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

  const metadataCredits = Number.parseInt(credits, 10);

  return {
    ok: true,
    grant: {
      userId,
      stripePaymentId: paymentId,
      credits: metadataCredits,
      amountPaid: amountTotal,
      packageType,
      packageName: pkg.name,
    },
    ...(metadataCredits !== pkg.credits && {
      creditsMismatch: { metadataCredits, packCredits: pkg.credits },
    }),
  };
}
