import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { pageContainerClass } from "@/components/layout/page-container";

type StackedSectionProps = {
  children: ReactNode;
  /** `paper` for the cream contrast sections (ink text). */
  tone?: "dark" | "paper";
  id?: string;
  /** Applied to the inner page container (grid, padding overrides). */
  className?: string;
};

/**
 * A section that slides over the one before it like a stacked print:
 * rounded top corners, pulled up by 40px. Later sections paint on top
 * (each one is its own stacking context), so no z-index juggling.
 */
export function StackedSection({ children, tone = "dark", id, className }: StackedSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate -mt-10 rounded-t-[40px] md:rounded-t-[56px]",
        tone === "dark" ? "bg-ink text-paper" : "bg-paper text-ink [--ember:var(--ember-on-paper)]"
      )}
    >
      <div className={cn(pageContainerClass, "pb-24 pt-20 md:pb-32 md:pt-28", className)}>
        {children}
      </div>
    </section>
  );
}
