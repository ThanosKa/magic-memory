"use client"

import { Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function SocialProof() {
  return (
    <section className="border-y border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-background bg-accent overflow-hidden"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Image
                  src={`/happy-user-avatar-.jpg?height=32&width=32&query=happy user avatar ${i}`}
                  alt={`User ${i}`}
                  width={32}
                  height={32}
                  className="object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Used by over <span className="text-primary">470,000+</span> happy users
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
