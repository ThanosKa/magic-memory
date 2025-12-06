import { type NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import logger from "@/lib/logger"

type ClerkWebhookEvent =
    | {
        type: "user.created"
        data: {
            id: string
            email_addresses: { email_address: string }[]
            first_name: string | null
            last_name: string | null
            image_url: string | null
        }
    }
    | {
        type: "user.updated"
        data: {
            id: string
            email_addresses: { email_address: string }[]
            first_name: string | null
            last_name: string | null
            image_url: string | null
        }
    }
    | {
        type: "user.deleted"
        data: {
            id: string
        }
    }

export async function POST(request: NextRequest) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

    if (!webhookSecret) {
        logger.error("CLERK_WEBHOOK_SECRET is not configured")
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const svixId = request.headers.get("svix-id")
    const svixTimestamp = request.headers.get("svix-timestamp")
    const svixSignature = request.headers.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
        logger.warn("Missing svix headers in Clerk webhook")
        return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
    }

    const body = await request.text()

    const webhook = new Webhook(webhookSecret)
    let event: ClerkWebhookEvent

    try {
        event = webhook.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as ClerkWebhookEvent

        logger.info({ eventType: event.type, userId: event.data.id }, "Clerk webhook received")
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        logger.error({ error: errorMessage }, "Webhook signature verification failed")
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    switch (event.type) {
        case "user.created": {
            const { id, email_addresses, first_name, last_name, image_url } = event.data
            const email = email_addresses[0]?.email_address || ""
            const name = [first_name, last_name].filter(Boolean).join(" ") || null

            const { error } = await supabase.from("users").insert({
                clerk_user_id: id,
                email,
                name,
                profile_image: image_url,
                paid_credits: 0,
            })

            if (error) {
                logger.error({ error: error.message, userId: id }, "Failed to create user in database")
                return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
            }

            logger.info({ userId: id, email }, "User created in database")
            break
        }

        case "user.updated": {
            const { id, email_addresses, first_name, last_name, image_url } = event.data
            const email = email_addresses[0]?.email_address || ""
            const name = [first_name, last_name].filter(Boolean).join(" ") || null

            const { error } = await supabase
                .from("users")
                .update({
                    email,
                    name,
                    profile_image: image_url,
                })
                .eq("clerk_user_id", id)

            if (error) {
                logger.error({ error: error.message, userId: id }, "Failed to update user in database")
                return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
            }

            logger.info({ userId: id }, "User updated in database")
            break
        }

        case "user.deleted": {
            const { id } = event.data

            const { error } = await supabase.from("users").delete().eq("clerk_user_id", id)

            if (error) {
                logger.error({ error: error.message, userId: id }, "Failed to delete user from database")
                return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
            }

            logger.info({ userId: id }, "User deleted from database (cascade will remove restorations)")
            break
        }

        default:
            logger.warn({ eventType: (event as { type: string }).type }, "Unhandled webhook event type")
    }

    return NextResponse.json({ received: true })
}
