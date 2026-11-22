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
