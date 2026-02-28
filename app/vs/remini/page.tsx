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
  title: "Magic Memory vs Remini — Which Should You Choose?",
  description:
    "Detailed comparison of Magic Memory vs Remini for AI photo restoration. Compare pricing, platform, privacy, restoration quality, and free tier. Choose the right tool.",
  alternates: { canonical: getCanonicalUrl("/vs/remini") },
  openGraph: {
    title: "Magic Memory vs Remini — Which Should You Choose?",
    description: "Magic Memory vs Remini detailed comparison. Web vs mobile, one-time vs subscription.",
    url: getCanonicalUrl("/vs/remini"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Magic Memory vs Remini" }],
  },
  robots: { index: true, follow: true },
};

const remini = competitors.remini;

const faqs: FAQItem[] = [
  {
    question: "Magic Memory vs Remini: which has better photo restoration quality?",
    answer:
      "Both deliver strong face restoration results. Magic Memory uses GFPGAN, a model published in peer-reviewed research (CVPR 2021) specifically designed for face restoration. Remini uses a proprietary model. For portrait and face restoration specifically, both produce high-quality results. The meaningful differences are in pricing, platform, and privacy, not restoration quality.",
  },
  {
    question: "Which is cheaper: Magic Memory or Remini?",
    answer:
      "For most users, Magic Memory is cheaper. Remini charges $9.99/week. Magic Memory's smallest credit package is €9.99 for 30 credits (one-time, never expires), plus 1 free restoration per day. A user who restores 10 photos per month would pay $43/month on Remini versus roughly €10 every few months on Magic Memory.",
  },
  {
    question: "Can you use Magic Memory on iPhone?",
    answer:
      "Yes. Magic Memory is a web app that works in Safari on iPhone. No app download required. Go to the website, sign in with Google, and upload photos directly from your camera roll. This is the key difference from Remini, which requires the iOS or Android app.",
  },
  {
    question: "Does Remini or Magic Memory have a better free tier?",
    answer:
      "Magic Memory gives 1 free restoration per day, every day, with no credit card required. Remini offers limited free trials. Magic Memory's free tier is more generous for casual, occasional use.",
  },
  {
    question: "Is there a reason to use both?",
    answer:
      "Some users use Magic Memory for its free daily restoration on web, and Remini for its mobile app editing features when they want additional photo manipulation. They are not mutually exclusive — they serve somewhat different use cases.",
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
              Magic Memory vs Remini — Which Should You Choose?
            </h1>

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
