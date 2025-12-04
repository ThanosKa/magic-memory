import pino from "pino"

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
})

export default logger

