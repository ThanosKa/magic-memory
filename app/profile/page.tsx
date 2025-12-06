import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Metadata } from "next"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"
import { LoadingSpinner } from "@/components/ui/loading-states"

const UserProfile = dynamic(() => import("@clerk/nextjs").then((m) => m.UserProfile), {
  ssr: true,
})

export const metadata: Metadata = {
    title: "Your Profile | RestorePhotos",
    description: "Manage your account settings and preferences.",
    alternates: {
        canonical: getCanonicalUrl("/profile"),
    },
    openGraph: {
        title: "Your Profile | RestorePhotos",
        description: "Manage your account settings and preferences.",
        url: getCanonicalUrl("/profile"),
        images: [
            {
                url: getOgImageUrl(),
                width: 1200,
                height: 630,
                alt: "RestorePhotos Profile",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Your Profile | RestorePhotos",
        description: "Manage your account settings and preferences.",
        images: [getOgImageUrl()],
    },
    robots: {
        index: false,
        follow: false,
    },
}

import { breadcrumbJsonLd } from "@/lib/seo/metadata-helpers"

export default function ProfilePage() {
    const jsonLd = breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Profile", url: "/profile" },
    ])

    return (
        <main className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                    Your Profile
                </h1>
                <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner size="lg" />
                            </div>
                        }
                    >
                        <UserProfile
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-none bg-transparent",
                                    navbar: "hidden",
                                    pageScrollBox: "p-0",
                                },
                            }}
                        />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
