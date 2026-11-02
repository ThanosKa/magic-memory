import { PageContainer } from "@/components/layout/page-container";
import { SectionColumns } from "@/components/layout/section-columns";
import { SectionLabel } from "@/components/layout/section-label";

export function PlainWordsSection() {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="py-24 md:py-32 lg:py-40">
        <SectionColumns className="gap-10" aside={<SectionLabel index="01">In plain words</SectionLabel>}>
          <p className="font-serif max-w-[24ch] text-[clamp(2rem,3.9vw,3.75rem)] leading-[1.1] tracking-[-0.015em] text-paper">
            You have a photo of someone you love. It&rsquo;s blurry, faded or
            scratched. You upload it, our AI redraws the face, and you download
            a sharper copy.{" "}
            <span className="italic text-paper/50">That&rsquo;s Magic Memory.</span>
          </p>
        </SectionColumns>
      </PageContainer>
    </section>
  );
}
