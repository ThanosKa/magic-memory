import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants"
import logger from "@/lib/logger"
import Stripe from "stripe"

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-11-17.clover",
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    logger.error("Missing Stripe signature header")
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const stripe = getStripeClient()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    logger.info({ eventType: event.type, eventId: event.id }, "Webhook received")
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    logger.error({ error: errorMessage }, "Webhook signature verification failed")
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const { userId, packageType, credits, priceId } = session.metadata || {}
    const paymentIntent = session.payment_intent as string

    if (!userId || !packageType || !credits || !paymentIntent || !priceId) {
      logger.error({ sessionId: session.id }, "Missing metadata in checkout session")
      return NextResponse.json({ received: true })
    }

    const pkg = CREDIT_PACKAGES[packageType as PackageType]

    if (!pkg) {
      logger.error({ packageType }, "Unknown package type in checkout session")
      return NextResponse.json({ received: true })
    }

    if (!pkg.priceId || pkg.priceId !== priceId) {
      logger.error({ packageType, priceId }, "Price id mismatch for checkout session")
      return NextResponse.json({ received: true })
    }

    if (session.amount_total !== pkg.price) {
      logger.error(
        { packageType, expected: pkg.price, actual: session.amount_total },
        "Amount mismatch for checkout session",
      )
      return NextResponse.json({ received: true })
    }

    if (session.currency?.toLowerCase() !== "eur") {
      logger.error({ currency: session.currency, packageType }, "Unexpected currency for checkout session")
      return NextResponse.json({ received: true })
    }

    const creditsToAdd = Number.parseInt(credits, 10)
    const supabase = getSupabaseAdminClient()

    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("stripe_payment_id", paymentIntent)
      .single()

    if (existingPurchase) {
      logger.info({ paymentIntent, userId }, "Payment already processed, skipping (idempotency)")
      return NextResponse.json({ received: true })
    }

    logger.info(
      { userId, packageType, credits: creditsToAdd, paymentIntent },
      "Processing successful payment",
    )

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("paid_credits")
      .eq("id", userId)
      .single()

    if (fetchError) {
      logger.error({ userId, error: fetchError.message }, "Failed to fetch user")
      return NextResponse.json({ received: true })
    }

    const previousCredits = user?.paid_credits ?? 0
    const newCredits = previousCredits + creditsToAdd

    const { error: updateError } = await supabase.from("users").update({ paid_credits: newCredits }).eq("id", userId)

    if (updateError) {
      logger.error({ userId, error: updateError.message }, "Failed to update credits")
      return NextResponse.json({ received: true })
    }

    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      stripe_payment_id: paymentIntent,
      credits_purchased: creditsToAdd,
      amount_paid: session.amount_total ?? 0,
      package_type: packageType,
    })

    if (purchaseError) {
      logger.error({ userId, error: purchaseError.message }, "Failed to record purchase")
    }

    logger.info(
      { userId, previousCredits, newCredits, creditsAdded: creditsToAdd, packageType },
      "Credits added successfully",
    )
  }

  return NextResponse.json({ received: true })
}

