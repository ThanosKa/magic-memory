import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";
import { ArticleHeading } from "@/components/layout/article-heading";
import { PageContainer } from "@/components/layout/page-container";
import { FinalCta } from "@/components/layout/final-cta";
import { Button, ButtonArrow } from "@/components/ui/button";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "AI Photo Restoration for Photographers — Fix Old Client Photos",
  description:
    "Restore old and degraded client photos with GFPGAN AI. Magic Memory helps photographers rescue blurry portraits, fix damaged prints, and deliver restored versions to clients. 1 free restoration per day.",
  alternates: { canonical: getCanonicalUrl("/for/photographers") },
  openGraph: {
    title: "AI Photo Restoration for Photographers — Fix Old Client Photos",
    description: "Restore old client photos with GFPGAN AI. Fix blurry portraits and damaged prints in seconds.",
    url: getCanonicalUrl("/for/photographers"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Photo Restoration for Photographers" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can photographers use AI restoration on client photos?",
    answer:
      "Yes. AI restoration is a useful tool for photographers when clients bring in old or damaged photos that need improvement. GFPGAN handles face restoration that would take hours of manual retouching. You can use it as a starting point and refine the result in Photoshop or Lightroom if needed.",
  },
  {
    question: "Will AI restoration match my editing style?",
    answer:
      "GFPGAN produces a clean, natural-looking face restoration. It does not apply color grading, film emulation, or stylistic effects. The output is a neutral restored face that you can then edit with your own presets, color grading, and style adjustments in your preferred editing software.",
  },
  {
    question: "Does Magic Memory support RAW files?",
    answer:
      "Magic Memory supports JPEG, PNG, and WebP files up to 10MB. For RAW files, export as JPEG or PNG from your editing software first, then upload for face restoration. This workflow gives you full control over exposure and color before the AI handles face detail.",
  },
  {
    question: "Can I offer photo restoration as a service to clients?",
    answer:
      "Yes. Many photographers offer old photo restoration as an add-on service. Magic Memory credit packs (\u20ac9.99 for 20 restorations) make it affordable to process client photos at scale. The AI handles the time-consuming face restoration, and you can add your professional finishing touches.",
  },
];

export default function ForPhotographersPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "For Photographers", url: "/for/photographers" },
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
              <span className="text-paper">For Photographers</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              Photo Restoration for Photographers
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              Clients bring you old photos and ask if they can be saved. Maybe it is a wedding portrait from the 1960s, a baby photo with water damage, or the only surviving picture of a grandparent. GFPGAN AI handles the face restoration that would take hours of manual clone-stamping and frequency separation — in under 15 seconds.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <ArticleHeading>How Photographers Use AI Restoration</ArticleHeading>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Rescue old client photos</h3>
                    <p className="text-sm text-paper/70">When clients bring in degraded photos, AI restoration gives you a high-quality starting point. GFPGAN reconstructs faces that manual retouching would struggle with, especially when the original detail is completely gone.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Add restoration as a paid service</h3>
                    <p className="text-sm text-paper/70">Photo restoration is a high-value service that clients will pay for. The emotional value of a restored family photo far exceeds the cost of a credit pack. AI handles the heavy lifting so you can offer competitive turnaround times.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Quick previews for clients</h3>
                    <p className="text-sm text-paper/70">Use the free daily restoration to generate a quick preview for potential clients. Show them what AI restoration can achieve in seconds, then deliver a refined version with your professional touch.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Combine with manual editing</h3>
                    <p className="text-sm text-paper/70">AI restoration is not a replacement for your editing skills — it is a time-saving first step. Run GFPGAN to restore faces, then open the result in Photoshop or Lightroom for color grading, background cleanup, and your signature style.</p>
                  </div>
                </div>
              </div>

              <div>
                <ArticleHeading>Photographer Workflow</ArticleHeading>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">1.</span> <strong className="text-paper">Receive client photo</strong> — Scan the physical print at 600+ DPI, or ask the client for the highest resolution digital version available.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">2.</span> <strong className="text-paper">Run AI face restoration</strong> — Upload to Magic Memory. GFPGAN restores facial detail in 5-15 seconds.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">3.</span> <strong className="text-paper">Refine in editing software</strong> — Open the restored image in Photoshop or Lightroom. Adjust color, contrast, remove background damage, apply your style.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">4.</span> <strong className="text-paper">Deliver to client</strong> — Export in the format and resolution the client needs. Print-ready or digital.</li>
                </ul>
              </div>

              <div>
                <ArticleHeading>AI Restoration vs Manual Retouching</ArticleHeading>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-paper/10">
                        <th className="py-2 text-left font-semibold"></th>
                        <th className="py-2 text-left font-semibold">AI (GFPGAN)</th>
                        <th className="py-2 text-left font-semibold">Manual (Photoshop)</th>
                      </tr>
                    </thead>
                    <tbody className="text-paper/70">
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Face restoration</td><td className="py-2">15 seconds, automated</td><td className="py-2">1-4 hours, skilled work</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Background repair</td><td className="py-2">Not handled</td><td className="py-2">Full control</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Color grading</td><td className="py-2">Not handled</td><td className="py-2">Full control</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Cost per photo</td><td className="py-2">~{"\u20ac"}0.50</td><td className="py-2">$25-$150+</td></tr>
                      <tr><td className="py-2 font-medium text-paper">Best for</td><td className="py-2">Face detail recovery</td><td className="py-2">Everything else</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-paper/70 mt-4">
                  The best results come from using both: AI for face restoration, manual editing for everything else.
                </p>
              </div>

              <div>
                <ArticleHeading>Pricing for Photography Businesses</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  At {"\u20ac"}9.99 for 20 restorations ({"\u20ac"}0.50 per photo), Magic Memory is a cost-effective tool for photographers who offer restoration services. Credits never expire, so you can buy a pack and use them as client requests come in over months.
                </p>
                <p className="text-paper/70">
                  If you charge clients $25-$75 per restored photo and the AI costs {"\u20ac"}0.50, the margin on restoration services is significant — and the AI saves you hours of manual work per photo.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Try It On a Client Photo</h2>
              <p className="text-paper/70 mb-4">
                Upload a client&apos;s old photo and see the AI restoration in under 15 seconds. 1 free restoration per day, no credit card required. See what GFPGAN can do before you commit to a credit pack.
              </p>
              <Button asChild>
                <Link href="/restore">
                  Restore a photo now
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
              <Link href="/restore-old-photos" className="hover:text-paper">Restore Old Photos</Link>
              <Link href="/restore-portrait-photos" className="hover:text-paper">Restore Portrait Photos</Link>
              <Link href="/glossary/gfpgan" className="hover:text-paper">What Is GFPGAN?</Link>
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
