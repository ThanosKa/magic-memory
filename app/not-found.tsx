import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button, ButtonArrow } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-20 sm:py-28">
        <div className="max-w-2xl text-center">
          <p
            className="font-serif select-none text-[clamp(7rem,22vw,16rem)] leading-[0.9] tracking-[-0.02em] text-paper/15"
            aria-hidden="true"
          >
            404
          </p>

          <div className="mt-6 space-y-4">
            <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-[-0.02em] text-paper">
              Page Not <span className="italic text-paper/70">Found</span>
            </h1>
            <p className="mx-auto max-w-md text-[17px] leading-[1.6] text-paper/70">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved or doesn&apos;t exist.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                Back to Home
                <ButtonArrow />
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
