type SectionLabelProps = {
  index: string;
  children: string;
  tone?: "dark" | "paper";
};

export function SectionLabel({ index, children, tone = "dark" }: SectionLabelProps) {
  return (
    <p
      className={
        tone === "dark"
          ? "font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-paper/50"
          : "font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-ink/55"
      }
    >
      <span className="text-ember">{index}</span>
      <span
        className={tone === "dark" ? "h-px w-10 bg-paper/25" : "h-px w-10 bg-ink/25"}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
