import { Reveal } from "@/components/home/reveal";
import { SectionLabel } from "@/components/home/section-label";

export function PlainWordsSection() {
  return (
    <section className="border-t border-paper/10">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:px-14 lg:py-40">
        <Reveal>
          <SectionLabel index="01">In plain words</SectionLabel>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-serif max-w-[24ch] text-[clamp(2rem,3.9vw,3.75rem)] leading-[1.1] tracking-[-0.015em] text-paper">
            You have a photo of someone you love. It&rsquo;s blurry, faded or
            scratched. You upload it, our AI redraws the face, and you download
            a sharper copy.{" "}
            <span className="italic text-paper/50">That&rsquo;s Magic Memory.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
