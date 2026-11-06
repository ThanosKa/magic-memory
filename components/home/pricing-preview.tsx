import Link from "next/link";
import { ArrowUpRight, Ban, Globe, ShieldCheck, Undo2 } from "lucide-react";
import { StackedSection } from "@/components/layout/stacked-section";
import { SectionColumns } from "@/components/layout/section-columns";
import { SectionLabel } from "@/components/layout/section-label";
import { PlanCell, PlanGrid } from "@/components/pricing/plan-grid";
import { CREDIT_PACKAGES, perPhotoPrice } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PLANS = [
  ...Object.values(CREDIT_PACKAGES).map((pkg) => ({
    name: pkg.name,
    price: pkg.priceDisplay,
    amount: `${pkg.credits} photos`,
    detail: `${perPhotoPrice(pkg)} per photo, paid once`,
    popular: pkg.popular,
  })),
];

const PROMISES = [
  { Icon: ShieldCheck, text: "Photos aren’t kept after processing" },
  { Icon: Ban, text: "Never used to train AI models" },
  { Icon: Undo2, text: "A failed restoration costs no credit" },
  { Icon: Globe, text: "Works in any browser, no app" },
];

export function PricingPreview() {
  return (
    <StackedSection tone="paper" className="pb-28 md:pb-36">
      <SectionColumns aside={<SectionLabel index="04" tone="paper">Pricing</SectionLabel>}>
        <h2 className="font-serif text-[clamp(2.75rem,5.6vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
          Pay once.{" "}
          <span className="italic text-ink/55">Credits never expire.</span>
        </h2>
        <p className="mt-6 max-w-[36rem] text-[17px] leading-[1.6] text-ink/65">
          Buy a pack once and use it whenever you like. No subscription,
          no auto-renewal.
        </p>
      </SectionColumns>

      <div className="mt-16 md:mt-20">
        <PlanGrid>
          {PLANS.map((plan, i) => (
            <PlanCell key={plan.name} index={i} popular={plan.popular} className="gap-1">
              <div className="flex h-6 items-center justify-between gap-3">
                <p
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.2em]",
                    plan.popular ? "text-paper/60" : "text-ink/65"
                  )}
                >
                  {plan.name}
                </p>
                {plan.popular && (
                  <span className="font-mono rounded-full bg-ember px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink">
                    Most popular
                  </span>
                )}
              </div>
              <p className="font-serif mt-5 text-[56px] leading-none tracking-[-0.02em]">{plan.price}</p>
              <p className="mt-5 text-[16px] font-medium">{plan.amount}</p>
              <p className={cn("text-[14px]", plan.popular ? "text-paper/65" : "text-ink/65")}>
                {plan.detail}
              </p>
            </PlanCell>
          ))}
        </PlanGrid>
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[44rem] text-[13px] leading-[1.6] text-ink/65">
          For comparison: Remini costs $9.99 a week and MyHeritage&rsquo;s
          enhancer comes with genealogy plans from $119 a year (prices checked
          May 2026).
        </p>
        <Link
          href="/pricing"
          className="group inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-ink/20 px-5 text-[14px] font-medium transition-colors hover:bg-ink hover:text-paper sm:self-auto"
        >
          Compare plans
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <ul className="mt-20 grid gap-x-8 gap-y-6 border-t border-ink/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-ink/70" strokeWidth={1.6} aria-hidden="true" />
            <span className="text-[15px] leading-[1.5] text-ink/80">{text}</span>
          </li>
        ))}
      </ul>
    </StackedSection>
  );
}
