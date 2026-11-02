import { describe, it, expect } from "vitest"
import { renderToString } from "react-dom/server"

import { HomeFaq } from "@/components/home/home-faq"
import { UseCaseFAQ } from "@/components/use-case/use-case-faq"
import { homepageFaqs } from "@/lib/seo/faq-data"

/**
 * FAQ answers are listed in FAQPage structured data, so search engines must
 * find them in the server HTML even while every accordion item is closed.
 */

/** React escapes text in markup, so compare against escaped answers. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

describe("FAQ accordions", () => {
  it("send every home FAQ answer in the server HTML while closed", () => {
    const html = renderToString(<HomeFaq />)

    for (const faq of homepageFaqs) {
      expect(html).toContain(escapeHtml(faq.answer))
    }
  })

  it("send every use-case FAQ answer in the server HTML while closed", () => {
    const faqs = [
      { question: "Does it work on torn prints?", answer: "Yes, small tears are filled in." },
      { question: "How long does it take?", answer: "Usually under a minute." },
    ]
    const html = renderToString(<UseCaseFAQ faqs={faqs} />)

    for (const faq of faqs) {
      expect(html).toContain(faq.answer)
    }
  })
})
