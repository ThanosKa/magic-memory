import { type NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const clerkWebhookSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("user.created"),
        data: z.object({
            id: z.string(),
            email_addresses: z.array(
                z.object({ email_address: z.string().email() })
            ),
            first_name: z.string().nullable(),
            last_name: z.string().nullable(),
            image_url: z.string().url().nullable(),
        }),
    }),
    z.object({
        type: z.literal("user.updated"),
        data: z.object({
            id: z.string(),
            email_addresses: z.array(
                z.object({ email_address: z.string().email() })
            ),
            first_name: z.string().nullable(),
            last_name: z.string().nullable(),
            image_url: z.string().url().nullable(),
        }),
    }),
    z.object({
        type: z.literal("user.deleted"),
        data: z.object({
            id: z.string(),
        }),
    }),
]);

export async function POST(request: NextRequest) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
        logger.error("CLERK_WEBHOOK_SECRET is not configured");
        return NextResponse.json(
            { success: false, error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        logger.warn("Missing svix headers in Clerk webhook");
        return NextResponse.json(
            { success: false, error: "Missing svix headers" },
            { status: 400 }
        );
    }

    const body = await request.text();

    try {
        const webhook = new Webhook(webhookSecret);
        const rawEvent = webhook.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        });

        const parsedEvent = clerkWebhookSchema.safeParse(rawEvent);

        if (!parsedEvent.success) {
            logger.error(
                { errors: parsedEvent.error.flatten() },
                "Invalid Clerk webhook payload"
            );
            return NextResponse.json(
                { success: false, error: "Invalid payload" },
                { status: 400 }
            );
        }

        const event = parsedEvent.data;
        logger.info({ eventType: event.type, userId: event.data.id }, "Clerk webhook received");

        const supabase = getSupabaseAdminClient();

        switch (event.type) {
            case "user.created": {
                const { id, email_addresses, first_name, last_name, image_url } = event.data;
                const email = email_addresses[0]?.email_address || "";
                const name = [first_name, last_name].filter(Boolean).join(" ") || null;

                const { error } = await supabase.from("users").insert({
                    clerk_user_id: id,
                    email,
                    name,
                    profile_image: image_url,
                    paid_credits: 0,
                });

                if (error) {
                    // Duplicate key errors are expected when webhooks are retried
                    // This is idempotent behavior - the user already exists, so we treat it as success
                    if (error.code === '23505' || error.message.includes('duplicate key')) {
                        logger.info({ userId: id, email }, "User already exists in database (duplicate webhook)");
                        break;
                    }

                    // For other errors, return 500 so Clerk retries
                    logger.error({ error: error.message, userId: id }, "Failed to create user in database");
                    return NextResponse.json(
                        { success: false, error: "Failed to create user" },
                        { status: 500 }
                    );
                }

                logger.info({ userId: id, email }, "User created in database");
                break;
            }

            case "user.updated": {
                const { id, email_addresses, first_name, last_name, image_url } = event.data;
                const email = email_addresses[0]?.email_address || "";
                const name = [first_name, last_name].filter(Boolean).join(" ") || null;

                const { error } = await supabase
                    .from("users")
                    .update({
                        email,
                        name,
                        profile_image: image_url,
                    })
                    .eq("clerk_user_id", id);

                if (error) {
                    logger.error({ error: error.message, userId: id }, "Failed to update user in database");
                    return NextResponse.json(
                        { success: false, error: "Failed to update user" },
                        { status: 500 }
                    );
                }

                logger.info({ userId: id }, "User updated in database");
                break;
            }

            case "user.deleted": {
                const { id } = event.data;

                const { error } = await supabase.from("users").delete().eq("clerk_user_id", id);

                if (error) {
                    logger.error({ error: error.message, userId: id }, "Failed to delete user from database");
                    return NextResponse.json(
                        { success: false, error: "Failed to delete user" },
                        { status: 500 }
                    );
                }

                logger.info({ userId: id }, "User deleted from database (cascade will remove restorations)");
                break;
            }

            default:
                logger.warn({ eventType: (event as { type: string }).type }, "Unhandled webhook event type");
        }

        return NextResponse.json({ success: true, data: { received: true } });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        logger.error({ error: errorMessage }, "Clerk webhook processing failed");
        return NextResponse.json(
            { success: false, error: "Webhook processing failed" },
            { status: 400 }
        );
    }
}