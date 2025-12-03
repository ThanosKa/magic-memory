import { z } from "zod"

// Environment variable schema for the entire application
const envSchema = z.object({
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),

  // Supabase Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),

  // Stripe Payments
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, "Stripe publishable key is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe webhook secret is required"),

  // Upstash Redis (Rate Limiting)
  UPSTASH_REDIS_REST_URL: z.string().url("Invalid Upstash Redis URL"),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "Upstash Redis token is required"),

  // Replicate API (GFPGAN Model)
  REPLICATE_API_TOKEN: z.string().min(1, "Replicate API token is required"),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables at runtime
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error("Invalid environment variables:")
    console.error(parsed.error.flatten().fieldErrors)

    // In development, we want to see what's missing
    // In production, we should fail fast
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables")
    }

    // Return partial env for development
    return process.env as unknown as Env
  }

  return parsed.data
}

export const env = validateEnv()
