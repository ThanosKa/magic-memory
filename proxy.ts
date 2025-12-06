import { type NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next()
  }

  try {
    const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server")
    const isProtected = createRouteMatcher(["/restore(.*)", "/profile(.*)"])

    return clerkMiddleware(async (auth, request) => {
      if (isProtected(request)) {
        await auth.protect()
      }
    })(req, {} as never)
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
