import { afterEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import logger from "@/lib/logger"
import { proxy } from "@/proxy"

// vitest.setup.ts mocks @clerk/nextjs/server without clerkMiddleware, so with
// both keys set the proxy's Clerk branch throws, as a broken Clerk import would.

function request(path: string) {
  return new NextRequest(new URL(path, "https://magic-memory.dev"))
}

function setClerkKeys({ secret }: { secret: string }) {
  vi.stubEnv("CLERK_SECRET_KEY", secret)
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k")
}

describe("proxy when Clerk is unavailable", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it.each(["/restore", "/profile", "/profile/security"])(
    "sends %s to the home page and logs an error when the Clerk secret is missing",
    async (path) => {
      setClerkKeys({ secret: "" })

      const response = await proxy(request(path))

      expect(response.status).toBe(307)
      expect(new URL(response.headers.get("location") ?? "").pathname).toBe("/")
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    },
  )

  it("sends a protected page to the home page when Clerk fails to load", async () => {
    setClerkKeys({ secret: "sk_test_Y2xlcmsuZXhhbXBsZS5jb20k" })

    const response = await proxy(request("/restore"))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe("/")
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it.each(["/", "/pricing", "/api/credits"])("lets %s through", async (path) => {
    setClerkKeys({ secret: "" })

    const response = await proxy(request(path))

    expect(response.headers.get("location")).toBeNull()
    expect(response.headers.get("x-middleware-next")).toBe("1")
  })
})
