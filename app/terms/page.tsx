import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms of Service | RestorePhotos",
  description: "Terms of Service for RestorePhotos AI photo restoration service.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="mt-2">
                By accessing and using RestorePhotos, you accept and agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
              <p className="mt-2">
                RestorePhotos provides AI-powered photo restoration services using machine learning technology. We offer
                both free daily credits and paid credit packages for photo restorations.
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
              <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
              <p className="mt-2">
                You retain all rights to your original photos. Restored photos are also your property. We do not claim
                ownership of any content you upload or restore using our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
              <p className="mt-2">
                RestorePhotos is provided "as is" without warranties of any kind. We are not liable for any damages
                arising from the use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
              <p className="mt-2">For questions about these Terms, please contact us at support@restorephotos.app.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
