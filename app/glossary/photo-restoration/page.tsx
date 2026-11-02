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
  title: "What Is Photo Restoration? Definition, Methods, and Tools",
  description:
    "Photo restoration is the process of repairing and enhancing old, damaged, or degraded photographs. Learn about manual retouching, AI-powered restoration with GFPGAN, and how to choose the right method for your photos.",
  alternates: { canonical: getCanonicalUrl("/glossary/photo-restoration") },
  openGraph: {
    title: "What Is Photo Restoration? Definition, Methods, and Tools",
    description: "Learn what photo restoration is, how it works, and which methods produce the best results for old and damaged photographs.",
    url: getCanonicalUrl("/glossary/photo-restoration"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "What Is Photo Restoration" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What is photo restoration?",
    answer:
      "Photo restoration is the process of repairing and enhancing photographs that have been damaged, degraded, or lost quality over time. It includes fixing scratches, tears, fading, discoloration, blur, and missing detail. Traditional restoration is done manually in software like Photoshop. AI restoration uses neural networks to automate the process.",
  },
  {
    question: "How much does professional photo restoration cost?",
    answer:
      "Professional manual photo restoration typically costs $25-$150+ per photo depending on the damage level and turnaround time. AI-powered tools like Magic Memory offer the same face restoration for a fraction of the cost — starting with 1 free restoration per day and credit packs from \u20ac9.99 for 30 restorations.",
  },
  {
    question: "Is AI photo restoration as good as manual restoration?",
    answer:
      "For face restoration specifically, AI tools like GFPGAN produce results comparable to professional manual retouching in most cases. AI excels at recovering facial detail, sharpening features, and removing blur. Manual restoration is still better for complex damage like torn photos, missing sections, or non-face elements that require creative reconstruction.",
  },
  {
    question: "Can photo restoration fix completely destroyed photos?",
    answer:
      "It depends on the damage. AI restoration can recover faces from severely blurry, faded, or low-resolution photos. However, if facial features are completely obscured — for example, by a tear running through the face or heavy water damage — both AI and manual restoration have limits. The more recognizable the original face, the better the result.",
  },
];

export default function GlossaryPhotoRestorationPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "Photo Restoration", url: "/glossary/photo-restoration" },
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
              <span className="text-paper">Photo Restoration</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              What Is Photo Restoration?
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              Photo restoration is the process of repairing and enhancing old, damaged, or degraded photographs to recover lost detail and visual quality. It ranges from manual retouching in Photoshop to fully automated AI processing with models like GFPGAN.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Types of Photo Damage</h2>
                <p className="text-paper/70 mb-4">
                  Photos degrade through several mechanisms, each requiring different restoration approaches:
                </p>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Fading</strong> — UV light breaks down dyes and pigments over decades, causing colors to wash out and contrast to drop</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Blur and softness</strong> — Early cameras, low-quality lenses, motion during exposure, or low-resolution scanning produce soft or blurry images</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Scratches and tears</strong> — Physical handling, improper storage, or accidents create surface damage on prints</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Water and mold damage</strong> — Humidity and flooding cause warping, staining, and biological growth on photo paper</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Compression artifacts</strong> — Photos digitized in the early internet era were often saved as low-quality JPEGs, introducing blocky artifacts</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">Manual vs AI Photo Restoration</h2>
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-paper mb-3">Manual Restoration</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Done in Photoshop or GIMP by a skilled retoucher</li>
                        <li>- Can fix complex damage (tears, missing sections)</li>
                        <li>- Takes hours to days per photo</li>
                        <li>- Costs $25-$150+ per photo</li>
                        <li>- Results depend on the retoucher&apos;s skill</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-paper mb-3">AI Restoration</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Uses neural networks (GFPGAN, CodeFormer)</li>
                        <li>- Excels at face detail and sharpness</li>
                        <li>- Processes in 5-15 seconds</li>
                        <li>- Costs a fraction of manual work</li>
                        <li>- Consistent quality across all photos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">How AI Photo Restoration Works</h2>
                <p className="text-paper/70 mb-4">
                  AI photo restoration models like GFPGAN use generative adversarial networks (GANs) trained on millions of high-resolution face images. The model learns what faces should look like at high quality, then applies that knowledge to reconstruct degraded faces.
                </p>
                <p className="text-paper/70 mb-4">
                  The process works in three stages: the model detects and aligns faces in the input photo, generates a high-quality version of each face using its learned priors, then blends the restored face back into the original image while preserving the surrounding context.
                </p>
                <p className="text-paper/70">
                  This approach is particularly effective for portraits and family photos where faces are the most important element. The model can recover fine details like wrinkles, hair texture, and eye reflections that were completely lost in the degraded original.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-3xl tracking-[-0.01em] text-paper mb-4">When to Use Each Method</h2>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">AI restoration</strong> — Best for face-focused photos that are blurry, faded, or low resolution. Fast and affordable.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Manual restoration</strong> — Best for photos with physical tears, missing corners, or complex non-face damage that requires creative reconstruction.</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">→</span> <strong className="text-paper">Both combined</strong> — For valuable photos with both face degradation and physical damage, use AI for the faces and manual for structural repairs.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Try AI Photo Restoration Free</h2>
              <p className="text-paper/70 mb-4">
                Magic Memory uses GFPGAN to restore faces in old and damaged photos. Upload a photo, get a restored version in under 15 seconds. 1 free restoration per day, no credit card required. Additional credits from {"\u20ac"}9.99 for 30 restorations.
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
              <Link href="/glossary/gfpgan" className="hover:text-paper">What Is GFPGAN?</Link>
              <Link href="/glossary/face-restoration" className="hover:text-paper">What Is Face Restoration?</Link>
              <Link href="/glossary/image-upscaling" className="hover:text-paper">What Is Image Upscaling?</Link>
              <Link href="/restore-old-photos" className="hover:text-paper">Restore Old Photos</Link>
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
