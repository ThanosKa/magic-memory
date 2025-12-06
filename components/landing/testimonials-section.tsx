"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Twitter } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    quote: "Absolutely incredible! I restored my grandmother's wedding photo from 1952 and my family was in tears.",
    author: "Sarah M.",
    role: "Family Historian",
    twitter: "https://twitter.com",
  },
  {
    quote: "The AI quality is mind-blowing. My old damaged photos look like they were taken yesterday.",
    author: "Michael K.",
    role: "Photographer",
    twitter: "https://twitter.com",
  },
  {
    quote: "So easy to use! I've restored over 50 family photos. Best investment I've ever made.",
    author: "Jennifer L.",
    role: "Mother of 3",
    twitter: "https://twitter.com",
  },
  {
    quote: "The free daily restoration is perfect for my needs. I love that I can try before buying.",
    author: "David R.",
    role: "Hobbyist",
    twitter: "https://twitter.com",
  },
  {
    quote: "Professional quality results in seconds. This tool has saved me hours of manual editing.",
    author: "Emily C.",
    role: "Graphic Designer",
    twitter: "https://twitter.com",
  },
  {
    quote: "I've tried other tools but Magic Memory is by far the best. The face enhancement is incredible.",
    author: "James W.",
    role: "Content Creator",
    twitter: "https://twitter.com",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by thousands of users</h2>
          <p className="mt-4 text-lg text-muted-foreground">See what our community is saying about Magic Memory.</p>
        </motion.div>
        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="border-border bg-card transition-all hover:shadow-lg h-full">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent overflow-hidden">
                        <Image
                          src={`/.jpg?height=40&width=40&query=${testimonial.author} avatar`}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <a
                      href={testimonial.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">View on Twitter</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
