"use client"

import { LogIn, Upload, Sparkles, Download } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: LogIn,
    step: "1",
    title: "Sign in with Google",
    description: "Quick and secure authentication to get started instantly.",
  },
  {
    icon: Upload,
    step: "2",
    title: "Upload your old photo",
    description: "Drag and drop or select any old, blurry, or damaged photo.",
  },
  {
    icon: Sparkles,
    step: "3",
    title: "AI restores it instantly",
    description: "Our GFPGAN model enhances faces and fixes damage in seconds.",
  },
  {
    icon: Download,
    step: "4",
    title: "Download your restored photo",
    description: "Get your high-quality restored photo ready to share.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorksSection() {
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">Restore your photos in just a few simple steps.</p>
        </motion.div>
        <motion.div
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {steps.map((item, index) => (
            <motion.div key={item.step} className="relative text-center" variants={stepVariants}>
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="h-8 w-8 text-primary" />
              </motion.div>
              <div className="absolute -right-4 top-6 hidden text-4xl font-bold text-muted-foreground/20 lg:block">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div
                  className="absolute right-0 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-primary/20 to-transparent lg:block"
                  style={{ left: "60%", width: "80%" }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
