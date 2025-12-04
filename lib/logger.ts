import { randomUUID } from "crypto";
import pino, { type Logger } from "pino";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
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
});

export type RequestContext = {
  requestId: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
};

export function createRequestContext(
  requestId: string | null,
  action?: string
): RequestContext {
  return {
    requestId: requestId ?? randomUUID(),
    action,
  };
}

export function logError(
  baseLogger: Logger,
  error: unknown,
  context: Record<string, unknown> = {}
): void {
  if (error instanceof Error) {
    baseLogger.error(
      {
        ...context,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      error.message
    );
    return;
  }

  baseLogger.error({ ...context, error }, "Unhandled error");
}

export default logger;
