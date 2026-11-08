import pino, { type DestinationStream, type LoggerOptions } from "pino";

const IS_DEV = process.env.NODE_ENV !== "production";
const IS_WORKER_RUNTIME =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

const ERROR_LEVELS = new Set(["error", "fatal"]);
const LEVEL_PATTERN = /"level":"(\w+)"/;

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
    const level = LEVEL_PATTERN.exec(line)?.[1] ?? "info";
    const text = line.trimEnd();
    /* eslint-disable no-console -- the one place server logs reach the console */
    if (ERROR_LEVELS.has(level)) console.error(text);
    else if (level === "warn") console.warn(text);
    else console.log(text);
    /* eslint-enable no-console */
  },
};

// Workers Logs takes a JSON line's own "level" field as the log level, so it
// must be the label ("error"), not pino's number (50).
const WORKER_OPTIONS: LoggerOptions = {
  ...OPTIONS,
  formatters: { level: (label) => ({ level: label }) },
};

function createLogger() {
  if (IS_WORKER_RUNTIME) return pino(WORKER_OPTIONS, CONSOLE_DESTINATION);
  if (IS_DEV) return pino({ ...OPTIONS, transport: PRETTY_TRANSPORT });
  return pino(OPTIONS);
}

export const logger = createLogger();

export default logger;
