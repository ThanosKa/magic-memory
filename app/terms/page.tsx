import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Magic Memory AI photo restoration. Covers credits, payments, data handling, acceptable use, and intellectual property. Purchased credits never expire.",
  alternates: {
    canonical: getCanonicalUrl("/terms"),
  },
  openGraph: {
    title: "Terms of Service | Magic Memory",
    description: "Terms of Service for Magic Memory AI photo restoration. Covers credits, payments, data handling, and intellectual property.",
    url: getCanonicalUrl("/terms"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Magic Memory Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Magic Memory",
    description: "Terms of Service for Magic Memory AI photo restoration. Covers credits, payments, data handling, and intellectual property.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { breadcrumbJsonLd } from "@/lib/seo/metadata-helpers"

export default function TermsPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" },
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By accessing and using Magic Memory, you accept and agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
              <p className="mt-2">
                Magic Memory provides AI-powered photo restoration using Replicate&apos;s GFPGAN model. We process your
                uploaded photo in memory, send it to Replicate for restoration, and return the restored result. We do
                not store your original or restored images on our infrastructure. We may store restoration metadata
                (Replicate output link, filename label, credit usage, timestamps, and your user ID) in our database for
                your account history and billing audit. We offer both free daily credits and paid credit packages for
                photo restorations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
              <p className="mt-2">
                You must create an account to use our services. You are responsible for maintaining the confidentiality
                of your account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
              <p className="mt-2">
                You agree not to upload any content that is illegal, harmful, threatening, abusive, harassing,
                defamatory, vulgar, obscene, or otherwise objectionable. We reserve the right to refuse service to
                anyone for any reason at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Credits and Payments</h2>
              <p className="mt-2">
                Purchased credits never expire. Free daily credits reset at midnight UTC. All payments are processed
                securely through Stripe. Refunds are available within 7 days of purchase if credits have not been used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Data Handling & Storage</h2>
              <p className="mt-2">
                Restorations are processed via Replicate, which temporarily hosts outputs at unique URLs subject to
                their retention policies. We do not store images on our own storage systems. Deleting your restoration
                history with us removes our references to those URLs but does not control Replicate&apos;s retention.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
              <p className="mt-2">
                You retain all rights to your original photos. Restored photos are also your property. We do not claim
                ownership of any content you upload or restore using our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p className="mt-2">
                Magic Memory is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages
                arising from the use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
              <p className="mt-2">For questions about these Terms, please contact us at kazakis.th@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
