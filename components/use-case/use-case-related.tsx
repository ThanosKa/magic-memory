import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

type UseCaseRelatedProps = {
  links: { href: string; label: string }[];
  title?: string;
};

export function UseCaseRelated({ links, title = "Related Restorations" }: UseCaseRelatedProps) {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="py-20 md:py-24">
        <div>
          <h2 className="font-serif text-[clamp(1.75rem,2.8vw,2.25rem)] leading-[1.1] tracking-[-0.01em] text-paper">
            {title}
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-[6px] border border-paper/10 bg-surface-2 p-6 text-[15px] font-medium text-paper transition-colors hover:border-ember/60"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
