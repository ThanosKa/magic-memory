"use client"

import { Sparkles, Gift, CreditCard, Zap, Download } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Restoration",
    description: "Using advanced GFPGAN model to restore faces and enhance photo quality automatically.",
  },
  {
    icon: Gift,
    title: "Free Daily Restoration",
    description: "Get 1 free restoration every day. No credit card required to start.",
  },
  {
    icon: CreditCard,
    title: "Affordable Credit Packages",
    description: "Purchase credits that never expire. Use them whenever you need.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your restored photos in just 5-15 seconds. Fast and efficient.",
  },
  {
    icon: Download,
    title: "High-Quality Downloads",
    description: "Download your restored photos in full resolution. Keep your memories forever.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to restore your photos</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful AI technology made simple and accessible for everyone.
          </p>
        </motion.div>
        <motion.div
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
