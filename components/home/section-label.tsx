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
          ? "mm-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f1eadf]/50"
          : "mm-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#0d0b09]/55"
      }
    >
      <span className="text-[#ff5a36]">{index}</span>
      <span
        className={tone === "dark" ? "h-px w-10 bg-[#f1eadf]/25" : "h-px w-10 bg-[#0d0b09]/25"}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
