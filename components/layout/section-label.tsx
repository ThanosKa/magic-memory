import type { Tone } from "@/components/layout/tone";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  children: string;
  tone?: Tone;
  className?: string;
};

const TONE_CLASSES: Record<Tone, { text: string; rule: string }> = {
  "dark": { text: "text-paper/60", rule: "bg-paper/25" },
  "paper": { text: "text-ink/65", rule: "bg-ink/25" },
};

/**
 * Mono uppercase label: ember `index` (two digits, e.g. "01"), short rule,
 * label. Use `tone="paper"` on cream sections.
 */
export function SectionLabel({ index, children, tone = "dark", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]",
        TONE_CLASSES[tone].text,
        className
      )}
    >
      <span className="text-ember">{index}</span>
      <span className={cn("h-px w-10", TONE_CLASSES[tone].rule)} aria-hidden="true" />
      {children}
    </p>
  );
}
