import { cn } from "@/lib/utils";

type SectionLabelProps = {
  /** Two-digit section number shown in ember, e.g. "01". */
  index: string;
  children: string;
  /** `paper` on cream sections. */
  tone?: "dark" | "paper";
  className?: string;
};

/** Mono uppercase label: ember index, short rule, label. */
export function SectionLabel({ index, children, tone = "dark", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]",
        tone === "dark" ? "text-paper/60" : "text-ink/65",
        className
      )}
    >
      <span className="text-ember">{index}</span>
      <span
        className={cn("h-px w-10", tone === "dark" ? "bg-paper/25" : "bg-ink/25")}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
