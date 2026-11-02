import type { ReactNode } from "react";
import { PAGE_CONTAINER_CLASS } from "@/components/layout/page-container";
import type { Tone } from "@/components/layout/tone";
import { cn } from "@/lib/utils";

type StackedSectionProps = {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
};

const TONE_CLASSES: Record<Tone, string> = {
  "dark": "bg-ink text-paper",
  "paper": "bg-paper text-ink [--ember:var(--ember-on-paper)]",
};

/**
 * A section that slides over the one before it like a stacked print:
 * rounded top corners, pulled up by 40px. Later sections paint on top
 * (each one is its own stacking context), so no z-index juggling.
 * `tone="paper"` makes a cream contrast section (ink text); `className`
 * goes on the inner page container (grid, padding overrides).
 */
export function StackedSection({ children, tone = "dark", id, className }: StackedSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate -mt-10 rounded-t-[40px] md:rounded-t-[56px]",
        TONE_CLASSES[tone]
      )}
    >
      <div className={cn(PAGE_CONTAINER_CLASS, "pb-24 pt-20 md:pb-32 md:pt-28", className)}>
        {children}
      </div>
    </section>
  );
}
