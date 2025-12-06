import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Magic Memory",
  description: "Privacy Policy for the Magic Memory AI photo restoration service.",
  alternates: {
    canonical: getCanonicalUrl("/privacy"),
  },
  openGraph: {
    title: "Privacy Policy | Magic Memory",
    description: "Privacy Policy for the Magic Memory AI photo restoration service.",
    url: getCanonicalUrl("/privacy"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Magic Memory Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Magic Memory",
    description: "Privacy Policy for the Magic Memory AI photo restoration service.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { breadcrumbJsonLd } from "@/lib/seo/metadata-helpers"

export default function PrivacyPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
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
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="mt-2">
                We collect information you provide directly, including your email address, name, and profile picture
                when you sign in with Google. For restorations, we process the photo you upload in memory and forward
                it to Replicate for AI processing; we do not persist the original or restored image on our
                infrastructure. We retain restoration metadata (Replicate output link, filename, credit usage, and
                timestamps) in our database for your account history and billing audit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="mt-2">
                We use your information to provide and improve the service, process payments, manage credits, maintain
                an audit trail of restorations, communicate with you, and ensure platform security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Photo Processing & Retention</h2>
              <p className="mt-2">
                Uploaded photos are processed in memory, sent to Replicate for restoration, and discarded from our
                servers after processing. We do not store originals or restored images on our own storage. Replicate
                hosts the restored output at a unique URL subject to their retention policies. We store only the
                restoration record (output URL, filename label, credit usage, timestamps, and your user ID) in our
                database. You can request deletion of your restoration records, which removes our references to the
                Replicate URL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
              <p className="mt-2">We use the following third-party services:</p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Clerk for authentication</li>
                <li>Supabase for database (no image storage)</li>
                <li>Stripe for payment processing</li>
                <li>Replicate API for AI photo restoration (receives your image)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
              <p className="mt-2">
                We implement appropriate security measures to protect your personal information and minimize data
                retention. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="mt-2">
                You have the right to access, correct, or delete your personal information. You can also request a copy
                of your data or ask us to stop processing it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
              <p className="mt-2">
                We use only essential cookies for authentication and session management. We do not use tracking or
                advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
              <p className="mt-2">For privacy-related questions, please contact us at kazakis.th@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
