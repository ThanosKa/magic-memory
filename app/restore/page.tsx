import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RestoreUploader } from "@/components/restore/restore-uploader"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Restore Photos - RestorePhotos",
  description: "Upload and restore your old photos with AI.",
}

async function checkAuth() {
  if (!process.env.CLERK_SECRET_KEY) {
    return { userId: "demo-user" } // Allow access in demo mode
  }

  try {
    const { auth } = await import("@clerk/nextjs/server")
    return await auth()
  } catch {
    return { userId: null }
  }
}

export default async function RestorePage() {
  const { userId } = await checkAuth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
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
