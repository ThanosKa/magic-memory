"use client"
import { motion } from "framer-motion"
import { AuthButton } from "@/components/auth/auth-button"

export function CTASection() {
  return (
    <section className="bg-primary py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ready to restore your memories?
          </motion.h2>
          <motion.p
            className="mt-4 max-w-xl text-lg text-primary-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start with your free daily restoration. No credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <AuthButton variant="secondary" size="lg" className="mt-8 gap-2 px-8" showArrow>
              Get Started Free
            </AuthButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
