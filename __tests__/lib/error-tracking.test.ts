import { afterEach, describe, expect, it, vi } from "vitest"
import { captureException, close, flush, init } from "@sentry/browser"

import { onRequestError } from "@/instrumentation"
import { ERROR_TRACKING_DSN, getErrorTrackingOptions, scrubEvent } from "@/lib/error-tracking"

function startSdk(options: ReturnType<typeof getErrorTrackingOptions>) {
  const sent: string[] = []
  init({
    ...options,
    defaultIntegrations: false,
    transport: () => ({
      send: async (envelope) => {
        sent.push(JSON.stringify(envelope))
        return {}
      },
      flush: async () => true,
    }),
  })
  return sent
}

const LOCAL = { environment: undefined, release: undefined, sendInDevelopment: undefined }

afterEach(async () => {
  await close()
  vi.unstubAllEnvs()
})

describe("getErrorTrackingOptions", () => {
  it("reports as production only when the deploy sets the production environment", () => {
    expect(getErrorTrackingOptions({ ...LOCAL, environment: "production", release: "abc123" })).toMatchObject({
      dsn: ERROR_TRACKING_DSN,
      enabled: true,
      environment: "production",
      release: "abc123",
      tracesSampleRate: 0,
    })
  })

  it("stays off locally unless the opt-in flag is set", () => {
    expect(getErrorTrackingOptions(LOCAL)).toMatchObject({ enabled: false, environment: "development" })
    expect(getErrorTrackingOptions({ ...LOCAL, sendInDevelopment: "true" })).toMatchObject({
      enabled: true,
      environment: "development",
    })
  })

  it("reads the NEXT_PUBLIC_SENTRY_* values", () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_ENVIRONMENT", "production")
    vi.stubEnv("NEXT_PUBLIC_SENTRY_RELEASE", "")
    expect(getErrorTrackingOptions()).toMatchObject({ enabled: true, release: undefined })
  })

  it("never collects request bodies, cookies, query strings or user info", () => {
    expect(getErrorTrackingOptions(LOCAL).dataCollection).toMatchObject({
      userInfo: false,
      cookies: false,
      httpBodies: [],
      urlQueryParams: false,
    })
  })
})

describe("scrubEvent", () => {
  it("drops personal data and secrets before an event leaves", () => {
    const scrubbed = scrubEvent({
      type: undefined,
      message: "lookup failed for jane.doe@example.com",
      user: { id: "user_123", email: "jane.doe@example.com" },
      request: {
        method: "POST",
        url: "https://magic-memory.dev/api/restore?token=abc",
        data: "{\"photo\":\"...\"}",
        cookies: { __session: "secret" },
        query_string: "token=abc",
        headers: { "User-Agent": "test-agent", Cookie: "__session=secret", Authorization: "Bearer abc.def" },
      },
      breadcrumbs: [{ category: "fetch", data: { url: "/api/credits?session=xyz", status_code: 500 } }],
      exception: { values: [{ type: "Error", value: "Stripe rejected sk_test_1234567890abcdef with Bearer eyJhbGciOi.eyJzdWIi.c2lnbmF0dXJl" }] },
    })

    expect(scrubbed.user).toBeUndefined()
    expect(scrubbed.message).toBe("lookup failed for [email]")
    expect(scrubbed.request).toEqual({
      method: "POST",
      url: "https://magic-memory.dev/api/restore",
      headers: { "User-Agent": "test-agent" },
    })
    expect(scrubbed.breadcrumbs?.[0]?.data).toEqual({ url: "/api/credits", status_code: 500 })
    expect(scrubbed.exception?.values?.[0]?.value).toBe("Stripe rejected [token] with Bearer [token]")
  })
})

describe("browser SDK", () => {
  it("sends nothing from local dev without the flag", async () => {
    const sent = startSdk(getErrorTrackingOptions(LOCAL))
    captureException(new Error("local only"))
    await flush()
    expect(sent).toEqual([])
  })

  it("sends an error event with the flag", async () => {
    const sent = startSdk(getErrorTrackingOptions({ ...LOCAL, sendInDevelopment: "true" }))
    captureException(new Error("opted in"))
    await flush()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toContain("opted in")
    expect(sent[0]).toContain('"environment":"development"')
  })
})

describe("onRequestError", () => {
  it("captures the server error with its route", async () => {
    const sent = startSdk(getErrorTrackingOptions({ ...LOCAL, sendInDevelopment: "true" }))
    await onRequestError(
      new Error("route failed"),
      { path: "/api/credits", method: "GET", headers: {} },
      { routerKind: "App Router", routePath: "/api/credits", routeType: "route", revalidateReason: undefined },
    )
    expect(sent).toHaveLength(1)
    expect(sent[0]).toContain("route failed")
    expect(sent[0]).toContain('"routePath":"/api/credits"')
  })
})
