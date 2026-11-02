import { Reveal } from "@/components/home/reveal";
import { StartButton } from "@/components/home/start-button";

export function FinalCta() {
  return (
    <section className="border-t border-paper/10">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center px-5 py-28 text-center sm:px-8 md:py-40 lg:px-14">
        <Reveal>
          <h2 className="font-serif max-w-[16ch] text-[clamp(2.75rem,6.4vw,6.25rem)] leading-[0.98] tracking-[-0.02em] text-paper">
            That photo in the drawer has waited{" "}
            <span className="italic text-paper/55">long enough.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="mt-10 flex flex-col items-center gap-5">
          <StartButton />
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/45">
            Your first restoration today is free
          </p>
        </Reveal>
      </div>
    </section>
  );
}
