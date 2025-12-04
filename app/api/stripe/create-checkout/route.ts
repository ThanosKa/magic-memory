import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger, { logError, createRequestContext } from "@/lib/logger"
import { parseRequestBody } from "@/lib/validations/utils"
import { createCheckoutRequestSchema } from "@/lib/validations/api"
import { CREDIT_PACKAGES } from "@/lib/constants"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
})

export async function POST(request: NextRequest) {
  const ctx = createRequestContext(null, "create_checkout")

  try {
    const { userId } = await auth()
    ctx.userId = userId || "anonymous"

    if (!userId) {
      logger.warn(ctx, "Unauthorized checkout attempt")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const parseResult = await parseRequestBody(request, createCheckoutRequestSchema)
    if (!parseResult.success) {
      logger.warn({ ...ctx, error: "Invalid request body" }, "Validation failed")
      return parseResult.error
    }

    const { packageType } = parseResult.data
    const pkg = CREDIT_PACKAGES[packageType]

    logger.info({ ...ctx, packageType, credits: pkg.credits, price: pkg.price }, "Creating checkout session")

    const supabase = getSupabaseAdminClient()

    const { data: user, error } = await supabase.from("users").select("id, email").eq("clerk_user_id", userId).single()

    if (error || !user) {
      logger.warn({ ...ctx, error }, "User not found for checkout")
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.name} - ${pkg.credits} Credits`,
              description: pkg.description,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/restore?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        clerkUserId: userId,
        packageType,
        credits: pkg.credits.toString(),
      },
    })

    logger.info({ ...ctx, sessionId: session.id, packageType }, "Checkout session created")

    return NextResponse.json({ success: true, url: session.url })
  } catch (error) {
    logError(logger, error, { ...ctx })
    return NextResponse.json({ success: false, error: "Failed to create checkout session" }, { status: 500 })
  }
}
