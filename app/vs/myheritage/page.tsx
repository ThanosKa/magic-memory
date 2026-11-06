import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FinalCta } from "@/components/layout/final-cta";
import { PageContainer } from "@/components/layout/page-container";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { ComparisonTable } from "@/components/competitor/comparison-table";
import { competitors } from "@/lib/competitors/data";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "Magic Memory vs MyHeritage Photo Enhancer — Which Is Better?",
  description:
    "Compare Magic Memory and MyHeritage Photo Enhancer for AI photo restoration. Magic Memory is a standalone tool from €9.99. MyHeritage bundles photo enhancement into a genealogy subscription. See which fits your needs.",
  alternates: { canonical: getCanonicalUrl("/vs/myheritage") },
  openGraph: {
    title: "Magic Memory vs MyHeritage Photo Enhancer — Which Is Better?",
    description: "Standalone AI photo restoration vs genealogy-bundled enhancer. Compare pricing, features, and privacy.",
    url: getCanonicalUrl("/vs/myheritage"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Magic Memory vs MyHeritage" }],
  },
  robots: { index: true, follow: true },
};

const myheritage = competitors.myheritage;

const faqs: FAQItem[] = [
  {
    question: "Is Magic Memory or MyHeritage better for photo restoration?",
    answer:
      "If you only need photo restoration, Magic Memory is the better choice. It is a standalone tool built specifically for restoring old photos using GFPGAN AI. MyHeritage bundles photo enhancement into a full genealogy subscription, which is significantly more expensive if photo restoration is all you need.",
  },
  {
    question: "How much does MyHeritage photo restoration cost vs Magic Memory?",
    answer:
      "Magic Memory offers one-time credit packages starting at €9.99 for 20 restorations, and the credits never expire. MyHeritage requires a genealogy subscription that starts at around $13/month. If you only want photo restoration, Magic Memory is substantially cheaper.",
  },
  {
    question: "Does MyHeritage store my photos?",
    answer:
      "Yes, MyHeritage stores photos in your account as part of its family tree features. Magic Memory does not persistently store any uploaded or restored photos — images are processed in memory and discarded after restoration.",
  },
  {
    question: "Can I use MyHeritage just for photo restoration?",
    answer:
      "Technically yes, but the photo enhancement feature is locked behind a genealogy subscription. You would be paying for family tree tools, DNA matching, and historical records that you may not need. Magic Memory is purpose-built for photo restoration only.",
  },
  {
    question: "Which has better restoration quality?",
    answer:
      "Both produce good results for face restoration. Magic Memory uses GFPGAN, a research-grade model from CVPR 2021 specifically designed for face restoration. MyHeritage uses its own proprietary model. For most old family photos, both deliver noticeable improvement.",
  },
];

export default function VsMyHeritagePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Magic Memory vs MyHeritage", url: "/vs/myheritage" },
  ]);

  const detailedComparison = [
    {
      category: "Pricing model",
      magicMemory: "One-time credits (€9.99–€29.99), credits never expire",
      competitor: "Monthly genealogy subscription (~$13/month)",
    },
    {
      category: "Platform",
      magicMemory: "Web app — any device, any browser, no download",
      competitor: "Web and mobile app",
    },
    {
      category: "Privacy",
      magicMemory: "No persistent photo storage after processing",
      competitor: "Photos stored in your genealogy account",
    },
    {
      category: "Free tier",
      magicMemory: "None (a failed restoration costs no credit)",
      competitor: "Very limited free trial",
    },
    {
      category: "Focus",
      magicMemory: "Dedicated photo restoration tool",
      competitor: "Photo enhancement bundled with genealogy platform",
    },
    {
      category: "Standalone photo tool",
      magicMemory: "Yes — purpose-built for restoration",
      competitor: "No — requires full genealogy subscription",
    },
    {
      category: "Additional features",
      magicMemory: "Single-purpose: upload, restore, download",
      competitor: "Family trees, DNA matching, historical records",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <section className="pb-24 pt-10 md:pb-32 md:pt-14">
          <PageContainer>
          <div className="max-w-4xl">
            <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="mm-underline hover:text-paper">Home</Link>
              <span>/</span>
              <span className="text-paper">Magic Memory vs MyHeritage</span>
            </nav>

            <h1 className="font-serif text-balance mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.02em] text-paper">
              Magic Memory vs MyHeritage Photo Enhancer
            </h1>

            <p className="text-lg leading-[1.6] text-paper/70 mb-8">
              MyHeritage is a genealogy platform that includes photo enhancement as a bundled feature. Magic Memory is a standalone AI photo restoration tool. If you only need photo restoration, the choice is straightforward.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">TL;DR</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-ember mb-2">Choose Magic Memory if you:</p>
                  <ul className="space-y-1 text-sm text-paper/70">
                    <li>→ Only need photo restoration</li>
                    <li>→ Want affordable, pay-as-you-go pricing</li>
                    <li>→ Prefer no photo storage (privacy-first)</li>
                    <li>→ Want credits that never expire</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Choose MyHeritage if you:</p>
                  <ul className="space-y-1 text-sm text-paper/70">
                    <li>→ Already have a MyHeritage subscription</li>
                    <li>→ Want genealogy + photo tools in one place</li>
                    <li>→ Need family tree building features</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Quick Comparison</h2>
            <div className="mb-12">
              <ComparisonTable competitorName="MyHeritage" features={myheritage.features} />
            </div>

            <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Detailed Comparison</h2>
            <div className="space-y-6 mb-12">
              {detailedComparison.map((row) => (
                <div key={row.category} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold mb-3">{row.category}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-ember mb-1 uppercase tracking-wide">Magic Memory</p>
                      <p className="text-sm text-paper/70">{row.magicMemory}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide text-paper/70">MyHeritage</p>
                      <p className="text-sm text-paper/70">{row.competitor}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <Link href="/alternatives/myheritage" className="mm-underline hover:text-paper">MyHeritage Alternative →</Link>
              <Link href="/alternatives" className="mm-underline hover:text-paper">All Alternatives →</Link>
              <Link href="/vs/remini" className="mm-underline hover:text-paper">Magic Memory vs Remini →</Link>
              <Link href="/pricing" className="mm-underline hover:text-paper">View Magic Memory Pricing →</Link>
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
