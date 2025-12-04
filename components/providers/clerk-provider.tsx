"use client"

import { ClerkProvider } from "@clerk/nextjs"
import type { ReactNode } from "react"

export function ConditionalClerkProvider({ children }: { children: ReactNode }) {
  // If no Clerk key, just render children without Clerk
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>
  }

  return (
    <ClerkProvider afterSignOutUrl="/" signInFallbackRedirectUrl="/restore" signUpFallbackRedirectUrl="/restore">
      {children}
    </ClerkProvider>
  )
}
