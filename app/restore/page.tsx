import { Suspense } from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { FooterMinimal } from "@/components/footer-minimal";
const Header = dynamic(
  () => import("@/components/header").then((m) => m.Header),
  {
    ssr: true,
  }
);

const RestoreUploader = dynamic(
  () =>
    import("@/components/restore/restore-uploader").then(
      (m) => m.RestoreUploader
    ),
  {
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Magic Memory — AI Photo Restoration",
  description: "Upload and enhance your photos with Magic Memory AI.",
  alternates: {
    canonical: getCanonicalUrl("/restore"),
  },
  openGraph: {
    title: "Magic Memory — AI Photo Restoration",
    description: "Upload and enhance your photos with Magic Memory AI.",
    url: getCanonicalUrl("/restore"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "Magic Memory - Restore Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic Memory — AI Photo Restoration",
    description: "Upload and enhance your photos with Magic Memory AI.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: false,
    follow: false,
  },
};

async function checkAuth() {
  const { auth } = await import("@clerk/nextjs/server");
  return await auth();
}

import { breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";

export default async function RestorePage() {
  const { userId } = await checkAuth();

  if (!userId) {
    redirect("/");
  }

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Photos", url: "/restore" },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<RestorePageFallback />}>
        <Header />
        <main className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <h1 className="sr-only">Magic Memory</h1>
          <div className="mx-auto flex w-full max-w-4xl justify-center px-4 sm:px-6 lg:px-8">
            <RestoreUploader />
          </div>
        </main>
        <FooterMinimal />
      </Suspense>
    </div>
  );
}

function RestorePageFallback() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">
            Loading restore tools...
          </p>
        </div>
      </main>
    </div>
  );
}
