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
  title: "What Is GFPGAN? How It Restores Old Photos With AI",
  description:
    "GFPGAN is an AI model developed by Tencent ARC that restores faces in old and degraded photographs. Learn how GFPGAN works, how it compares to CodeFormer, and how Magic Memory uses it for one-click photo restoration.",
  alternates: { canonical: getCanonicalUrl("/glossary/gfpgan") },
  openGraph: {
    title: "What Is GFPGAN? How It Restores Old Photos With AI",
    description: "Learn how GFPGAN uses generative adversarial networks to restore faces in old, blurry, and damaged photos.",
    url: getCanonicalUrl("/glossary/gfpgan"),
    images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: "What Is GFPGAN" }],
  },
  robots: { index: true, follow: true },
};

const faqs: FAQItem[] = [
  {
    question: "What does GFPGAN stand for?",
    answer:
      "GFPGAN stands for Generative Facial Prior Generative Adversarial Network. It is an AI model that uses pre-trained face generation models (facial priors) as a reference to restore degraded faces in photographs. It was developed by Tencent ARC and published at CVPR 2021.",
  },
  {
    question: "Is GFPGAN free to use?",
    answer:
      "GFPGAN is open-source software released under a BSD-style license. You can run it yourself if you have the technical setup (Python, PyTorch, a compatible GPU). Alternatively, services like Magic Memory provide a hosted version where you can use GFPGAN through a web interface, paying per photo with one-time credits.",
  },
  {
    question: "How is GFPGAN different from CodeFormer?",
    answer:
      "Both GFPGAN and CodeFormer restore faces, but they use different approaches. GFPGAN uses channel-split spatial feature transforms with generative facial priors. CodeFormer uses a transformer-based codebook lookup approach. GFPGAN tends to produce sharper results, while CodeFormer offers a fidelity-quality slider for more control. Both are effective for portrait restoration.",
  },
  {
    question: "Can GFPGAN restore non-face parts of a photo?",
    answer:
      "GFPGAN is specifically designed for face restoration. It detects faces in a photo, restores them, and blends them back into the original image. The background and non-face elements remain as they were in the original. For full-image enhancement, you would need additional models for super-resolution or denoising.",
  },
];

export default function GlossaryGFPGANPage() {
  const faqJsonLd = faqPageJsonLd(faqs);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Glossary", url: "/glossary/photo-restoration" },
    { name: "GFPGAN", url: "/glossary/gfpgan" },
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
              <span className="text-paper">GFPGAN</span>
            </nav>

            <h1 className="font-serif text-4xl tracking-[-0.02em] text-paper sm:text-6xl text-balance mb-6">
              What Is GFPGAN?
            </h1>

            <p className="text-lg text-paper/70 mb-8">
              GFPGAN (Generative Facial Prior GAN) is an open-source AI model developed by Tencent ARC that restores faces in old, blurry, and damaged photographs. Published at CVPR 2021, it has become one of the most widely used face restoration models, powering tools like Magic Memory.
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <ArticleHeading>How GFPGAN Works</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  GFPGAN combines a degradation removal module with a pre-trained face generation model (StyleGAN2). The key innovation is using the rich facial details stored in the pre-trained generator as &quot;facial priors&quot; — reference knowledge of what high-quality faces look like.
                </p>
                <p className="text-paper/70 mb-4">
                  The architecture works in three stages:
                </p>
                <ul className="space-y-3 text-paper/70">
                  <li className="flex gap-3"><span className="text-ember font-bold">1.</span> <strong className="text-paper">Face detection and alignment</strong> — The model locates faces in the input image and aligns them to a standard position for processing</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">2.</span> <strong className="text-paper">Feature extraction and restoration</strong> — A U-Net encoder extracts features from the degraded face, then channel-split spatial feature transforms (CS-SFT) modulate the pre-trained generator to produce a restored face that preserves the original identity</li>
                  <li className="flex gap-3"><span className="text-ember font-bold">3.</span> <strong className="text-paper">Blending</strong> — The restored face is pasted back into the original image, blending seamlessly with the surrounding context</li>
                </ul>
              </div>

              <div>
                <ArticleHeading>What GFPGAN Can Fix</ArticleHeading>
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-paper mb-3">Works well on</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Blurry or out-of-focus faces</li>
                        <li>- Low-resolution scanned photos</li>
                        <li>- Faded or discolored portraits</li>
                        <li>- Noisy or grainy face photos</li>
                        <li>- JPEG compression artifacts on faces</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-paper mb-3">Limited effectiveness on</h3>
                      <ul className="space-y-2 text-sm text-paper/70">
                        <li>- Faces completely hidden by tears or damage</li>
                        <li>- Extreme profile angles (side views)</li>
                        <li>- Very small faces in group photos</li>
                        <li>- Non-face elements (backgrounds, objects)</li>
                        <li>- Cartoon or illustrated faces</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <ArticleHeading>GFPGAN vs CodeFormer</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  CodeFormer, published at NeurIPS 2022, is the other major face restoration model. Both produce high-quality results, but they differ in approach:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-paper/10">
                        <th className="py-2 text-left font-semibold"></th>
                        <th className="py-2 text-left font-semibold">GFPGAN</th>
                        <th className="py-2 text-left font-semibold">CodeFormer</th>
                      </tr>
                    </thead>
                    <tbody className="text-paper/70">
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Approach</td><td className="py-2">GAN with facial priors</td><td className="py-2">Transformer codebook lookup</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Sharpness</td><td className="py-2">Tends to be sharper</td><td className="py-2">Slightly softer by default</td></tr>
                      <tr className="border-b border-paper/10"><td className="py-2 font-medium text-paper">Fidelity control</td><td className="py-2">Fixed output</td><td className="py-2">Adjustable fidelity slider</td></tr>
                      <tr><td className="py-2 font-medium text-paper">Published</td><td className="py-2">CVPR 2021</td><td className="py-2">NeurIPS 2022</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <ArticleHeading>Technical Requirements</ArticleHeading>
                <p className="text-paper/70 mb-4">
                  Running GFPGAN locally requires Python 3.7+, PyTorch 1.7+, and a CUDA-compatible GPU with at least 4GB VRAM. The model weights are approximately 330MB. For users without the technical setup, hosted services provide the same restoration through a web interface.
                </p>
                <p className="text-paper/70">
                  Magic Memory hosts GFPGAN as a cloud service, so you can restore photos from any device with a browser — no installation, GPU, or Python knowledge required. Processing takes 5-15 seconds per photo.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-paper/15 bg-paper/[0.04] p-6 mb-12">
              <h2 className="font-serif text-2xl text-paper mb-3">Try GFPGAN Without Setup</h2>
              <p className="text-paper/70 mb-4">
                Magic Memory runs GFPGAN in the cloud so you can restore photos from any device. Upload a photo, get a restored version in under 15 seconds. One-time credits that never expire, no subscription.
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
              <Link href="/glossary/photo-restoration" className="hover:text-paper">What Is Photo Restoration?</Link>
              <Link href="/glossary/face-restoration" className="hover:text-paper">What Is Face Restoration?</Link>
              <Link href="/blog/gfpgan-explained" className="hover:text-paper">GFPGAN Explained (Blog)</Link>
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
          note="One-time credit packs. Credits never expire. No subscription."
        />
      </main>
      <Footer />
    </div>
  );
}
