import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionColumns } from "@/components/layout/section-columns";
import { SectionLabel } from "@/components/layout/section-label";
import { StackedSection } from "@/components/layout/stacked-section";
import { homepageFaqs } from "@/lib/seo/faq-data";

export function HomeFaq() {
  return (
    <StackedSection>
      <SectionColumns
        className="gap-12"
        stickyAside
        aside={
          <>
            <SectionLabel index="05">Questions</SectionLabel>
            <h2 className="font-serif mt-6 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] tracking-[-0.02em] text-paper">
              Good questions,{" "}
              <span className="italic text-paper/55">straight answers.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.6] text-paper/60">
              Something else on your mind?{" "}
              <a
                href="mailto:kazakis.th@gmail.com"
                className="mm-underline text-paper/85 hover:text-paper"
              >
                Email support
              </a>
              .
            </p>
          </>
        }
      >
        <Accordion type="single" collapsible className="w-full border-t border-border">
          {homepageFaqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionColumns>
    </StackedSection>
  );
}
