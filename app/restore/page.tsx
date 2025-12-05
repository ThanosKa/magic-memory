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
    loading: () => <LoadingSpinner className="mx-auto my-6" />,
  }
);

const Footer = dynamic(
  () => import("@/components/footer").then((m) => m.Footer),
  {
    ssr: true,
    loading: () => <LoadingSpinner className="mx-auto my-12" />,
  }
);

const RestoreUploader = dynamic(
  () =>
    import("@/components/restore/restore-uploader").then(
      (m) => m.RestoreUploader
    ),
  {
    ssr: true,
    loading: () => <LoadingSpinner className="mx-auto my-10" />,
  }
);

export const metadata: Metadata = {
  title: "Restore Photos - RestorePhotos",
  description: "Upload and restore your old photos with AI.",
  alternates: {
    canonical: getCanonicalUrl("/restore"),
  },
  openGraph: {
    title: "Restore Photos - RestorePhotos",
    description: "Upload and restore your old photos with AI.",
    url: getCanonicalUrl("/restore"),
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: "RestorePhotos - Restore Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Photos - RestorePhotos",
    description: "Upload and restore your old photos with AI.",
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
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
      <Header />
      <main className="flex flex-1 items-center justify-center py-12 sm:py-16">
        <div className="mx-auto flex w-full max-w-4xl justify-center px-4 sm:px-6 lg:px-8">
          <RestoreUploader />
        </div>
      </main>
      <FooterMinimal />
    </div>
  );
}
