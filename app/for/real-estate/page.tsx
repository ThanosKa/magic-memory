import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";
import { PageContainer } from "@/components/layout/page-container";
import { FinalCta } from "@/components/layout/final-cta";
import { Button, ButtonArrow } from "@/components/ui/button";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

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
      "Yes. A credit pack of 20 restorations (\u20ac9.99) is enough to enhance headshots for an entire real estate office. Credits never expire, so you can process new team member photos as they join. Each photo is processed in under 15 seconds with no technical skill required.",
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
        <section>
          <PageContainer className="py-20 sm:py-32">
          <div className="max-w-3xl">
            <nav className="font-mono mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
              <Link href="/" className="focus-ring rounded-sm hover:text-paper">Home</Link>
              <span>/</span>
              <span className="text-paper">For Real Estate</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              Photo Enhancement for Real Estate Professionals
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              Your headshot is on every listing, every business card, and every email signature. If it was taken with a phone camera three years ago, it is costing you credibility. Magic Memory uses GFPGAN AI to sharpen faces in photos — turning a mediocre headshot into a crisp, professional portrait in under 15 seconds.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Use Cases for Real Estate</h2>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Agent headshots</h3>
                    <p className="text-sm text-paper/70">Sharpen and enhance agent portrait photos for listing pages, business cards, email signatures, and social media profiles. GFPGAN recovers facial detail that phone cameras and poor lighting miss.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Team page photos</h3>
                    <p className="text-sm text-paper/70">When different team members submitted photos at different qualities and resolutions, AI restoration brings them all up to a consistent, professional standard. Process an entire team page in minutes.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Marketing materials</h3>
                    <p className="text-sm text-paper/70">Brochures, flyers, and digital ads need sharp portrait photos. If your source photo is low-resolution, AI face restoration can produce a print-ready version without a reshoot.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Historical property documentation</h3>
                    <p className="text-sm text-paper/70">For historical properties with old photos of previous owners or historical figures, AI restoration can sharpen those faces for marketing materials that tell the property&apos;s story.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">How It Works</h2>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">1.</span> <strong className="text-paper">Upload your headshot or team photo</strong> — JPEG, PNG, or WebP up to 10MB. Works from any device.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">2.</span> <strong className="text-paper">AI enhances the face</strong> — GFPGAN sharpens facial features, reduces noise, and improves detail in 5-15 seconds.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">3.</span> <strong className="text-paper">Download and use</strong> — Get the enhanced version in full resolution. Use it on listings, business cards, and marketing materials.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Pricing for Real Estate Teams</h2>
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="font-semibold text-paper mb-1">Solo agent</p>
                      <p className="text-sm text-paper/70">1 free restoration per day. Enough for trying the tool and processing a few headshots over time.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-paper mb-1">Small team (5-20 agents)</p>
                      <p className="text-sm text-paper/70">{"\u20ac"}9.99 for 20 credits. Process every team member&apos;s headshot plus marketing materials.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-paper mb-1">Large brokerage</p>
                      <p className="text-sm text-paper/70">Multiple credit packs as needed. Credits never expire — use them as new agents join.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Important Note</h2>
                <p className="text-paper/70">
                  Magic Memory uses GFPGAN, which specifically restores and enhances faces. It is ideal for headshots, team photos, and any image where faces are the primary subject. For property interior and exterior photos, a general image enhancement tool would be more appropriate. We focus on doing one thing well — face restoration.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Enhance Your Agent Headshot</h2>
              <p className="text-paper/70 mb-4">
                Upload your current headshot and see what AI face restoration can do. 1 free enhancement per day, no credit card required. Results in under 15 seconds.
              </p>
              <Button asChild>
                <Link href="/restore">
                  Enhance your headshot now
                  <ButtonArrow />
                </Link>
              </Button>
            </div>

            <h2 className="font-serif text-4xl tracking-[-0.01em] text-paper mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-12">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-paper/10 pb-4 last:border-0">
                  <h3 className="font-semibold text-paper mb-2">{faq.question}</h3>
                  <p className="text-paper/70 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-paper/70">
              <Link href="/restore-portrait-photos" className="hover:text-paper">Restore Portrait Photos</Link>
              <Link href="/glossary/face-restoration" className="hover:text-paper">What Is Face Restoration?</Link>
              <Link href="/glossary/ai-photo-enhancement" className="hover:text-paper">What Is AI Photo Enhancement?</Link>
              <Link href="/pricing" className="hover:text-paper">Pricing</Link>
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
          note="Start with your free daily restoration. No credit card required."
        />
      </main>
      <Footer />
    </div>
  );
}
