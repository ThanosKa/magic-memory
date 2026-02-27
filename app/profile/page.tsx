import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Metadata } from "next"
import { LoadingSpinner } from "@/components/ui/loading-states"

const UserProfile = dynamic(() => import("@clerk/nextjs").then((m) => m.UserProfile), {
  ssr: true,
})

export const metadata: Metadata = {
    title: "Your Profile",
    description: "Manage your Magic Memory account settings, view your restoration history, and check your credit balance.",
    robots: {
        index: false,
        follow: false,
    },
}

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-background">
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
