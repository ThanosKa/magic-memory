"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface AuthButtonProps {
  children?: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  showArrow?: boolean
  fallbackHref?: string
}

// only when Clerk is available, otherwise falls back to a Link
export function AuthButton({
  children = "Get Started Free",
  variant = "default",
  size = "lg",
  className = "",
  showArrow = false,
  fallbackHref = "/pricing",
}: AuthButtonProps) {
  const [ClerkSignUpButton, setClerkSignUpButton] = useState<React.ComponentType<any> | null>(null)
  const [hasClerk, setHasClerk] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    if (clerkKey) {
      setHasClerk(true)
      // Dynamically import SignUpButton only when Clerk is configured
      import("@clerk/nextjs")
        .then((mod) => {
          setClerkSignUpButton(() => mod.SignUpButton)
        })
        .catch(() => {
          setHasClerk(false)
        })
    }
  }, [])

  // Show nothing during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    )
  }

  // If Clerk is available and loaded, use SignUpButton
  if (hasClerk && ClerkSignUpButton) {
    return (
      <ClerkSignUpButton mode="modal">
        <Button variant={variant} size={size} className={className}>
          {children}
          {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </ClerkSignUpButton>
    )
  }

  // Fallback: Link to pricing/signup page
  return (
    <Link href={fallbackHref}>
      <Button variant={variant} size={size} className={className}>
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </Link>
  )
}
