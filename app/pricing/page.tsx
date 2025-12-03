import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingCards } from "@/components/pricing/pricing-cards"
import { auth } from "@clerk/nextjs/server"

export const metadata = {
  title: "Pricing - RestorePhotos",
  description: "Choose the perfect plan for your photo restoration needs.",
}

export default async function PricingPage() {
  const { userId } = await auth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works best for you. Credits never expire.
            </p>
          </div>
          <PricingCards isSignedIn={!!userId} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
