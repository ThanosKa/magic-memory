"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    question: "How does AI photo restoration work?",
    answer:
      "Our service uses GFPGAN, a state-of-the-art AI model specifically designed for face restoration. It analyzes your photo, identifies facial features, and intelligently enhances them to remove blur, fix damage, and improve overall quality while preserving the original character of the photo.",
  },
  {
    question: "What types of photos can I restore?",
    answer:
      "You can restore old, faded, blurry, or damaged photos that contain faces. The AI works best on portrait-style photos where faces are clearly visible. We support JPEG and PNG formats up to 10MB in size.",
  },
  {
    question: "How long does the restoration process take?",
    answer:
      "Most restorations complete within 5-15 seconds. The exact time depends on the image size and current server load. You'll see a progress indicator while your photo is being processed.",
  },
  {
    question: "Do my free credits expire?",
    answer:
      "Free credits reset daily at midnight UTC. You get 1 free restoration per day. If you don't use it, it doesn't roll over. However, purchased credits never expire and remain in your account until you use them.",
  },
  {
    question: "What's the difference between free and paid credits?",
    answer:
      "Free credits give you 1 restoration per day and reset at midnight UTC. Paid credits are purchased in packages (100, 350, or 1000 credits) and never expire. When you restore a photo, we use your free credit first, then your paid credits.",
  },
  {
    question: "Can I get a refund for purchased credits?",
    answer:
      "We offer refunds for unused credits within 30 days of purchase. If you've used some credits from a package, we'll refund the prorated amount for unused credits. Contact our support team for assistance.",
  },
  {
    question: "Is my photo data secure?",
    answer:
      "Yes, we take privacy seriously. Your photos are processed securely and are not used for training AI models. Original and restored photos are stored in your private account and can be deleted at any time.",
  },
  {
    question: "What if the restoration doesn't look good?",
    answer:
      "AI restoration works best on certain types of photos. If your result isn't satisfactory, you can try uploading a different version of the photo or a higher resolution scan. We don't deduct credits for failed restorations.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about restoring your photos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
