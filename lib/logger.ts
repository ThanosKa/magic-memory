import pino from "pino"

// Create a Pino logger instance with pretty printing in development
const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
  // Redact sensitive fields
  redact: {
    paths: [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
      "cookie",
      "stripe_secret_key",
      "*.password",
      "*.token",
      "*.apiKey",
      "*.secret",
    ],
    censor: "[REDACTED]",
  },
})

// Create child loggers for different parts of the app
export const apiLogger = logger.child({ module: "api" })
export const dbLogger = logger.child({ module: "database" })
export const authLogger = logger.child({ module: "auth" })
export const paymentLogger = logger.child({ module: "payment" })
export const restoreLogger = logger.child({ module: "restore" })
export const redisLogger = logger.child({ module: "redis" })
export const nsfwLogger = logger.child({ module: "nsfw" })
export const storageLogger = logger.child({ module: "storage" })
export const webhookLogger = logger.child({ module: "webhook" })

// Helper to create request context
export function createRequestContext(userId?: string | null, action?: string) {
  return {
    userId: userId || "anonymous",
    action,
    timestamp: new Date().toISOString(),
  }
}

// Helper to log errors with stack traces
export function logError(childLogger: pino.Logger, error: unknown, context: Record<string, unknown> = {}) {
  const errorObj =
    error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : { message: String(error) }

  childLogger.error({ ...context, error: errorObj }, errorObj.message)
}

// Sanitize user data for logging (remove sensitive fields)
export function sanitizeForLog<T extends Record<string, unknown>>(data: T): Partial<T> {
  const sensitiveFields = ["password", "token", "apiKey", "secret", "authorization", "cookie"]
  const sanitized = { ...data }

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      delete sanitized[field]
    }
  }

  return sanitized
}

export default logger
