import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "Best AI Photo Restoration Tools — Compared | Magic Memory",
  description:
    "Compare the best AI photo restoration tools: Magic Memory, Remini, MyHeritage, VanceAI, and Fotor. Honest comparison with pricing, features, and who each is best for.",
  alternates: { canonical: getCanonicalUrl("/alternatives") },
  openGraph: {
    title: "Best AI Photo Restoration Tools — Compared",
    description: "Honest comparison of the best AI photo restoration tools in 2026.",
    url: getCanonicalUrl("/alternatives"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Best AI Photo Restoration Tools" }],
  },
  robots: { index: true, follow: true },
};

const tools = [
  {
    name: "Magic Memory",
    url: "/",
    pricing: "Free (1/day) + €9.99–€29.99 one-time credits",
    platform: "Web (any device)",
    bestFor: "One-click portrait restoration, occasional users, privacy-conscious",
    strengths: ["GFPGAN face restoration", "No subscription", "1 free per day", "No photo storage"],
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
      "Magic Memory offers the most generous free tier: 1 restoration per day with no credit card required. This is genuinely unlimited for users who restore photos occasionally. Most competitors offer limited free trials or heavily restricted free tiers.",
  },
  {
    question: "Which AI photo restoration tool has the best face restoration quality?",
    answer:
      "Magic Memory uses GFPGAN (Generative Facial Prior GAN), a model published at CVPR 2021 specifically for face restoration. For portrait and face-focused photos, it consistently delivers strong results. Remini also performs well on faces with its proprietary model. The meaningful differences between top tools are more about pricing and platform than raw quality.",
  },
  {
    question: "Which photo restoration tool is best without a subscription?",
    answer:
      "Magic Memory offers one-time credit packages (€9.99–€29.99) that never expire, plus 1 free restoration per day. This is the only top-tier photo restoration tool with no subscription requirement and a meaningful free tier.",
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

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">AI Photo Restoration Alternatives</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Best AI Photo Restoration Tools — Compared
            </h1>

            <p className="text-lg text-muted-foreground mb-16 max-w-3xl">
              Five AI photo restoration tools tested and compared honestly — including their weaknesses. Find the right tool for your use case, budget, and platform.
            </p>

            <div className="space-y-6 mb-16">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className={`rounded-2xl border p-6 ${
                    tool.highlight
                      ? "border-primary/50 bg-card shadow-md"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{tool.name}</h2>
                        {tool.highlight && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            This site
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tool.pricing}</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{tool.platform}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    <strong className="text-foreground">Best for:</strong> {tool.bestFor}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Strengths</p>
                      <ul className="space-y-1">
                        {tool.strengths.map((s) => (
                          <li key={s} className="text-sm text-muted-foreground">+ {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Limitations</p>
                      <ul className="space-y-1">
                        {tool.weaknesses.map((w) => (
                          <li key={w} className="text-sm text-muted-foreground">- {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Individual Comparisons</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { href: "/alternatives/remini", label: "Remini Alternative" },
                  { href: "/alternatives/myheritage", label: "MyHeritage Alternative" },
                  { href: "/alternatives/vanceai", label: "VanceAI Alternative" },
                  { href: "/vs/remini", label: "Magic Memory vs Remini" },
                  { href: "/blog/best-ai-photo-restoration", label: "Best Tools Deep Dive (Blog)" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-border bg-card p-5 text-sm font-medium hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    {link.label} →
                  </Link>
                ))}
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
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
