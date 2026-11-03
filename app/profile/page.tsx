import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Metadata } from "next"
import { LoadingSpinner } from "@/components/ui/loading-states"
import { PageContainer } from "@/components/layout/page-container"
import { SectionLabel } from "@/components/layout/section-label"

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
        <main className="min-h-screen bg-background text-foreground">
            <PageContainer className="py-24">
                <SectionLabel index="01">Account</SectionLabel>
                <h1 className="font-serif mt-6 mb-12 text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[1] tracking-[-0.02em] text-paper">
                    Your <span className="italic text-paper/60">Profile</span>
                </h1>
                <div className="rounded-2xl border border-border bg-card p-2 sm:p-4">
                    <Suspense
                        fallback={
                            <div
                                className="flex min-h-[24rem] items-center justify-center"
                                role="status"
                                aria-label="Loading your profile"
                            >
                                <LoadingSpinner size="lg" tone="ember" />
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
            </PageContainer>
        </main>
    )
}
