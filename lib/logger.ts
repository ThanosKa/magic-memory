import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
  // Keep redaction - protects against accidental secret logging
  redact: {
    paths: ["password", "token", "apiKey", "secret", "authorization", "cookie"],
    censor: "[REDACTED]",
  },
});

export default logger;

