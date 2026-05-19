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
  title: "Remini vs Magic Memory vs MyHeritage 2026: Pricing, Free Tiers & Quality",
  description:
    "Remini $9.99/wk vs MyHeritage $119–$259/yr vs Magic Memory 1 free/day + €9.99 one-time. Side-by-side 2026 comparison on pricing, free-tier limits, platform, restoration quality, and privacy. See which AI photo restoration tool fits your needs.",
  alternates: { canonical: getCanonicalUrl("/vs/remini") },
  openGraph: {
    title: "Remini vs Magic Memory vs MyHeritage 2026 — Pricing & Free Tiers",
    description: "Pricing, free tiers, and platform comparison for the three most-searched AI photo restoration tools in 2026.",
    url: getCanonicalUrl("/vs/remini"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Magic Memory vs Remini vs MyHeritage" }],
  },
  robots: { index: true, follow: true },
};

const remini = competitors.remini;

const faqs: FAQItem[] = [
  {
    question: "Remini vs MyHeritage Photo Enhancer in 2026: which is better?",
    answer:
      "Remini is the better pick if you want a mobile app with strong daily-use enhancement features and don't mind a $9.99/week subscription. MyHeritage Photo Enhancer is better if you're already paying for MyHeritage genealogy ($119–$259/yr) and want photo enhancement bundled in. Neither is the cheapest option for users who only want photo restoration — that's typically Magic Memory at 1 free/day plus €9.99 one-time for 30 credits.",
  },
  {
    question: "Remini vs Magic Memory: which has better photo restoration quality?",
    answer:
      "Both deliver strong face restoration results. Magic Memory uses GFPGAN, a model published in peer-reviewed research (CVPR 2021) specifically designed for face restoration. Remini uses a proprietary model. For portrait and face restoration specifically, both produce high-quality results. The meaningful differences are pricing, platform, and privacy — not raw restoration quality.",
  },
  {
    question: "Which is cheaper for 10–20 photos: Remini, MyHeritage, or Magic Memory?",
    answer:
      "Magic Memory is the cheapest by a wide margin. A user restoring 10–20 photos per month would pay roughly $43/month on Remini ($9.99/week × 4.3 weeks), $119+/year on MyHeritage (annual subscription required), or €0 on Magic Memory (covered by the daily free tier) — even 50 photos would only cost €9.99 on the smallest Magic Memory credit pack.",
  },
  {
    question: "Can you use Magic Memory or Remini on iPhone?",
    answer:
      "Magic Memory works in Safari on iPhone — no app download required. Sign in with Google and upload photos directly from your camera roll. Remini requires the iOS or Android app. MyHeritage has a mobile app but the photo enhancer also works in the browser if you have a paid plan.",
  },
  {
    question: "Does Remini or Magic Memory have a better free tier?",
    answer:
      "Magic Memory's free tier is more generous: 1 restoration per day, every day, with no credit card. Remini offers limited free trials (typically ~3 enhances before paywall). For users who restore one or two photos per week, Magic Memory's free tier is effectively unlimited.",
  },
  {
    question: "Is Magic Memory a Remini alternative?",
    answer:
      "Yes — Magic Memory is the leading non-subscription, web-based alternative to Remini for AI face restoration. The differences: Magic Memory is web (any device), Remini is mobile-only; Magic Memory is one-time credits + free daily, Remini is $9.99/week subscription; Magic Memory does not retain photos after processing, Remini stores them in your cloud account.",
  },
];

export default function VsReminiPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Magic Memory vs Remini", url: "/vs/remini" },
  ]);

  const detailedComparison = [
    {
      category: "Pricing model",
      magicMemory: "One-time credits (€9.99–€29.99), credits never expire",
      remini: "$9.99/week recurring subscription",
    },
    {
      category: "Platform",
      magicMemory: "Web app — any device, any browser, no download",
      remini: "iOS and Android app — mobile only",
    },
    {
      category: "Privacy",
      magicMemory: "No persistent photo storage after processing",
      remini: "Photos stored in cloud account",
    },
    {
      category: "Free tier",
      magicMemory: "1 restoration per day, no credit card required",
      remini: "Limited free trial",
    },
    {
      category: "Restoration quality",
      magicMemory: "GFPGAN — research-grade face restoration",
      remini: "Proprietary model — strong face enhancement",
    },
    {
      category: "Editing features",
      magicMemory: "Restoration only — upload, restore, download",
      remini: "Restoration plus editing tools and filters",
    },
    {
      category: "Video enhancement",
      magicMemory: "Not available",
      remini: "Available",
    },
  ];

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
              <span className="text-foreground">Magic Memory vs Remini</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Remini vs Magic Memory vs MyHeritage Photo Enhancer (2026)
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              The three most-searched AI photo restoration tools in 2026, compared on the dimensions that actually matter for occasional users: <strong>price for 10–20 photos</strong>, <strong>free-tier limits</strong>, <strong>platform</strong>, and <strong>where your photos end up</strong>. <em>Pricing verified 2026-05-19.</em>
            </p>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-10 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Quick three-way table</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-semibold"></th>
                    <th className="py-2 text-left font-semibold text-primary">Magic Memory</th>
                    <th className="py-2 text-left font-semibold">Remini</th>
                    <th className="py-2 text-left font-semibold">MyHeritage</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Cheapest paid</td><td className="py-2">€9.99 one-time</td><td className="py-2">$9.99/week</td><td className="py-2">$119/year</td></tr>
                  <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Free tier</td><td className="py-2">1/day, no card</td><td className="py-2">~3 enhances</td><td className="py-2">Watermarked preview</td></tr>
                  <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Platform</td><td className="py-2">Web (any device)</td><td className="py-2">iOS/Android only</td><td className="py-2">Web</td></tr>
                  <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Bundled with…</td><td className="py-2">Nothing</td><td className="py-2">Video enhancer</td><td className="py-2">Genealogy plan</td></tr>
                  <tr><td className="py-2 font-medium text-foreground">Photos stored?</td><td className="py-2">No</td><td className="py-2">Yes — cloud</td><td className="py-2">Yes — account</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-primary mb-2">Choose Magic Memory if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>→ Want web access on any device</li>
                    <li>→ Restore photos occasionally</li>
                    <li>→ Prefer one-time payment</li>
                    <li>→ Value photo privacy</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose Remini if you:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>→ Want a full mobile editing app</li>
                    <li>→ Need video enhancement</li>
                    <li>→ Use it daily (subscription value)</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Quick Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="Remini" features={remini.features} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-6">Detailed Comparison</h2>
            <div className="space-y-6 mb-12">
              {detailedComparison.map((row) => (
                <div key={row.category} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-3">{row.category}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">Magic Memory</p>
                      <p className="text-sm text-muted-foreground">{row.magicMemory}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">Remini</p>
                      <p className="text-sm text-muted-foreground">{row.remini}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <Link href="/alternatives/remini" className="hover:text-foreground">Remini Alternative →</Link>
              <Link href="/alternatives" className="hover:text-foreground">All Alternatives →</Link>
              <Link href="/pricing" className="hover:text-foreground">View Magic Memory Pricing →</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
