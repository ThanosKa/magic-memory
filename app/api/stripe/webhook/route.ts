import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger from "@/lib/logger"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    logger.info({ eventType: event.type, eventId: event.id }, "Webhook received")
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    logger.error({ error: errorMessage }, "Webhook signature verification failed")
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const { userId, packageType, credits } = session.metadata || {}
    const paymentIntent = session.payment_intent as string

    if (!userId || !packageType || !credits || !paymentIntent) {
      logger.error({ sessionId: session.id }, "Missing metadata in checkout session")
      return NextResponse.json({ received: true })
    }

    const creditsToAdd = Number.parseInt(credits, 10)
    const supabase = getSupabaseAdminClient()

    // IDEMPOTENCY CHECK: Check if we already processed this payment
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
      amount_paid: session.amount_total!,
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

