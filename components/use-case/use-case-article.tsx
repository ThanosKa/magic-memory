import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/layout/reveal";

type UseCaseArticleProps = {
  children: ReactNode;
};

/** Long-form body section of a use-case page; h2, p, li and strong inside are styled here. */
export function UseCaseArticle({ children }: UseCaseArticleProps) {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="py-24 md:py-32">
        <Reveal>
          <div className="max-w-3xl [&_h2]:font-serif [&_h2]:mb-6 [&_h2]:text-[clamp(1.9rem,3.2vw,2.75rem)] [&_h2]:leading-[1.05] [&_h2]:tracking-[-0.01em] [&_h2]:text-paper [&_h2:not(:first-child)]:mt-14 [&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-paper/70 [&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:text-paper/70 [&_strong]:font-medium [&_strong]:text-paper">
            {children}
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
