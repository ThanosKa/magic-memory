import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"

const PROTECTED_ROUTES = ["/restore", "/restore/(.*)", "/profile", "/profile/(.*)"]
const PROTECTED_PATH_PATTERN = /^\/(restore|profile)(\/|$)/

function failClosed({ req, reason }: { req: NextRequest; reason: string }) {
  if (!PROTECTED_PATH_PATTERN.test(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  logger.error({ path: req.nextUrl.pathname, reason }, "Route protection unavailable, redirecting home")
  return NextResponse.redirect(new URL("/", req.url))
}

export async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return failClosed({ req, reason: "Clerk keys are not configured" })
  }

  try {
    const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server")
    const isProtected = createRouteMatcher(PROTECTED_ROUTES)

    return clerkMiddleware(async (auth, request) => {
      if (isProtected(request)) {
        await auth.protect()
      }
    })(req, event)
  } catch (error) {
    return failClosed({ req, reason: error instanceof Error ? error.message : String(error) })
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
