"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/layout/reveal";
import { SectionLabel } from "@/components/layout/section-label";
import type { FAQItem } from "@/lib/seo/faq-data";

type UseCaseFAQProps = {
  faqs: FAQItem[];
  title?: string;
};

export function UseCaseFAQ({ faqs, title = "Frequently Asked Questions" }: UseCaseFAQProps) {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="grid gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="03">Questions</SectionLabel>
          <h2 className="font-serif mt-6 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-paper">
            {title}
          </h2>
          <p className="mt-6 text-[15px] leading-[1.6] text-paper/70">
            Common questions about this type of photo restoration
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </PageContainer>
    </section>
  );
}
