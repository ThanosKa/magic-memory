import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "What Is Image Upscaling? AI Super-Resolution Explained",
  description:
    "Image upscaling increases the resolution of a photo by adding new pixels using AI. Learn how super-resolution models like Real-ESRGAN work, when to use upscaling vs face restoration, and which tools deliver the best results.",
  alternates: { canonical: getCanonicalUrl("/glossary/image-upscaling") },
  openGraph: {
    title: "What Is Image Upscaling? AI Super-Resolution Explained",
    description: "Learn how AI image upscaling increases photo resolution by generating new detail using neural networks.",
    url: getCanonicalUrl("/glossary/image-upscaling"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "What Is Image Upscaling" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What is image upscaling?",
    answer:
      "Image upscaling (also called super-resolution) is the process of increasing the resolution of an image — making it larger while maintaining or improving quality. Traditional upscaling (bicubic, bilinear) produces blurry results. AI upscaling uses neural networks to generate new detail that was not present in the original, producing sharper results at higher resolutions.",
  },
  {
    question: "Is image upscaling the same as face restoration?",
    answer:
      "No. Image upscaling increases the resolution of the entire image. Face restoration specifically targets and reconstructs facial features using models trained on face data. For old portraits, face restoration (GFPGAN) typically produces better facial results than generic upscaling. The two can be combined: restore the face, then upscale the entire image.",
  },
  {
    question: "How much can you upscale a photo?",
    answer:
      "Most AI upscaling models support 2x to 4x resolution increase. Some support up to 8x or 16x, but quality degrades at higher scales because the model is inventing more detail. For best results, use the lowest scale factor that meets your needs — a 2x upscale of a 1000x1000 photo produces a clean 2000x2000 image.",
  },
  {
    question: "Does upscaling add real detail to a photo?",
    answer:
      "AI upscaling generates plausible detail based on patterns learned during training. It does not recover actual original detail that was lost — it creates new detail that looks realistic. For most practical purposes the results are indistinguishable from higher-resolution originals, but the added detail is technically synthetic.",
  },
];

export default function GlossaryImageUpscalingPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "Image Upscaling", url: "/glossary/image-upscaling" },
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
              <span className="text-foreground">Image Upscaling</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              What Is Image Upscaling?
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Image upscaling (super-resolution) increases the resolution of a photograph by generating new pixels using AI. Unlike traditional resizing that produces blurry results, AI upscaling creates sharp, realistic detail at higher resolutions using neural networks trained on millions of images.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Traditional vs AI Upscaling</h2>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Traditional (bicubic/bilinear)</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Averages neighboring pixels</li>
                        <li>- Produces blurry, soft results</li>
                        <li>- No new detail created</li>
                        <li>- Fast but low quality</li>
                        <li>- Built into every image editor</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">AI (neural network)</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>- Generates plausible new detail</li>
                        <li>- Produces sharp, realistic results</li>
                        <li>- Creates texture, edges, and patterns</li>
                        <li>- Slower but much higher quality</li>
                        <li>- Requires specialized models</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">How AI Upscaling Works</h2>
                <p className="text-muted-foreground mb-4">
                  AI super-resolution models are trained on pairs of images: a high-resolution original and a synthetically degraded low-resolution version. The model learns to reverse the degradation process — given a low-resolution input, it predicts what the high-resolution version should look like.
                </p>
                <p className="text-muted-foreground mb-4">
                  The most widely used model for general image upscaling is Real-ESRGAN, which handles real-world degradations (blur, noise, JPEG artifacts, and resolution loss simultaneously). For faces specifically, GFPGAN produces superior results because it uses face-specific training data and generative priors.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Leading Upscaling Models</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Real-ESRGAN</strong> — General-purpose upscaling model that handles real-world degradations. Supports 2x and 4x scales. Works on any image type.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">SwinIR</strong> — Transformer-based model with state-of-the-art PSNR scores. More computationally expensive but produces very clean results.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Stable Diffusion Upscaler</strong> — Uses diffusion models for upscaling. Can add creative detail but may alter the image more than other methods.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground"><Link href="/glossary/gfpgan" className="underline hover:text-foreground">GFPGAN</Link></strong> — Not a general upscaler, but the best option for face-specific restoration and enhancement.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Upscaling vs Face Restoration</h2>
                <p className="text-muted-foreground mb-4">
                  For old portrait photos, the question is often whether to use a general upscaler or a face restoration model. The answer depends on what you need:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Faces are the priority</strong> — Use face restoration (GFPGAN). It produces dramatically better facial results than any general upscaler.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Whole image needs enlarging</strong> — Use a general upscaler (Real-ESRGAN) to increase resolution across the entire image.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Both needed</strong> — Run face restoration first, then upscale the result. This gives the best of both worlds.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Restore Faces in Old Photos</h2>
              <p className="text-muted-foreground mb-4">
                While Magic Memory focuses on face restoration rather than general upscaling, it produces dramatically better facial results than any upscaler alone. Upload a portrait, get a restored version in under 15 seconds. 1 free restoration per day, no credit card required.
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
              <Link href="/glossary/face-restoration" className="hover:text-foreground">What Is Face Restoration?</Link>
              <Link href="/glossary/gfpgan" className="hover:text-foreground">What Is GFPGAN?</Link>
              <Link href="/glossary/ai-photo-enhancement" className="hover:text-foreground">What Is AI Photo Enhancement?</Link>
              <Link href="/fix-blurry-photos" className="hover:text-foreground">Fix Blurry Photos</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
