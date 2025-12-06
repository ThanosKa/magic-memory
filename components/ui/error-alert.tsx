"use client";

import type React from "react";

import { AlertCircle, CreditCard, Upload, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ErrorType =
  | "out_of_credits"
  | "file_too_large"
  | "auth_error"
  | "generic";

interface ErrorAlertProps {
  type: ErrorType;
  message?: string;
  freeResetTime?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

const errorConfig: Record<
  ErrorType,
  {
    icon: React.ElementType;
    title: string;
    defaultMessage: string;
    actionLabel?: string;
    actionHref?: string;
  }
> = {
  out_of_credits: {
    icon: CreditCard,
    title: "Out of Credits",
    defaultMessage:
      "You're out of credits. Your free credit resets at midnight UTC, or purchase more credits now.",
    actionLabel: "Get More Credits",
    actionHref: "/pricing",
  },
  file_too_large: {
    icon: Upload,
    title: "File Too Large",
    defaultMessage:
      "The file you selected is too large. Please upload an image under 10MB.",
  },
  auth_error: {
    icon: ShieldAlert,
    title: "Authentication Required",
    defaultMessage:
      "Your session has expired. Please sign in again to continue.",
    actionLabel: "Sign In",
    actionHref: "/sign-in",
  },
  generic: {
    icon: AlertCircle,
    title: "Something Went Wrong",
    defaultMessage: "Something went wrong. Please try again.",
  },
};

export function ErrorAlert({
  type,
  message,
  freeResetTime,
  onDismiss,
  onRetry,
}: ErrorAlertProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  // Calculate hours until reset for out_of_credits
  let resetMessage = "";
  if (type === "out_of_credits" && freeResetTime) {
    const now = new Date();
    const reset = new Date(freeResetTime);
    const hoursUntilReset = Math.max(
      0,
      Math.ceil((reset.getTime() - now.getTime()) / (1000 * 60 * 60))
    );
    resetMessage = `Your free credit resets in ${hoursUntilReset} hour${
      hoursUntilReset !== 1 ? "s" : ""
    }.`;
  }

  return (
    <div className="relative rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-destructive hover:bg-destructive/20"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/20">
          <Icon className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-destructive">{config.title}</h3>
          <p className="text-sm text-destructive/90">
            {message || config.defaultMessage}
          </p>
          {resetMessage && (
            <p className="text-sm text-destructive/80">{resetMessage}</p>
          )}
          <div className="flex gap-2 pt-2">
            {config.actionHref && config.actionLabel && (
              <Button asChild size="sm" variant="destructive">
                <Link href={config.actionHref}>{config.actionLabel}</Link>
              </Button>
            )}
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
