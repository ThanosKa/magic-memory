import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { webhookLogger, paymentLogger, logError, createRequestContext } from "@/lib/logger"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(request: NextRequest) {
  const ctx = createRequestContext(null, "stripe_webhook")

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    webhookLogger.info({ ...ctx, eventType: event.type, eventId: event.id }, "Webhook received")
  } catch (err) {
    logError(webhookLogger, err, { ...ctx, action: "signature_verification" })
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const { userId, packageType, credits } = session.metadata || {}

    if (!userId || !packageType || !credits) {
      webhookLogger.error({ ...ctx, sessionId: session.id }, "Missing metadata in checkout session")
      return NextResponse.json({ received: true })
    }

    const creditsToAdd = Number.parseInt(credits, 10)
    ctx.userId = userId

    paymentLogger.info(
      { ...ctx, packageType, credits: creditsToAdd, paymentIntent: session.payment_intent },
      "Processing successful payment",
    )

    const supabase = getSupabaseAdminClient()

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("paid_credits")
      .eq("id", userId)
      .single()

    if (fetchError) {
      logError(paymentLogger, fetchError, { ...ctx, action: "fetch_user" })
      return NextResponse.json({ received: true })
    }

    const previousCredits = user?.paid_credits ?? 0
    const newCredits = previousCredits + creditsToAdd

    const { error: updateError } = await supabase.from("users").update({ paid_credits: newCredits }).eq("id", userId)

    if (updateError) {
      logError(paymentLogger, updateError, { ...ctx, action: "update_credits" })
      return NextResponse.json({ received: true })
    }

    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      stripe_payment_id: session.payment_intent as string,
      credits_purchased: creditsToAdd,
      amount_paid: session.amount_total!,
      package_type: packageType,
    })

    if (purchaseError) {
      logError(paymentLogger, purchaseError, { ...ctx, action: "record_purchase" })
    }

    paymentLogger.info(
      { ...ctx, previousCredits, newCredits, creditsAdded: creditsToAdd, packageType },
      "Credits added successfully",
    )
  }

  return NextResponse.json({ received: true })
}
