import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FinalCta } from "@/components/layout/final-cta";
import { PageContainer } from "@/components/layout/page-container";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { ComparisonTable } from "@/components/competitor/comparison-table";
import { competitors } from "@/lib/competitors/data";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = pageMetadata({
  path: "/alternatives/myheritage",
  title: "MyHeritage Photo Enhancer Alternative: No Subscription",
  description: "MyHeritage Photo Enhancer needs a Photo subscription for unlimited use. Magic Memory restores faces in old photos with one-time packs from €9.99 that never expire.",
  social: {
    title: "MyHeritage Photo Enhancer Alternative: No Subscription",
    description: "MyHeritage Photo Enhancer needs a Photo subscription for unlimited use. Magic Memory: one-time packs from €9.99.",
    imageAlt: "MyHeritage Alternative",
  },
});

const myheritage = competitors.myheritage;

const faqs: FAQItem[] = [
  {
    question: "Can I use MyHeritage Photo Enhancer for free?",
    answer:
      "You can sign up to MyHeritage for free, but MyHeritage does not publish a free-use limit for the Photo Enhancer. Unlimited use comes with the MyHeritage Photo subscription, or with a plan that includes the photo features, such as the Complete or Omni plan (MyHeritage help center, checked 2026-11-16).",
  },
  {
    question: "How much does MyHeritage Photo Enhancer cost?",
    answer:
      "MyHeritage sells a Photo subscription that gives unlimited use of its AI photo tools, the Photo Enhancer included. The Complete and Omni plans also include the photo features. MyHeritage shows the price on its plans page rather than in its help articles, so check it there before you buy. Either way it is a recurring subscription.",
  },
  {
    question: "Do I need a genealogy subscription to use MyHeritage photo enhancement?",
    answer:
      "No. MyHeritage now sells a Photo subscription on its own, which covers the Photo Enhancer and its other AI photo tools. The Complete and Omni genealogy plans include the photo features too. Both are recurring subscriptions, so if you only have a few photos to restore you keep paying after you are done.",
  },
  {
    question: "What's a MyHeritage Photo Enhancer alternative without a subscription?",
    answer:
      "Magic Memory is a standalone alternative with no subscription — one-time credit packs from €9.99 (20 credits, never expire) up to €29.99 (120 credits, €0.25/photo). Unlimited use on MyHeritage needs a recurring subscription. 100 photos on Magic Memory cost €25 in credits if you use the largest pack, with nothing to cancel afterwards.",
  },
  {
    question: "Does Magic Memory offer genealogy features?",
    answer:
      "No. Magic Memory is a standalone photo restoration tool. It does not include genealogy, DNA testing, or family tree features. This makes it significantly cheaper for users who only want photo restoration. Many genealogists use Magic Memory to restore ancestor photos and then attach those restored images to family trees in Ancestry, MyHeritage, or FamilySearch — you are not locked into one tool.",
  },
  {
    question: "Which is better for restoring old family photos?",
    answer:
      "If you want only photo restoration, Magic Memory is more cost-effective and easier to use. If you are actively doing genealogy research and want integrated photo enhancement inside a family tree platform, MyHeritage makes more sense. They serve different primary use cases — photo tool vs. genealogy suite.",
  },
  {
    question: "Does MyHeritage Photo Enhancer use Remini technology?",
    answer:
      "No. MyHeritage uses its own proprietary photo enhancement and colorization models, including the DeepStory and Deep Nostalgia features built on technology MyHeritage acquired in 2020. Remini is a separate, mobile-first app from Bending Spoons that uses different proprietary models.",
  },
];

