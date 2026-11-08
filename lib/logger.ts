import pino, { type DestinationStream, type LoggerOptions } from "pino";

const IS_DEV = process.env.NODE_ENV !== "production";
const IS_WORKER_RUNTIME =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

// pino's numeric levels: 40 is warn, 50 is error, 60 is fatal.
const PINO_WARN_LEVEL = 40;
const PINO_ERROR_LEVEL = 50;
const LEVEL_PATTERN = /"level":(\d+)/;

const OPTIONS: LoggerOptions = {
  level: process.env.LOG_LEVEL || (IS_DEV ? "debug" : "info"),
  // Keep redaction - protects against accidental secret logging, and keeps
  // customer email addresses out of Workers Logs.
  redact: {
    paths: ["password", "token", "apiKey", "secret", "authorization", "cookie", "email", "to"],
    censor: "[REDACTED]",
  },
};

// pino-pretty runs in a worker thread, which the Workers runtime does not offer.
const PRETTY_TRANSPORT: LoggerOptions["transport"] = {
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  },
};

/**
 * Sends pino's JSON lines to the console method that matches their level, so
 * Workers Logs records errors as errors. pino's default destination calls
 * fs.writeSync in a form the Workers runtime rejects, so every log call throws there.
 */
const CONSOLE_DESTINATION: DestinationStream = {
  write(line) {
    const level = Number(LEVEL_PATTERN.exec(line)?.[1] ?? 0);
    const text = line.trimEnd();
    /* eslint-disable no-console -- the one place server logs reach the console */
    if (level >= PINO_ERROR_LEVEL) console.error(text);
    else if (level >= PINO_WARN_LEVEL) console.warn(text);
    else console.log(text);
    /* eslint-enable no-console */
  },
};

function createLogger() {
  if (IS_WORKER_RUNTIME) return pino(OPTIONS, CONSOLE_DESTINATION);
  if (IS_DEV) return pino({ ...OPTIONS, transport: PRETTY_TRANSPORT });
  return pino(OPTIONS);
}

export const logger = createLogger();

export default logger;
