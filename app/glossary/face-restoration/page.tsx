import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl, getOgImageUrl, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import type { FAQItem } from "@/lib/seo/faq-data";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });
const CTASection = dynamic(() => import("@/components/landing/cta-section").then((m) => m.CTASection), { ssr: true });

export const metadata: Metadata = {
  title: "What Is Face Restoration? AI-Powered Face Enhancement Explained",
  description:
    "Face restoration is the process of recovering facial detail in degraded photos using AI. Learn how models like GFPGAN detect, restore, and enhance faces in old and blurry photographs.",
  alternates: { canonical: getCanonicalUrl("/glossary/face-restoration") },
  openGraph: {
    title: "What Is Face Restoration? AI-Powered Face Enhancement Explained",
    description: "Learn how AI face restoration recovers facial detail in old, blurry, and damaged photographs using models like GFPGAN.",
    url: getCanonicalUrl("/glossary/face-restoration"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "What Is Face Restoration" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What is face restoration?",
    answer:
      "Face restoration is a subset of photo restoration that focuses specifically on recovering facial detail in degraded photographs. AI face restoration uses neural networks trained on millions of high-quality face images to reconstruct sharp features from blurry, low-resolution, or damaged inputs. The most common models are GFPGAN and CodeFormer.",
  },
  {
    question: "How is face restoration different from photo enhancement?",
    answer:
      "Photo enhancement broadly improves the overall quality of an image — brightness, contrast, color. Face restoration specifically targets facial features, using generative AI models trained on face data to reconstruct detail that generic enhancement tools cannot recover. Face restoration can turn an unrecognizable blur into a clear face.",
  },
  {
    question: "Does face restoration change how a person looks?",
    answer:
      "Good face restoration models preserve the identity of the person in the photo. GFPGAN uses identity-preserving loss during training to ensure restored faces match the original. However, extremely degraded inputs may result in slight differences because the model has to fill in missing information. The more detail preserved in the original, the more accurate the result.",
  },
  {
    question: "Can face restoration work on group photos?",
    answer:
      "Yes, face restoration models detect and process each face in a photo individually. In group photos, each face is detected, aligned, restored, and pasted back. Very small faces (less than roughly 50x50 pixels) may not be detected or may produce lower quality results because there is less information for the model to work with.",
  },
];

export default function GlossaryFaceRestorationPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "Face Restoration", url: "/glossary/face-restoration" },
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
              <span className="text-foreground">Face Restoration</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-6">
              What Is Face Restoration?
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Face restoration is the process of recovering facial detail in degraded photographs using AI. Unlike general photo enhancement, face restoration uses neural networks specifically trained on faces to reconstruct features like eyes, skin texture, and hair that were lost to blur, noise, or low resolution.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">How Face Restoration Works</h2>
                <p className="text-muted-foreground mb-4">
                  AI face restoration follows a three-step pipeline:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">1.</span> <strong className="text-foreground">Detection</strong> — A face detection model (typically RetinaFace or MTCNN) locates every face in the image and computes a bounding box and facial landmarks (eye corners, nose tip, mouth corners)</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">2.</span> <strong className="text-foreground">Restoration</strong> — Each detected face is cropped, aligned to a standard position, and fed through the restoration model. The model compares the degraded input against its learned knowledge of high-quality faces and generates a restored version</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">3.</span> <strong className="text-foreground">Blending</strong> — The restored face is inverse-transformed back to its original position and blended into the full image using a smooth mask to avoid visible seams</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Face Restoration vs Other Techniques</h2>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Face restoration vs image super-resolution</h3>
                      <p className="text-sm text-muted-foreground">Super-resolution increases the pixel count of an entire image without face-specific knowledge. Face restoration uses generative models trained on faces, producing much better results on facial features but only affecting detected faces.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Face restoration vs denoising</h3>
                      <p className="text-sm text-muted-foreground">Denoising removes grain and noise across the whole image. Face restoration goes further by reconstructing features that are not just noisy but actually missing — filling in detail that the denoiser cannot recover.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Face restoration vs inpainting</h3>
                      <p className="text-sm text-muted-foreground">Inpainting fills in missing regions (scratches, tears) with plausible content. Face restoration restores degraded but present faces. Some tools combine both: restore the face, then inpaint damage on the surrounding photo.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Common Use Cases</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Old family photos</strong> — Restoring grandparent and great-grandparent portraits from the pre-digital era</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Low-resolution scans</strong> — Enhancing photos scanned at low DPI or from old digital cameras</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Compressed images</strong> — Recovering detail from heavily compressed JPEG files shared on early social media</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Genealogy projects</strong> — Putting clear faces to names in family tree research</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">Memorial displays</strong> — Creating print-quality versions of the only surviving photo of a loved one</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Leading Face Restoration Models</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground"><Link href="/glossary/gfpgan" className="underline hover:text-foreground">GFPGAN</Link></strong> — Uses generative facial priors from a pre-trained StyleGAN2. Known for sharp, high-quality results. Powers Magic Memory.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">CodeFormer</strong> — Uses a transformer-based codebook approach with an adjustable fidelity-quality trade-off slider.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">→</span> <strong className="text-foreground">VQFR</strong> — Uses vector-quantized dictionaries for face restoration. Less widely adopted but shows strong results on severely degraded inputs.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-12">
              <h2 className="text-xl font-semibold mb-3">Try Face Restoration Free</h2>
              <p className="text-muted-foreground mb-4">
                Magic Memory uses GFPGAN to restore faces in any photo. Upload a portrait, get a restored version in under 15 seconds. 1 free restoration per day, no credit card required.
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
              <Link href="/glossary/gfpgan" className="hover:text-foreground">What Is GFPGAN?</Link>
              <Link href="/glossary/photo-restoration" className="hover:text-foreground">What Is Photo Restoration?</Link>
              <Link href="/glossary/image-upscaling" className="hover:text-foreground">What Is Image Upscaling?</Link>
              <Link href="/restore-old-photos" className="hover:text-foreground">Restore Old Photos</Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
