import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { grantPurchaseCredits } from "@/lib/supabase/transactions";
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants";
import { sendPurchaseEmail } from "@/lib/email";
import logger from "@/lib/logger";

const stripeMetadataSchema = z.object({
  userId: z.string().min(1),
  packageType: z.string().min(1),
  credits: z.string().regex(/^\d+$/),
  priceId: z.string().min(1),
});

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey, {
    // @ts-expect-error — pinned to clover until we migrate to dahlia
    apiVersion: "2025-11-17.clover",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    logger.error("Missing Stripe signature header");
    return NextResponse.json(
      { success: false, error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { success: false, error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  try {
    const stripe = getStripeClient();
    // Workers only offer async crypto: the sync constructEvent throws there.
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
    logger.info(
      { eventType: event.type, eventId: event.id },
      "Webhook received"
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const parseResult = stripeMetadataSchema.safeParse(
        session.metadata || {}
      );

      if (!parseResult.success) {
        logger.error(
          { sessionId: session.id, errors: parseResult.error.flatten() },
          "Missing or invalid metadata in checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
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

      const paymentId =
        paymentIntent ?? (isFullyDiscounted ? session.id : null);

      if (!paymentId) {
        logger.error(
          { sessionId: session.id },
          "Missing payment intent in checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const pkg = CREDIT_PACKAGES[packageType as PackageType];

      if (!pkg) {
        logger.error(
          { packageType },
          "Unknown package type in checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      if (!pkg.priceId || pkg.priceId !== priceId) {
        logger.error(
          { packageType, priceId },
          "Price id mismatch for checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const amountSubtotal = session.amount_subtotal ?? session.amount_total;

      const subtotalMatchesPackage = amountSubtotal === pkg.price;
      const totalWithDiscountMatchesPackage =
        amountSubtotal && amountDiscount
          ? amountTotal + amountDiscount === pkg.price
          : false;

      if (!subtotalMatchesPackage && !totalWithDiscountMatchesPackage) {
        logger.error(
          {
            packageType,
            expected: pkg.price,
            subtotal: amountSubtotal,
            total: amountTotal,
            discount: amountDiscount,
          },
          "Amount mismatch for checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      if (session.currency?.toLowerCase() !== "eur") {
        logger.error(
          { currency: session.currency, packageType },
          "Unexpected currency for checkout session"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const creditsToAdd = Number.parseInt(credits, 10);

      logger.info(
        { userId, packageType, credits: creditsToAdd, paymentIntent },
        "Processing successful payment"
      );

      const grant = await grantPurchaseCredits({
        userId,
        stripePaymentId: paymentId,
        credits: creditsToAdd,
        amountPaid: amountTotal,
        packageType,
      });

      if (!grant.ok) {
        logger.error(
          { userId, paymentId, error: grant.error },
          "Failed to grant purchased credits"
        );
        return NextResponse.json(
          { success: false, error: "Failed to grant credits" },
          { status: 500 }
        );
      }

      if (!grant.granted) {
        logger.info(
          { paymentId, userId },
          "Payment already processed, skipping (idempotency)"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      logger.info(
        { userId, creditsAdded: creditsToAdd, packageType },
        "Credits added successfully"
      );

      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
        const customerName = session.customer_details?.name || null;
        sendPurchaseEmail(
          customerEmail,
          customerName,
          pkg.name,
          creditsToAdd,
        ).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, data: { received: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error({ error: message }, "Stripe webhook processing failed");
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
