"use client";

import { useEffect, useState } from "react";
import { MegaphoneIcon } from "lucide-react";
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
          ? "max-h-16 opacity-100"
          : "pointer-events-none -translate-y-full max-h-0 opacity-0"
      )}
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm sm:px-6 lg:px-8">
        <MegaphoneIcon className="h-4 w-4 shrink-0" aria-hidden />
        <div className="flex flex-1 flex-col gap-1 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-2">
          <span className="font-semibold tracking-tight">
            Use code RESTORE40 for 40% off all pricing.
          </span>
          <span className="text-sm text-primary-foreground/80">
            Limited time launch offer—redeem at checkout.
          </span>
        </div>
        <span className="hidden rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] sm:inline">
          RESTORE40
        </span>
      </div>
    </div>
  );
}

