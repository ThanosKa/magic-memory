import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/layout/reveal";
import { StartButton } from "@/components/layout/start-button";

type FinalCtaProps = {
  /** Serif headline; wrap the emphasis in `<span className="italic text-paper/55">`. */
  title: ReactNode;
  /** Small mono line under the action. */
  note?: ReactNode;
  /** Defaults to the start button. */
  action?: ReactNode;
};

/** Closing call to action used at the bottom of pages. */
export function FinalCta({ title, note, action = <StartButton /> }: FinalCtaProps) {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="flex flex-col items-center py-28 text-center md:py-40">
        <Reveal>
          <h2 className="font-serif max-w-[16ch] text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98] tracking-[-0.02em] text-paper">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-10 flex flex-col items-center gap-5">
          {action}
          {note && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">{note}</p>
          )}
        </Reveal>
      </PageContainer>
    </section>
  );
}
