"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { SignUpButton, useUser } from "@clerk/nextjs"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function HeroSection() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h1
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Restore Your Old Photos with AI
          </motion.h1>
          <motion.p
            className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Bring your memories back to life. Get 1 free restoration daily, or buy credits for unlimited restorations.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoaded && isSignedIn ? (
              <Link href="/restore">
                <Button size="lg" className="gap-2 px-8">
                  Go to Restore
                </Button>
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="gap-2 px-8">
                  Get Started Free
                </Button>
              </SignUpButton>
            )}
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Before/After Comparison */}
          <motion.div className="mt-16 w-full max-w-4xl" variants={fadeInUp} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/3] border-r border-border">
                  <Image
                    src="/old-damaged-faded-vintage-family-photo-with-scratc.jpg"
                    alt="Before: Old damaged photo"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 50vw, 400px"
                  />
                  <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-sm font-medium backdrop-blur">
                    Before
                  </div>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/restored-clear-sharp-vibrant-family-photo-professi.jpg"
                    alt="After: Restored photo"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 50vw, 400px"
                  />
                  <div className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                    After
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
