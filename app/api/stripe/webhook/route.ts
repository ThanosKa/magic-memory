import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants";
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
    const event = stripe.webhooks.constructEvent(
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

      if (!paymentIntent) {
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
      const amountTotal = session.amount_total ?? 0;
      const amountDiscount =
        session.total_details?.amount_discount && amountSubtotal
          ? session.total_details.amount_discount
          : 0;

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
      const supabase = getSupabaseAdminClient();

      const { data: existingPurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("stripe_payment_id", paymentIntent)
        .single();

      if (existingPurchase) {
        logger.info(
          { paymentIntent, userId },
          "Payment already processed, skipping (idempotency)"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      logger.info(
        { userId, packageType, credits: creditsToAdd, paymentIntent },
        "Processing successful payment"
      );

      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("paid_credits")
        .eq("id", userId)
        .single();

      if (fetchError) {
        logger.error(
          { userId, error: fetchError.message },
          "Failed to fetch user"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const previousCredits = user?.paid_credits ?? 0;
      const newCredits = previousCredits + creditsToAdd;

      const { error: updateError } = await supabase
        .from("users")
        .update({ paid_credits: newCredits })
        .eq("id", userId);

      if (updateError) {
        logger.error(
          { userId, error: updateError.message },
          "Failed to update credits"
        );
        return NextResponse.json({ success: true, data: { received: true } });
      }

      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: userId,
        stripe_payment_id: paymentIntent,
        credits_purchased: creditsToAdd,
        amount_paid: session.amount_total ?? 0,
        package_type: packageType,
      });

      if (purchaseError) {
        logger.error(
          { userId, error: purchaseError.message },
          "Failed to record purchase"
        );
      }

      logger.info(
        {
          userId,
          previousCredits,
          newCredits,
          creditsAdded: creditsToAdd,
          packageType,
        },
        "Credits added successfully"
      );
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
