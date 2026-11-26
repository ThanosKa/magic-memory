import type { Breadcrumb, ErrorEvent, RequestEventData } from "@sentry/browser";

export const ERROR_TRACKING_DSN =
  "https://iNn8pNwEghfUd47ScobNtEGu@s2852091.us-west-2a.betterstackdata.com/2852091";

const KEPT_REQUEST_HEADERS = ["user-agent"];

const REDACTIONS: [RegExp, string][] = [
  [/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[email]"],
  [/\b(Bearer|Basic)\s+[\w.~+/=-]+/gi, "$1 [token]"],
  [/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, "[token]"],
  [/\b(sk|pk|rk|whsec|sess|user)_[\w]{8,}/g, "[token]"],
  [/(https?:\/\/[^\s?#"']+|\/[^\s?#"']*)\?[^\s#"']*/g, "$1"],
];

type ErrorTrackingEnv = {
  environment: string | undefined;
  release: string | undefined;
  sendInDevelopment: string | undefined;
};

function readErrorTrackingEnv(): ErrorTrackingEnv {
  return {
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    sendInDevelopment: process.env.NEXT_PUBLIC_SENTRY_SEND_IN_DEV,
  };
}

export function redactText(text: string): string {
  return REDACTIONS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

function redactOptional(text: string | undefined): string | undefined {
  return text === undefined ? undefined : redactText(text);
}

function scrubRequest(request: RequestEventData): RequestEventData {
  const headers = Object.fromEntries(
    Object.entries(request.headers ?? {}).filter(([name]) => KEPT_REQUEST_HEADERS.includes(name.toLowerCase())),
  );
  return { method: request.method, url: redactOptional(request.url), headers };
}

function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  const data = breadcrumb.data
    ? Object.fromEntries(
        Object.entries(breadcrumb.data).map(([key, value]) => [key, typeof value === "string" ? redactText(value) : value]),
      )
    : undefined;
  return { ...breadcrumb, message: redactOptional(breadcrumb.message), data };
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  return {
    ...event,
    user: undefined,
    message: redactOptional(event.message),
    request: event.request ? scrubRequest(event.request) : undefined,
    breadcrumbs: event.breadcrumbs?.map(scrubBreadcrumb),
    exception: event.exception && {
      ...event.exception,
      values: event.exception.values?.map((exception) => ({ ...exception, value: redactOptional(exception.value) })),
    },
  };
}

export function getErrorTrackingOptions({
  environment,
  release,
  sendInDevelopment,
}: ErrorTrackingEnv = readErrorTrackingEnv()) {
  const isProduction = environment === "production";
  return {
    dsn: ERROR_TRACKING_DSN,
    enabled: isProduction || sendInDevelopment === "true",
    environment: isProduction ? "production" : "development",
    release: release || undefined,
    tracesSampleRate: 0,
    tracePropagationTargets: [],
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { allow: KEPT_REQUEST_HEADERS },
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
      databaseQueryData: false,
      queues: false,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      mcp: { inputs: false, outputs: false },
    },
    beforeSend: scrubEvent,
  };
}
