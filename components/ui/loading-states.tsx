"use client"

import type React from "react"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg"
  /** `ember` (default) for standalone loaders, `paper` inside a dark control. */
  tone?: "ember" | "paper"
  className?: string
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
}

export function LoadingSpinner({ size = "md", tone = "ember", className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        tone === "ember" ? "text-ember" : "text-paper/80",
        sizeClasses[size],
        className
      )}
    />
  )
}

type LoadingOverlayProps = {
  message?: string
  submessage?: string
}

export function LoadingOverlay({ message = "Loading...", submessage }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="font-medium text-paper">{message}</p>
          {submessage && <p className="text-sm text-paper/60">{submessage}</p>}
        </div>
      </div>
    </div>
  )
}

type LoadingCardProps = {
  title: string
  description?: string
}

export function LoadingCard({ title, description }: LoadingCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-paper/20 bg-surface p-8">
      <LoadingSpinner size="lg" />
      <p className="mt-4 font-medium text-paper">{title}</p>
      {description && <p className="mt-1 text-sm text-paper/60">{description}</p>}
    </div>
  )
}

type ProgressLoadingProps = {
  progress?: number
  message: string
  submessage?: string
}

export function ProgressLoading({ progress, message, submessage }: ProgressLoadingProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="relative size-16">
        <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-paper/10" />
          {progress !== undefined && (
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 176} 176`}
              className="text-ember transition-[stroke-dasharray] duration-300"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {progress !== undefined ? (
            <span className="font-mono text-[12px] text-paper">{Math.round(progress)}%</span>
          ) : (
            <LoadingSpinner size="sm" />
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="font-medium text-paper">{message}</p>
        {submessage && <p className="text-sm text-paper/60">{submessage}</p>}
      </div>
    </div>
  )
}

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <LoadingSpinner size="sm" className="text-current" />
      {children}
    </span>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-border bg-surface p-4">
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-3" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-3" />
        <div className="h-24 animate-pulse rounded bg-surface-3" />
      </div>
    </div>
  )
}

export function CreditsSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-paper/[0.04] px-4 py-2">
      <div className="size-5 animate-pulse rounded-full bg-paper/10" />
      <div className="h-4 w-24 animate-pulse rounded bg-paper/10" />
    </div>
  )
}
