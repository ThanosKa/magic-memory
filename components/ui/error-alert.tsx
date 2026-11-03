"use client";

import type React from "react";

import { AlertCircle, CreditCard, Upload, ShieldAlert, X } from "lucide-react";
import { Button, ButtonArrow } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ErrorType =
  | "out_of_credits"
  | "file_too_large"
  | "auth_error"
  | "generic";

type ErrorAlertProps = {
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
    <div
      role="alert"
      className="relative rounded-[20px] border border-destructive/35 bg-surface p-5 sm:p-6"
    >
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="focus-ring absolute right-2 top-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/60 transition-colors hover:bg-paper/[0.06] hover:text-paper"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15">
          <Icon className="size-5 text-destructive" />
        </div>
        <div className={cn("flex-1 space-y-2", onDismiss && "pr-8")}>
          <h3 className="text-[17px] font-medium text-paper">{config.title}</h3>
          <p className="text-[15px] leading-[1.6] text-paper/70">
            {message || config.defaultMessage}
          </p>
          {resetMessage && (
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
              {resetMessage}
            </p>
          )}
          {((config.actionHref && config.actionLabel) || onRetry) && (
            <div className="flex flex-wrap gap-3 pt-3">
              {config.actionHref && config.actionLabel && (
                <Button asChild size="sm">
                  <Link href={config.actionHref}>
                    {config.actionLabel}
                    <ButtonArrow />
                  </Link>
                </Button>
              )}
              {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry}>
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
