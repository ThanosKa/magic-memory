import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { ComparisonTable } from "@/components/competitor/comparison-table";
import { competitors } from "@/lib/competitors/data";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "MyHeritage Photo Enhancer Alternative — Magic Memory",
  description:
    "Looking for a MyHeritage photo enhancer alternative? Magic Memory offers standalone photo restoration without a genealogy subscription. Compare features and pricing.",
  alternates: { canonical: getCanonicalUrl("/alternatives/myheritage") },
  openGraph: {
    title: "MyHeritage Photo Enhancer Alternative — Magic Memory",
    description: "Standalone photo restoration without a genealogy subscription. Compare Magic Memory vs MyHeritage.",
    url: getCanonicalUrl("/alternatives/myheritage"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "MyHeritage Alternative" }],
  },
  robots: { index: true, follow: true },
};

const myheritage = competitors.myheritage;

const faqs: FAQItem[] = [
  {
    question: "Do I need a genealogy subscription to use MyHeritage photo enhancement?",
    answer:
      "MyHeritage's photo enhancement features are bundled with its genealogy service. While they offer limited free trials, meaningful use of photo enhancement typically requires a subscription that includes genealogy features. If you only want photo restoration, you pay for features you do not use.",
  },
  {
    question: "Does Magic Memory offer genealogy features?",
    answer:
      "No. Magic Memory is a standalone photo restoration tool. It does not include genealogy, DNA testing, or family tree features. This makes it significantly cheaper for users who only want photo restoration.",
  },
  {
    question: "Which is better for restoring old family photos?",
    answer:
      "If you want only photo restoration, Magic Memory is more cost-effective. If you are actively doing genealogy research and want integrated photo enhancement within a family tree platform, MyHeritage makes more sense. They serve different primary use cases.",
  },
  {
    question: "Can I use Magic Memory for genealogy-related photo restoration?",
    answer:
      "Yes. Many genealogists use Magic Memory to restore photos of ancestors that they then attach to family trees in separate genealogy platforms (Ancestry, MyHeritage, FamilySearch). You are not limited to one tool.",
  },
  {
    question: "How does Magic Memory pricing compare to MyHeritage?",
    answer:
      "Magic Memory offers one-time credit packages (€9.99–€29.99) with no subscription and 1 free restoration per day. MyHeritage photo enhancement is bundled into genealogy subscriptions that typically cost $119–$259 per year. For photo restoration only, Magic Memory is substantially cheaper.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/alternatives" className="hover:text-foreground">Alternatives</Link>
              <span>/</span>
              <span className="text-foreground">MyHeritage Alternative</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              MyHeritage Photo Enhancer Alternative — Magic Memory
            </h1>

            <p className="text-lg text-muted-foreground mb-12">
              MyHeritage bundles photo enhancement with genealogy subscriptions. If you only want photo restoration without the DNA kits, family trees, and genealogy database, you are paying for features you do not need.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-2">TL;DR</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Magic Memory:</strong> Standalone photo restoration, €9.99–€29.99 one-time, 1 free/day</li>
                <li><strong className="text-foreground">MyHeritage:</strong> Photo enhancement bundled in genealogy subscription ($119–$259/year), excellent for genealogy research</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">The MyHeritage Bundle Problem</h2>
            <p className="text-muted-foreground mb-4">
              MyHeritage is genuinely excellent at what it does: genealogy research. The platform has one of the largest genealogy databases in the world, strong DNA testing products, and intuitive family tree tools.
            </p>
            <p className="text-muted-foreground mb-4">
              But its photo enhancement feature — MyHeritage In Color, DeepNostalgia, and photo enhancer — are sold as part of the genealogy package. If you do not need genealogy tools, you pay $119–$259/year for a photo enhancement feature you could access for €9.99 one-time.
            </p>
            <p className="text-muted-foreground mb-12">
              Magic Memory is built specifically for photo restoration. There is no genealogy bundling, no subscription, no upsell toward DNA tests.
            </p>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Feature Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="MyHeritage" features={myheritage.features} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">When Magic Memory makes sense</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ You only want photo restoration, not genealogy tools</li>
                  <li>→ You restore photos occasionally and want pay-per-use</li>
                  <li>→ You already have a genealogy platform you like</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">When MyHeritage makes sense</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>→ You actively research genealogy and family history</li>
                  <li>→ You want photos integrated with your family tree</li>
                  <li>→ You also want DNA testing and historical records</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-border pb-4 last:border-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link href="/alternatives" className="hover:text-foreground">All Alternatives →</Link>
              <Link href="/alternatives/remini" className="hover:text-foreground">Remini Alternative →</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
