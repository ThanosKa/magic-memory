import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import logger from "@/lib/logger";

const vitalsPayloadSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  id: z.string().min(1),
  path: z.string().min(1),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  navigationType: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = vitalsPayloadSchema.safeParse(json);

    if (!parsed.success) {
      logger.warn(
        { errors: parsed.error.flatten() },
        "Invalid web vitals payload"
      );
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    logger.info({
      type: "web-vitals",
      metric: payload.name,
      value: Math.round(payload.value),
      rating: payload.rating,
      path: payload.path,
      id: payload.id,
      navigationType: payload.navigationType,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error({ error, message: "Failed to process web vitals" });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ success: true }, { status: 200 });
}
