# API Route Patterns for Cursor

## Standard Response Shape

Always return this shape:

\`\`\`typescript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, error: "Human readable message" }
\`\`\`

## Route Handler Template

\`\`\`typescript
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { logger, createRequestContext } from "@/lib/logger"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const RequestSchema = z.object({
  // Define your schema
})

export async function POST(request: Request) {
  const reqContext = createRequestContext(request)
  const log = logger.child({ ...reqContext, route: "POST /api/your-route" })
  
  try {
    // 1. Auth check
    const { userId } = await auth()
    if (!userId) {
      log.warn("Unauthorized request")
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2. Parse and validate input
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    
    if (!parsed.success) {
      log.warn({ errors: parsed.error.flatten() }, "Validation failed")
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // 3. Business logic
    const supabase = createSupabaseServerClient()
    const result = await supabase
      .from("table")
      .select("*")
      .eq("user_id", userId)

    if (result.error) {
      throw result.error
    }

    // 4. Success response
    log.info({ userId }, "Operation completed successfully")
    return NextResponse.json({
      success: true,
      data: result.data,
    })

  } catch (error) {
    log.error({ error }, "Operation failed")
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
\`\`\`

## Error Handling

- Always wrap in try/catch
- Log errors with context
- Return user-friendly messages (not stack traces)
- Use appropriate HTTP status codes:
  - 400: Bad request / validation error
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not found
  - 500: Internal server error

## Database Operations

- Use Supabase client from `@/lib/supabase/server`
- Always check for errors: `if (result.error) throw result.error`
- Use transactions for multi-step operations
- Log successful operations with relevant IDs
