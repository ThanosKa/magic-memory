"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMounted } from "@/components/theme/use-mounted";

type ThemeToggleProps = {
  /** `icon` for the header bar, `row` for the mobile menu sheet. */
  variant?: "icon" | "row";
  className?: string;
};

/** Switches between the dark (default) and light darkroom themes. */
export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  // The page is themed before paint by next-themes' script; only this
  // button waits for hydration to know the stored choice.
  const isLight = mounted && resolvedTheme === "light";
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";
  const Icon = isLight ? Moon : Sun;

  const toggle = () => setTheme(isLight ? "dark" : "light");

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className={cn(
          "focus-ring flex min-h-11 w-full items-center justify-between rounded-full border border-paper/15 px-4 text-sm text-paper/80 transition-colors hover:border-paper/40 hover:text-paper",
          className
        )}
      >
        <span>{isLight ? "Dark theme" : "Light theme"}</span>
        <Icon className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "focus-ring inline-flex size-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/[0.06] hover:text-paper",
        className
      )}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}
