import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantPurchaseCredits } from "@/lib/supabase/transactions";
import {
  REJECTION_LOG_MESSAGE,
  verifyCheckoutSession,
} from "@/lib/billing/verify-checkout-session";
import { sendPurchaseEmail } from "@/lib/email";
import logger from "@/lib/logger";

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
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { success: false, error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    const stripe = getStripeClient();
    // Workers only offer async crypto: the sync constructEvent throws there.
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
    logger.info(
      { eventType: event.type, eventId: event.id },
      "Webhook received",
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const verdict = verifyCheckoutSession(session);

      if (!verdict.ok) {
        logger.error(verdict.logContext, REJECTION_LOG_MESSAGE[verdict.reason]);
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const { userId, stripePaymentId, credits, amountPaid, packageType } =
        verdict.grant;
      const paymentId = stripePaymentId;
      const creditsToAdd = credits;

      logger.info(
        {
          userId,
          packageType,
          credits: creditsToAdd,
          paymentIntent: session.payment_intent as string | null,
        },
        "Processing successful payment",
      );

      const grant = await grantPurchaseCredits({
        userId,
        stripePaymentId: paymentId,
        credits: creditsToAdd,
        amountPaid,
        packageType,
      });

      if (!grant.ok) {
        logger.error(
          { userId, paymentId, error: grant.error },
          "Failed to grant purchased credits",
        );
        return NextResponse.json(
          { success: false, error: "Failed to grant credits" },
          { status: 500 },
        );
      }

      if (!grant.granted) {
        logger.info(
          { paymentId, userId },
          "Payment already processed, skipping (idempotency)",
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      logger.info(
        { userId, creditsAdded: creditsToAdd, packageType },
        "Credits added successfully",
      );

      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
        const customerName = session.customer_details?.name || null;
        // Awaited: Workers can cancel work still running after the response.
        await sendPurchaseEmail(
          customerEmail,
          customerName,
          verdict.grant.packageName,
          creditsToAdd,
        );
      }
    }

    return NextResponse.json({ success: true, data: { received: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error({ error: message }, "Stripe webhook processing failed");
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
