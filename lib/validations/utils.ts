import { NextResponse } from "next/server";
import type { z, ZodError } from "zod";
import logger from "@/lib/logger";

export async function parseRequestBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<
  { success: true; data: z.infer<T> } | { success: false; error: NextResponse }
> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      logger.warn(
        { errors: parsed.error.flatten() },
        "Request validation failed"
      );
      return {
        success: false,
        error: NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 }
        ),
      };
    }

    return { success: true, data: parsed.data };
  } catch (error) {
    logger.error({ error }, "Failed to parse request body");
    return {
      success: false,
      error: NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }
}

export function createApiResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function createErrorResponse(
  message: string,
  status = 500
): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
}
