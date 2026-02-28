import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "What Is AI Photo Enhancement? Tools, Models, and Use Cases",
  description:
    "AI photo enhancement uses neural networks to automatically improve photo quality — fixing blur, noise, low resolution, and color issues. Learn how it works, which models power it, and how it compares to manual editing.",
  alternates: { canonical: getCanonicalUrl("/glossary/ai-photo-enhancement") },
  openGraph: {
    title: "What Is AI Photo Enhancement? Tools, Models, and Use Cases",
    description: "Learn how AI photo enhancement uses neural networks to fix blur, noise, and low resolution in photographs automatically.",
    url: getCanonicalUrl("/glossary/ai-photo-enhancement"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "What Is AI Photo Enhancement" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What is AI photo enhancement?",
    answer:
      "AI photo enhancement is the use of neural networks to automatically improve the quality of photographs. It covers a range of tasks including denoising, deblurring, super-resolution (upscaling), color correction, and face restoration. Unlike manual editing in Photoshop, AI enhancement processes photos in seconds with no technical skill required.",
  },
  {
    question: "How is AI photo enhancement different from filters?",
    answer:
      "Filters apply fixed mathematical transformations (brightness, contrast, color shifts) that work the same way on every image. AI enhancement uses neural networks that analyze each photo individually and make content-aware adjustments. A filter cannot recover a blurry face; an AI model trained on faces can reconstruct the missing detail.",
  },
  {
    question: "What is the best AI for enhancing old photos?",
    answer:
      "For face restoration in old photos, GFPGAN is the most widely used model. It produces sharp, identity-preserving results in seconds. For general image upscaling, Real-ESRGAN is the standard. Magic Memory uses GFPGAN to offer one-click face restoration with 1 free restoration per day.",
  },
  {
    question: "Does AI photo enhancement work on all types of photos?",
    answer:
      "AI photo enhancement works best on photos that match its training data. Face restoration models like GFPGAN work on photos containing faces. General enhancement models like Real-ESRGAN work on any image type. Extremely damaged photos (torn, water-damaged, heavily scratched) may need manual restoration in combination with AI tools.",
  },
];

export default function GlossaryAIPhotoEnhancementPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "AI Photo Enhancement", url: "/glossary/ai-photo-enhancement" },
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
              <span className="text-foreground">AI Photo Enhancement</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              What Is AI Photo Enhancement?
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              AI photo enhancement uses neural networks to automatically improve photograph quality. It covers multiple sub-tasks — denoising, deblurring, upscaling, color correction, and face restoration — each powered by specialized models trained on millions of images. The result is professional-quality improvements in seconds, with no manual editing required.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Types of AI Photo Enhancement</h2>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Face restoration</h3>
                    <p className="text-sm text-muted-foreground">Reconstructs facial detail in degraded photos using generative models trained on faces. The most widely used model is <Link href="/glossary/gfpgan" className="underline hover:text-foreground">GFPGAN</Link>. Best for old portraits and family photos.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Image super-resolution (upscaling)</h3>
                    <p className="text-sm text-muted-foreground">Increases image resolution by generating new pixels with AI. Models like Real-ESRGAN can 2x-4x the resolution while maintaining sharpness. Best for enlarging photos for print. <Link href="/glossary/image-upscaling" className="underline hover:text-foreground">Learn more about upscaling</Link>.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Denoising</h3>
                    <p className="text-sm text-muted-foreground">Removes grain, noise, and digital artifacts while preserving detail. Works on both film grain from old photos and digital noise from high-ISO photography.</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold mb-2">Color correction and restoration</h3>
                    <p className="text-sm text-muted-foreground">Fixes faded colors, white balance issues, and exposure problems. Some models can colorize black and white photos by predicting what colors should be based on the image content.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">AI Enhancement vs Manual Editing</h2>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Manual editing (Photoshop, Lightroom)</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Full creative control over every adjustment</li>
                        <li>- Can handle complex, unusual damage</li>
                        <li>- Requires skill and practice</li>
                        <li>- Takes minutes to hours per photo</li>
                        <li>- Cannot generate new facial detail</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">AI enhancement</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Automatic, no technical skill needed</li>
                        <li>- Processes in seconds</li>
                        <li>- Can generate missing detail (faces, texture)</li>
                        <li>- Consistent results across photos</li>
                        <li>- Limited to what the model was trained on</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Key Models and Tools</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 text-left font-semibold">Model</th>
                        <th className="py-2 text-left font-semibold">Task</th>
                        <th className="py-2 text-left font-semibold">Best for</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">GFPGAN</td><td className="py-2">Face restoration</td><td className="py-2">Old portraits, family photos</td></tr>
                      <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">CodeFormer</td><td className="py-2">Face restoration</td><td className="py-2">Adjustable fidelity control</td></tr>
                      <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Real-ESRGAN</td><td className="py-2">Super-resolution</td><td className="py-2">General image upscaling</td></tr>
                      <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">SwinIR</td><td className="py-2">Super-resolution</td><td className="py-2">Maximum quality upscaling</td></tr>
                      <tr><td className="py-2 font-medium text-foreground">NAFNet</td><td className="py-2">Denoising / deblurring</td><td className="py-2">Removing noise and blur</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Who Uses AI Photo Enhancement</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Families</strong> — Restoring old photos of parents, grandparents, and ancestors for preservation or display</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Genealogists</strong> — Enhancing faces in historical photos to identify and document family members</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Photographers</strong> — Upscaling and denoising to prepare images for large prints</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Real estate professionals</strong> — Enhancing property photos for listings</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Social media users</strong> — Improving photo quality before sharing online</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Try AI Face Restoration Free</h2>
              <p className="text-muted-foreground mb-4">
                Magic Memory uses GFPGAN for AI-powered face restoration. Upload any photo with faces, get a restored version in under 15 seconds. 1 free restoration per day, no credit card required. Additional credits from {"\u20ac"}9.99 for 100 restorations.
              </p>
              <Link
                href="/restore"
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Restore a photo now
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
              <Link href="/glossary/photo-restoration" className="hover:text-foreground">What Is Photo Restoration?</Link>
              <Link href="/glossary/gfpgan" className="hover:text-foreground">What Is GFPGAN?</Link>
              <Link href="/glossary/face-restoration" className="hover:text-foreground">What Is Face Restoration?</Link>
              <Link href="/glossary/image-upscaling" className="hover:text-foreground">What Is Image Upscaling?</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