export default function MyHeritageAlternativePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Alternatives", url: "/alternatives" },
    { name: "MyHeritage Alternative", url: "/alternatives/myheritage" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[faqJsonLd, breadcrumb]} />
      <Header />
      <main className="flex-1">
        <section className="pb-24 pt-10 md:pb-32 md:pt-14">
          <PageContainer>
          <div className="max-w-4xl">
            <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="mm-underline hover:text-paper">Home</Link>
              <span>/</span>
              <Link href="/alternatives" className="mm-underline hover:text-paper">Alternatives</Link>
              <span>/</span>
              <span className="text-paper">MyHeritage Alternative</span>
            </nav>

            <h1 className="font-serif text-balance mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.02em] text-paper">
              MyHeritage Photo Enhancer Alternative: No Subscription
            </h1>

            <p className="text-lg leading-[1.6] text-paper/70 mb-4">
              Unlimited use of MyHeritage Photo Enhancer comes with the MyHeritage Photo subscription, or with a genealogy plan that includes the photo features (Complete or Omni). Both renew until you cancel. If you only have a few old photos to fix, Magic Memory restores faces with one-time credit packs: €9.99 for 20 photos, and the credits never expire.
            </p>
            <p className="text-sm text-paper/70 mb-10">
              <em>As of 2026-11-16. MyHeritage: its help center articles on the Photo subscription and the Complete plan; prices are on MyHeritage&apos;s plans page. Magic Memory: our own price list.</em>
            </p>

            <div className="rounded-2xl border border-ember/30 bg-ember/5 p-6 mb-10">
              <h2 className="font-serif text-2xl text-paper mb-4">How you get MyHeritage Photo Enhancer</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-semibold">Option</th>
                      <th className="py-2 text-left font-semibold">Photo Enhancer</th>
                      <th className="py-2 text-left font-semibold">Genealogy features</th>
                    </tr>
                  </thead>
                  <tbody className="text-paper/70">
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Free account</td><td className="py-2">No published free limit</td><td className="py-2">Limited</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Photo subscription</td><td className="py-2">Unlimited, with the other AI photo tools</td><td className="py-2">No</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Complete plan</td><td className="py-2">Included (Photo Scanner not included)</td><td className="py-2">Yes</td></tr>
                    <tr><td className="py-2 font-medium text-paper">Omni plan</td><td className="py-2">Included, with everything in the Photo subscription</td><td className="py-2">Yes</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-semibold mb-3">vs. Magic Memory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-semibold"></th>
                      <th className="py-2 text-left font-semibold">MyHeritage Photo Enhancer</th>
                      <th className="py-2 text-left font-semibold text-ember">Magic Memory</th>
                    </tr>
                  </thead>
                  <tbody className="text-paper/70">
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Pricing model</td><td className="py-2">Recurring subscription</td><td className="py-2">One-time credits, never expire</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Price</td><td className="py-2">On MyHeritage&apos;s plans page</td><td className="py-2">€9.99 (20 credits) to €29.99 (120 credits)</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Free tier</td><td className="py-2">Free sign-up; no published limit</td><td className="py-2">None</td></tr>
                    <tr className="border-b border-border"><td className="py-2 font-medium text-paper">Photo-only purchase?</td><td className="py-2">Yes — Photo subscription</td><td className="py-2">Yes — one-time packs</td></tr>
                    <tr><td className="py-2 font-medium text-paper">Per-restoration cost (best pack)</td><td className="py-2">N/A (subscription)</td><td className="py-2">€0.25</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-2">TL;DR</h2>
              <ul className="space-y-2 text-paper/70">
                <li><strong className="text-paper">Magic Memory:</strong> Standalone photo restoration, €9.99–€29.99 one-time, credits never expire</li>
                <li><strong className="text-paper">MyHeritage:</strong> Photo Enhancer with the Photo subscription or the Complete and Omni plans; excellent for genealogy research</li>
              </ul>
            </div>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">The Subscription Problem</h2>
            <p className="text-paper/70 mb-4">
              MyHeritage is genuinely excellent at what it does: genealogy research. The platform has one of the largest genealogy databases in the world, strong DNA testing products, and intuitive family tree tools.
            </p>
            <p className="text-paper/70 mb-4">
              Its photo tools (the Photo Enhancer, colorization and photo animation) come with a recurring subscription: the Photo subscription on its own, or a genealogy plan that includes them. If you have a box of old photos to fix once, you keep paying until you remember to cancel. Magic Memory charges €9.99 once for 20 photos.
            </p>
            <p className="text-paper/70 mb-12">
              Magic Memory is built specifically for photo restoration. There is no subscription and no upsell toward DNA tests.
            </p>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Feature Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="MyHeritage" features={myheritage.features} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-paper mb-3">When Magic Memory makes sense</h3>
                <ul className="space-y-2 text-sm text-paper/70">
                  <li>→ You only want photo restoration, not genealogy tools</li>
                  <li>→ You restore photos occasionally and want pay-per-use</li>
                  <li>→ You already have a genealogy platform you like</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl text-paper mb-3">When MyHeritage makes sense</h3>
                <ul className="space-y-2 text-sm text-paper/70">
                  <li>→ You actively research genealogy and family history</li>
                  <li>→ You want photos integrated with your family tree</li>
                  <li>→ You also want DNA testing and historical records</li>
                </ul>
              </div>
            </div>

            <h2 className="font-serif mb-8 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-4 last:border-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-paper/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-paper/70">
              <Link href="/alternatives" className="mm-underline hover:text-paper">All Alternatives →</Link>
              <Link href="/alternatives/remini" className="mm-underline hover:text-paper">Remini Alternative →</Link>
            </div>
          </div>
          </PageContainer>
        </section>

        <FinalCta
          title={
            <>
              Ready to restore{" "}
              <span className="italic text-paper/55">your memories?</span>
            </>
          }
          note="One-time credit packs. Credits never expire. No subscription."
        />
      </main>
      <Footer />
    </div>
  );
}
