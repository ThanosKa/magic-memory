import { UserProfile } from "@clerk/nextjs"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Your Profile | RestorePhotos",
    description: "Manage your account settings and preferences.",
}

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                    Your Profile
                </h1>
                <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
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
                </div>
            </div>
        </main>
    )
}
