import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "AI Photo Enhancement for Real Estate — Improve Listing Photos",
  description:
    "Enhance real estate listing photos with AI. Magic Memory uses GFPGAN to sharpen faces in agent headshots and team photos. Improve photo quality for property listings, agent profiles, and marketing materials.",
  alternates: { canonical: getCanonicalUrl("/for/real-estate") },
  openGraph: {
    title: "AI Photo Enhancement for Real Estate — Improve Listing Photos",
    description: "Enhance agent headshots and team photos for real estate listings with GFPGAN AI.",
    url: getCanonicalUrl("/for/real-estate"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Photo Enhancement for Real Estate" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI enhance real estate listing photos?",
    answer:
      "Magic Memory specializes in face restoration using GFPGAN, which is ideal for agent headshots, team photos, and portrait-style images on listing pages. For property photos specifically (interiors, exteriors), general image upscaling tools like Real-ESRGAN may be more appropriate, as GFPGAN targets faces.",
  },
  {
    question: "How can real estate agents use AI photo restoration?",
    answer:
      "Real estate agents can use AI face restoration for professional headshots, team page photos, social media profile images, and marketing materials. If your headshot is outdated, low-resolution, or taken with a phone camera, GFPGAN can sharpen facial detail to make it look more professional.",
  },
  {
    question: "Does Magic Memory work on property photos?",
    answer:
      "Magic Memory uses GFPGAN, which specifically restores faces. It will not improve property photos that do not contain faces. For agent headshots, team photos, and client testimonial photos, it works very well. For property interiors and exteriors, a general image enhancement tool would be more suitable.",
  },
  {
    question: "Is this suitable for a real estate team?",
    answer:
      "Yes. A credit pack of 30 restorations (\u20ac9.99) is enough to enhance headshots for an entire real estate office. Credits never expire, so you can process new team member photos as they join. Each photo is processed in under 15 seconds with no technical skill required.",
  },
];

export default function ForRealEstatePage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "For Real Estate", url: "/for/real-estate" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">For Real Estate</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              Photo Enhancement for Real Estate Professionals
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Your headshot is on every listing, every business card, and every email signature. If it was taken with a phone camera three years ago, it is costing you credibility. Magic Memory uses GFPGAN AI to sharpen faces in photos — turning a mediocre headshot into a crisp, professional portrait in under 15 seconds.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Use Cases for Real Estate</h2>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Agent headshots</h3>
                    <p className="text-sm text-muted-foreground">Sharpen and enhance agent portrait photos for listing pages, business cards, email signatures, and social media profiles. GFPGAN recovers facial detail that phone cameras and poor lighting miss.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Team page photos</h3>
                    <p className="text-sm text-muted-foreground">When different team members submitted photos at different qualities and resolutions, AI restoration brings them all up to a consistent, professional standard. Process an entire team page in minutes.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Marketing materials</h3>
                    <p className="text-sm text-muted-foreground">Brochures, flyers, and digital ads need sharp portrait photos. If your source photo is low-resolution, AI face restoration can produce a print-ready version without a reshoot.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Historical property documentation</h3>
                    <p className="text-sm text-muted-foreground">For historical properties with old photos of previous owners or historical figures, AI restoration can sharpen those faces for marketing materials that tell the property&apos;s story.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">How It Works</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">1.</span> <strong className="text-foreground">Upload your headshot or team photo</strong> — JPEG, PNG, or WebP up to 10MB. Works from any device.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">2.</span> <strong className="text-foreground">AI enhances the face</strong> — GFPGAN sharpens facial features, reduces noise, and improves detail in 5-15 seconds.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">3.</span> <strong className="text-foreground">Download and use</strong> — Get the enhanced version in full resolution. Use it on listings, business cards, and marketing materials.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Pricing for Real Estate Teams</h2>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="font-semibold mb-1">Solo agent</p>
                      <p className="text-sm text-muted-foreground">1 free restoration per day. Enough for trying the tool and processing a few headshots over time.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Small team (5-20 agents)</p>
                      <p className="text-sm text-muted-foreground">{"\u20ac"}9.99 for 30 credits. Process every team member&apos;s headshot plus marketing materials.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Large brokerage</p>
                      <p className="text-sm text-muted-foreground">Multiple credit packs as needed. Credits never expire — use them as new agents join.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Important Note</h2>
                <p className="text-muted-foreground">
                  Magic Memory uses GFPGAN, which specifically restores and enhances faces. It is ideal for headshots, team photos, and any image where faces are the primary subject. For property interior and exterior photos, a general image enhancement tool would be more appropriate. We focus on doing one thing well — face restoration.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Enhance Your Agent Headshot</h2>
              <p className="text-muted-foreground mb-4">
                Upload your current headshot and see what AI face restoration can do. 1 free enhancement per day, no credit card required. Results in under 15 seconds.
              </p>
              <Link
                href="/restore"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Enhance your headshot now
              </Link>
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
              <Link href="/restore-portrait-photos" className="hover:text-foreground">Restore Portrait Photos</Link>
              <Link href="/glossary/face-restoration" className="hover:text-foreground">What Is Face Restoration?</Link>
              <Link href="/glossary/ai-photo-enhancement" className="hover:text-foreground">What Is AI Photo Enhancement?</Link>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
