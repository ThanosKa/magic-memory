import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/home/reveal";
import { SectionLabel } from "@/components/home/section-label";
import { homepageFaqs } from "@/lib/seo/faq-data";

export function HomeFaq() {
  return (
    <section className="relative z-40 -mt-10 rounded-t-[40px] bg-[#0d0b09] md:rounded-t-[56px]">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:px-14">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="05">Questions</SectionLabel>
          <h2 className="mm-serif mt-6 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] tracking-[-0.02em] text-[#f1eadf]">
            Good questions,{" "}
            <span className="italic text-[#f1eadf]/55">straight answers.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-[#f1eadf]/55">
            Something else on your mind?{" "}
            <a
              href="mailto:kazakis.th@gmail.com"
              className="mm-underline text-[#f1eadf]/85 hover:text-[#f1eadf]"
            >
              Email support
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="w-full border-t border-[#f1eadf]/12">
            {homepageFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-b border-[#f1eadf]/12 last:border-b"
              >
                <AccordionTrigger className="py-6 text-[17px] font-normal text-[#f1eadf] hover:no-underline sm:text-[19px] [&>svg]:size-5 [&>svg]:text-[#f1eadf]/50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-6 text-[15px] leading-[1.7] text-[#f1eadf]/60">
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
