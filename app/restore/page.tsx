import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RestoreUploader } from "@/components/restore/restore-uploader"
import { redirect } from "next/navigation"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"
import { Metadata } from "next"

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
}

async function checkAuth() {
  const { auth } = await import("@clerk/nextjs/server")
  return await auth()
}

import { breadcrumbJsonLd } from "@/lib/seo/metadata-helpers"

export default async function RestorePage() {
  const { userId } = await checkAuth()

  if (!userId) {
    redirect("/")
  }

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Restore Photos", url: "/restore" },
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Restore Your Photo</h1>
            <p className="mt-4 text-muted-foreground">
              Upload an old, blurry, or damaged photo and let AI work its magic.
            </p>
          </div>
          <RestoreUploader />
        </div>
      </main>
      <Footer />
    </div>
  )
}
