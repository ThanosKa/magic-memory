import pino, { type DestinationStream, type LoggerOptions } from "pino";

const IS_DEV = process.env.NODE_ENV !== "production";
const IS_WORKER_RUNTIME =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

const ERROR_LEVELS = new Set(["error", "fatal"]);
const LEVEL_PATTERN = /"level":"(\w+)"/;

const OPTIONS: LoggerOptions = {
  level: process.env.LOG_LEVEL || (IS_DEV ? "debug" : "info"),
  redact: {
    paths: ["password", "token", "apiKey", "secret", "authorization", "cookie", "email", "to"],
    censor: "[REDACTED]",
  },
};

const PRETTY_TRANSPORT: LoggerOptions["transport"] = {
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  },
};

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
