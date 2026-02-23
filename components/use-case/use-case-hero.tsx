import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type UseCaseHeroProps = {
  headline: string;
  subheadline: string;
  keyword: string;
  ctaHref?: string;
};

export function UseCaseHero({
  headline,
  subheadline,
  ctaHref = "/",
}: UseCaseHeroProps) {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              {headline}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-xl">
              {subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={ctaHref}>
                <Button size="lg" className="px-8">
                  Restore Your Photo Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              1 free restoration per day. No credit card required.
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-center text-sm font-medium text-muted-foreground">Before</p>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src="/couple-before.jpg"
                    alt="Old photo before AI restoration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-center text-sm font-medium text-muted-foreground">After</p>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src="/couple-after.png"
                    alt="Photo after AI restoration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
