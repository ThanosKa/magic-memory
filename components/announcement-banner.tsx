"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY < SCROLL_THRESHOLD;
      setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "relative z-40 w-full overflow-hidden border-b border-primary/20 bg-primary text-primary-foreground transition-all duration-300",
        isVisible
          ? "max-h-24 opacity-100"
          : "pointer-events-none -translate-y-full max-h-0 opacity-0"
      )}
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col items-center gap-2 text-center sm:flex-row sm:flex-initial sm:items-center sm:gap-3">
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Use code{" "}
            <span className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary shadow-sm sm:text-sm">
              RESTORE40
            </span>{" "}
            for 40% off all pricing.
          </span>
          <span className="text-sm text-primary-foreground/85 sm:text-base">
            Limited time launch offer—redeem at checkout.
          </span>
        </div>
      </div>
    </div>
  );
}

