"use client"

import type React from "react"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
}

interface LoadingOverlayProps {
  message?: string
  submessage?: string
}

export function LoadingOverlay({ message = "Loading...", submessage }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="font-medium">{message}</p>
          {submessage && <p className="text-sm text-muted-foreground">{submessage}</p>}
        </div>
      </div>
    </div>
  )
}

interface LoadingCardProps {
  title: string
  description?: string
}

export function LoadingCard({ title, description }: LoadingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
      <LoadingSpinner size="lg" />
      <p className="mt-4 font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

interface ProgressLoadingProps {
  progress?: number
  message: string
  submessage?: string
}

export function ProgressLoading({ progress, message, submessage }: ProgressLoadingProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
          {progress !== undefined && (
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${(progress / 100) * 176} 176`}
              className="text-primary transition-all duration-300"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {progress !== undefined ? (
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          ) : (
            <LoadingSpinner size="sm" />
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium">{message}</p>
        {submessage && <p className="text-sm text-muted-foreground">{submessage}</p>}
      </div>
    </div>
  )
}

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      {children}
    </span>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border p-4">
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function CreditsSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2">
      <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  )
}
