import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FinalCta } from "@/components/layout/final-cta";
import { PageContainer } from "@/components/layout/page-container";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { listicleItemListJsonLd } from "@/lib/seo/listicle-schema";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "AI Photo Restoration Alternatives Compared (2026)",
  description:
    "Alternatives to Remini, MyHeritage Photo Enhancer and VanceAI: 5 AI photo restoration tools compared by pricing model, platform, strengths and limits.",
  alternates: { canonical: getCanonicalUrl("/alternatives") },
  openGraph: {
    title: "AI Photo Restoration Alternatives Compared (2026)",
    description:
      "Alternatives to Remini, MyHeritage Photo Enhancer and VanceAI: 5 AI photo restoration tools compared by pricing model, platform, strengths and limits.",
    url: getCanonicalUrl("/alternatives"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "AI Photo Restoration Alternatives Compared" }],
  },
  robots: { index: true, follow: true },
};

const tools = [
  {
    name: "Magic Memory",
    url: "/",
    pricing: "€9.99–€29.99 one-time credits (never expire)",
    platform: "Web (any device)",
    bestFor: "One-click portrait restoration, occasional users, privacy-conscious",
    strengths: ["GFPGAN face restoration", "No subscription", "Credits never expire", "No photo storage"],
    weaknesses: ["No mobile app", "No batch processing", "Portraits only"],
    highlight: true,
  },
  {
    name: "Remini",
    url: "https://remini.ai",
    pricing: "$9.99/week subscription",
    platform: "iOS and Android",
    bestFor: "Mobile users who want an app with editing features",
    strengths: ["Large user base", "Video enhancement", "Editing tools"],
    weaknesses: ["Weekly subscription", "Mobile only", "Cloud photo storage"],
    highlight: false,
  },
  {
    name: "MyHeritage Photo Enhancer",
    url: "https://myheritage.com",
    pricing: "Bundled with genealogy subscription ($119–$259/year)",
    platform: "Web",
    bestFor: "Genealogy researchers who also want photo restoration",
    strengths: ["Integrated with genealogy", "Family tree connection", "Large genealogy database"],
    weaknesses: ["Requires genealogy subscription", "Expensive for photo-only use"],
    highlight: false,
  },
  {
    name: "VanceAI",
    url: "https://vanceai.com",
    pricing: "From $4.95/month or credit packs",
    platform: "Web and desktop",
    bestFor: "Professionals who need multiple AI image tools",
    strengths: ["Many AI tools", "Batch processing", "Professional control"],
    weaknesses: ["Complex interface", "Overkill for simple restoration"],
    highlight: false,
  },
  {
    name: "Fotor",
    url: "https://fotor.com",
    pricing: "Free tier + Pro from $3.33/month",
    platform: "Web and desktop",
    bestFor: "Users who want photo editing plus basic AI enhancement",
    strengths: ["Full photo editor", "Many templates", "Easy interface"],
    weaknesses: ["AI restoration less specialized than GFPGAN", "Many non-restoration features"],
    highlight: false,
  },
];

const faqs: FAQItem[] = [
  {
    question: "What is the best free AI photo restoration tool?",
    answer:
      "Magic Memory has no free tier: each restoration uses one credit from a one-time pack (from €9.99 for 20), and a failed restoration costs no credit. Most competitors offer limited free trials or heavily restricted free tiers; the pricing column above lists each tool's.",
  },
  {
    question: "Which AI photo restoration tool has the best face restoration quality?",
    answer:
      "Magic Memory uses GFPGAN (Generative Facial Prior GAN), a model published at CVPR 2021 specifically for face restoration. For portrait and face-focused photos, it consistently delivers strong results. Remini also performs well on faces with its proprietary model. The meaningful differences between top tools are more about pricing and platform than raw quality.",
  },
  {
    question: "Which photo restoration tool is best without a subscription?",
    answer:
      "Magic Memory sells one-time credit packs (€9.99–€29.99) that never expire, with no subscription. Check each competitor's pricing column above for whether it needs a subscription.",
  },
  {
    question: "What is the most private AI photo restoration tool?",
    answer:
      "Magic Memory does not retain photos after processing. Photos are handled for the restoration process and then deleted — there is no cloud photo library. This is the most privacy-respecting approach among major photo restoration tools.",
  },
];

export default function AlternativesPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "AI Photo Restoration Alternatives", url: "/alternatives" },
  ]);
  const itemList = listicleItemListJsonLd("best-ai-photo-restoration");

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {itemList && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      )}
      <Header />
      <main className="flex-1">
        <section className="pb-24 pt-10 md:pb-32 md:pt-14">
          <PageContainer>
          <div className="max-w-5xl">
            <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="mm-underline hover:text-paper">Home</Link>
              <span>/</span>
              <span className="text-paper">AI Photo Restoration Alternatives</span>
            </nav>

            <h1 className="font-serif text-balance mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.02em] text-paper">
              AI Photo Restoration Alternatives Compared
            </h1>

            <p className="text-lg leading-[1.6] text-paper/70 mb-16 max-w-3xl">
              Looking for an alternative to Remini, MyHeritage Photo Enhancer or VanceAI? Below are five AI photo restoration tools side by side, with each one&apos;s pricing model, platform, strengths and limits, including ours. For a longer review of each tool, read our{" "}
              <Link href="/blog/best-ai-photo-restoration" className="mm-underline text-paper/80 hover:text-paper">
                best AI photo restoration tools
              </Link>{" "}
              guide. Competitor details last verified 2026-05-19.
            </p>

            <div className="space-y-6 mb-16">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className={`rounded-2xl border p-6 ${
                    tool.highlight
                      ? "border-ember/50 bg-card "
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-2xl text-paper">{tool.name}</h2>
                        {tool.highlight && (
                          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-xs font-medium text-ember">
                            This site
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-paper/70 mt-1">{tool.pricing}</p>
                    </div>
                    <span className="text-xs text-paper/70 bg-paper/10 px-2 py-1 rounded">{tool.platform}</span>
                  </div>

                  <p className="text-sm text-paper/70 mb-4">
                    <strong className="text-paper">Best for:</strong> {tool.bestFor}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ember mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {tool.strengths.map((s) => (
                          <li key={s} className="text-sm text-paper/70">+ {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-paper/70 mb-2">Limitations</p>
                      <ul className="space-y-1">
                        {tool.weaknesses.map((w) => (
                          <li key={w} className="text-sm text-paper/70">- {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="font-serif mb-6 text-3xl leading-[1.05] tracking-[-0.01em] text-paper md:text-4xl">Individual Comparisons</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { href: "/alternatives/remini", label: "Remini Alternative" },
                  { href: "/alternatives/myheritage", label: "MyHeritage Alternative" },
                  { href: "/alternatives/vanceai", label: "VanceAI Alternative" },
                  { href: "/vs/remini", label: "Magic Memory vs Remini" },
                  { href: "/blog/best-ai-photo-restoration", label: "Best AI photo restoration tools" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-border bg-card p-5 text-sm font-medium transition-colors hover:border-ember/50"
                  >
                    {link.label} →
                  </Link>
                ))}
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
