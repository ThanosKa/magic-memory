import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-9xl font-bold tracking-tighter text-primary/20 select-none">
            404
          </h1>

          <div className="mt-4 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved or doesn&apos;t exist.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">
                <Search className="mr-2 h-4 w-4" />
                View Pricing
              </Link>
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link
                href="/"
                className="text-primary hover:underline inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Home
              </Link>
              <Link href="/pricing" className="text-primary hover:underline">
                Pricing
              </Link>
              <Link href="/restore" className="text-primary hover:underline">
                Restore
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
