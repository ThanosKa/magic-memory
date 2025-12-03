"use client"

import { useState, useEffect } from "react"

interface AuthState {
  isSignedIn: boolean
  isLoaded: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    isLoaded: false,
  })

  useEffect(() => {
    // Check if Clerk is available
    const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

    if (!hasClerk) {
      setAuthState({ isSignedIn: false, isLoaded: true })
      return
    }

    // Dynamically import and use Clerk
    import("@clerk/nextjs")
      .then((clerk) => {
        // We can't use hooks here, so we'll rely on the ClerkProvider
        // and check window for clerk instance
        const checkAuth = () => {
          if (typeof window !== "undefined" && (window as any).__clerk_frontend_api) {
            const clerkInstance = (window as any).Clerk
            if (clerkInstance) {
              setAuthState({
                isSignedIn: !!clerkInstance.user,
                isLoaded: true,
              })
            }
          }
        }

        // Initial check
        checkAuth()

        // Poll for changes (Clerk will update)
        const interval = setInterval(checkAuth, 100)
        setTimeout(() => clearInterval(interval), 5000) // Stop after 5s

        return () => clearInterval(interval)
      })
      .catch(() => {
        setAuthState({ isSignedIn: false, isLoaded: true })
      })
  }, [])

  return authState
}
