import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/home/reveal";
import { SectionLabel } from "@/components/home/section-label";
import { homepageFaqs } from "@/lib/seo/faq-data";

export function HomeFaq() {
  return (
    <section className="relative z-40 -mt-10 rounded-t-[40px] bg-ink md:rounded-t-[56px]">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:px-14">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="05">Questions</SectionLabel>
          <h2 className="font-serif mt-6 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] tracking-[-0.02em] text-paper">
            Good questions,{" "}
            <span className="italic text-paper/55">straight answers.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-paper/55">
            Something else on your mind?{" "}
            <a
              href="mailto:kazakis.th@gmail.com"
              className="mm-underline text-paper/85 hover:text-paper"
            >
              Email support
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="w-full border-t border-paper/12">
            {homepageFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-b border-paper/12 last:border-b"
              >
                <AccordionTrigger className="py-6 text-[17px] font-normal text-paper hover:no-underline sm:text-[19px] [&>svg]:size-5 [&>svg]:text-paper/50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-6 text-[15px] leading-[1.7] text-paper/60">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
