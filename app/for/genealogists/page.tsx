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
  title: "AI Photo Restoration for Genealogists — Restore Ancestor Photos",
  description:
    "Restore old ancestor photos for genealogy research. Magic Memory uses GFPGAN AI to sharpen faces in degraded historical photos. 1 free restoration per day, no subscription. Put clear faces to the names in your family tree.",
  alternates: { canonical: getCanonicalUrl("/for/genealogists") },
  openGraph: {
    title: "AI Photo Restoration for Genealogists — Restore Ancestor Photos",
    description: "Restore old ancestor photos for family tree research. GFPGAN AI sharpens faces in degraded historical photos in seconds.",
    url: getCanonicalUrl("/for/genealogists"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "Photo Restoration for Genealogists" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "Can AI restore very old photos from the 1800s?",
    answer:
      "Yes, GFPGAN can restore photos from any era as long as faces are somewhat visible. Photos from the 1800s-1900s often have fading, low contrast, and blur, all of which GFPGAN handles well. The model reconstructs facial detail that has been lost to time, producing clearer results than the original scan.",
  },
  {
    question: "Does Magic Memory store my genealogy photos?",
    answer:
      "No. Magic Memory does not store your photos on its servers. Photos are processed in memory and deleted immediately after restoration. Your family photos remain private. You download the restored version and the original is never retained.",
  },
  {
    question: "How do I get the best results from ancestor photos?",
    answer:
      "Scan your physical photos at 600 DPI or higher using a flatbed scanner. Save as JPEG at 90%+ quality or PNG for lossless. Make sure faces are visible and not cropped out. Even very small faces in group photos can be improved, but larger face areas produce the best results.",
  },
  {
    question: "Can I restore multiple ancestor photos at once?",
    answer:
      "Magic Memory processes one photo at a time through the web interface. You get 1 free restoration per day. For larger genealogy projects, credit packs start at \u20ac9.99 for 30 restorations — enough for an entire family photo collection. Credits never expire.",
  },
];

export default function ForGenealogistsPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "For Genealogists", url: "/for/genealogists" },
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
              <span className="text-paper">For Genealogists</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              Photo Restoration for Genealogists
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              You have names, dates, and a family tree. Now put clear faces to them. Magic Memory uses GFPGAN AI to restore faces in old, faded, and degraded ancestor photos — turning blurry historical portraits into sharp, printable images in under 15 seconds.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Why Genealogists Need Photo Restoration</h2>
                <p className="text-paper/70 mb-4">
                  The photos that matter most to genealogy research are often the hardest to work with. Photos from the early 1900s and before were printed on fragile paper, stored in attics and basements, and scanned at low resolution decades ago. By the time they reach your family tree project, faces are often unrecognizable.
                </p>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Faded prints</strong> — Decades of light exposure have washed out contrast and detail, especially in faces</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Low-resolution scans</strong> — Early digitization at 72-150 DPI produced tiny files that cannot be enlarged without becoming pixelated</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Film grain and noise</strong> — Early film stocks and small negatives produced grainy images, especially in indoor or low-light portraits</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Physical damage</strong> — Scratches, creases, water stains, and mold from decades of improper storage</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">How Magic Memory Helps</h2>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Restore faces in ancestor portraits</h3>
                    <p className="text-sm text-paper/70">GFPGAN reconstructs facial detail from blurry or faded inputs. Eyes, mouths, skin texture, and hair become sharp and clear, making it possible to see what your ancestors actually looked like.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Process group photos</h3>
                    <p className="text-sm text-paper/70">Family reunion photos, wedding groups, and class pictures often contain multiple faces. GFPGAN detects and restores each face individually, improving every person in the photo.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">Privacy-first processing</h3>
                    <p className="text-sm text-paper/70">Family photos are personal. Magic Memory does not store your photos on its servers — images are processed in memory and deleted immediately after restoration. Your family history stays private.</p>
                  </div>
                  <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                    <h3 className="font-semibold text-paper mb-2">No subscription required</h3>
                    <p className="text-sm text-paper/70">Unlike MyHeritage (which requires a genealogy subscription) or Remini (which charges $9.99/week), Magic Memory offers 1 free restoration per day and credit packs from {"\u20ac"}9.99 for 30 restorations that never expire.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Genealogy Photo Restoration Workflow</h2>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">1.</span> <strong className="text-paper">Scan at high resolution</strong> — Use a flatbed scanner at 600 DPI or higher. Save as JPEG (90%+ quality) or PNG.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">2.</span> <strong className="text-paper">Upload to Magic Memory</strong> — Supports JPEG, PNG, and WebP up to 10MB. No app to install.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">3.</span> <strong className="text-paper">Download restored photo</strong> — Get the result in under 15 seconds. Compare before and after.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">4.</span> <strong className="text-paper">Add to your family tree</strong> — Use the restored photo in your genealogy software, family tree, or memorial display.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Magic Memory vs MyHeritage Photo Enhancer</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-paper/10">
                        <th className="py-2 text-left font-semibold"></th>
                        <th className="py-2 text-left font-semibold text-ember">Magic Memory</th>
                        <th className="py-2 text-left font-semibold">MyHeritage</th>
                      </tr>
                    </thead>
                    <tbody className="text-paper/70">
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Price</td><td className="py-2">{"\u20ac"}9.99 one-time (30 photos)</td><td className="py-2">~$13/month subscription</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Free tier</td><td className="py-2">1/day, no card</td><td className="py-2">Very limited</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Photo storage</td><td className="py-2">None (privacy-first)</td><td className="py-2">Stored in account</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Genealogy tools</td><td className="py-2">Photo restoration only</td><td className="py-2">Family trees, DNA, records</td></tr>
                      <tr><td className="py-2 font-medium text-paper">Credit expiry</td><td className="py-2">Never expire</td><td className="py-2">Monthly subscription</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-paper/70 mt-4">
                  <Link href="/alternatives/myheritage" className="underline hover:text-paper">See full MyHeritage alternative comparison</Link>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Restore Your Ancestor Photos</h2>
              <p className="text-paper/70 mb-4">
                Upload an old family photo and see the restoration in under 15 seconds. 1 free restoration per day, no credit card required. Credit packs from {"\u20ac"}9.99 for 30 restorations — enough for an entire family photo collection.
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
              <Link href="/restore-family-photos" className="hover:text-paper">Restore Family Photos</Link>
              <Link href="/restore-old-photos" className="hover:text-paper">Restore Old Photos</Link>
              <Link href="/vs/myheritage" className="hover:text-paper">Magic Memory vs MyHeritage</Link>
              <Link href="/glossary/gfpgan" className="hover:text-paper">What Is GFPGAN?</Link>
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
