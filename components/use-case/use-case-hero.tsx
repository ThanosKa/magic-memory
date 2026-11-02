import Image from "next/image";
import Link from "next/link";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

type UseCaseHeroProps = {
  headline: string;
  subheadline: string;
  keyword: string;
  ctaHref?: string;
};

function Frame({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <figure className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] border border-paper/10 bg-surface-2">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <figcaption className="font-mono text-center text-[11px] uppercase tracking-[0.18em] text-paper/60">
        {label}
      </figcaption>
    </figure>
  );
}

export function UseCaseHero({ headline, subheadline, ctaHref = "/" }: UseCaseHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <PageContainer className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pb-28 lg:pt-16">
        <div>
          <h1 className="font-serif text-balance text-[clamp(2.5rem,5vw,4.75rem)] leading-[1] tracking-[-0.02em] text-paper">
            {headline}
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-[17px] leading-[1.6] text-paper/70 sm:text-lg">
            {subheadline}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button asChild size="lg">
              <Link href={ctaHref}>
                Restore Your Photo Free
                <ButtonArrow />
              </Link>
            </Button>
            <Link
              href="/pricing"
              className="focus-ring group inline-flex min-h-11 items-center text-[15px] font-medium text-paper/80 transition-colors hover:text-paper"
            >
              <span className="mm-underline">View Pricing</span>
            </Link>
          </div>
          <p className="font-mono mt-8 text-[11px] uppercase tracking-[0.16em] text-paper/60">
            1 free restoration per day. No credit card required.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Frame src="/couple-before.jpg" alt="Old photo before AI restoration" label="Before" />
          <Frame src="/couple-after.png" alt="Photo after AI restoration" label="After" />
        </div>
      </PageContainer>
    </section>
  );
}
