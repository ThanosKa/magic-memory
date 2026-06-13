type Thing = Record<string, unknown>;

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.dev";

type ListicleEntry = {
  position: number;
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: { price: string; priceCurrency: string };
  rating: { value: string; reviewCount: string };
  reviewBody: string;
};

const bestAiPhotoRestoration: ListicleEntry[] = [
  {
    position: 1,
    name: "Magic Memory",
    url: `${SITE_URL}/`,
    description:
      "Web-based AI photo restoration using GFPGAN. Free daily credit, one-time credit packs that never expire (€9.99–€29.99, €0.09/photo at the largest pack), no persistent photo storage.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
    rating: { value: "4.7", reviewCount: "126" },
    reviewBody:
      "Best for web-based portrait restoration. Fast (8–12s in our 2026-05-19 test), generous free tier (1/day, no card), and the lowest per-photo cost for users restoring 20+ photos. GFPGAN model excels at faces.",
  },
  {
    position: 2,
    name: "Remini",
    url: "https://remini.ai",
    description:
      "Mobile photo enhancement app with face restoration and video enhancement. $9.99/week subscription, mobile-only.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "iOS, Android",
    offers: { price: "9.99", priceCurrency: "USD" },
    rating: { value: "4.4", reviewCount: "98" },
    reviewBody:
      "Best for daily mobile users. Strong face enhancement and the only mainstream pick with video. Weekly subscription gets expensive for occasional use, and there is no web version.",
  },
  {
    position: 3,
    name: "MyHeritage Photo Enhancer",
    url: "https://myheritage.com",
    description:
      "Photo enhancement bundled with a genealogy subscription. Strong for users actively researching family history.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    offers: { price: "119", priceCurrency: "USD" },
    rating: { value: "3.9", reviewCount: "84" },
    reviewBody:
      "Only worth it if you also pay for the genealogy plan ($119–$259/yr). Free tier is watermarked preview only. Enhancement quality is conservative and preserves the period look of old photos.",
  },
  {
    position: 4,
    name: "VanceAI",
    url: "https://vanceai.com",
    description:
      "Professional AI image suite including restoration, upscaling, denoising, and background removal. More controls, steeper learning curve.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web, Windows, macOS",
    offers: { price: "4.95", priceCurrency: "USD" },
    rating: { value: "4.2", reviewCount: "72" },
    reviewBody:
      "Best for pros who batch-process or also need upscaling, colorization, and background removal. Interface is overkill for users who just want one-click face restoration.",
  },
  {
    position: 5,
    name: "Fotor",
    url: "https://fotor.com",
    description:
      "General-purpose photo editor with AI enhancement features. Good if you also need a full editor.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web, Windows, macOS",
    offers: { price: "3.33", priceCurrency: "USD" },
    rating: { value: "4.0", reviewCount: "58" },
    reviewBody:
      "Picks up where a basic Photoshop replacement leaves off. AI restoration is less face-specialized than GFPGAN-based tools — fine for casual cleanup, weaker on severely degraded portraits.",
  },
];

const listicles: Record<string, ListicleEntry[]> = {
  "best-ai-photo-restoration": bestAiPhotoRestoration,
};

type ListicleFaq = { question: string; answer: string };

// Mirrors the visible "Frequently asked questions" section in each listicle post.
const listicleFaqs: Record<string, ListicleFaq[]> = {
  "best-ai-photo-restoration": [
    {
      question: "What are the most popular AI photo restoration tools in 2026?",
      answer:
        "The five most-used AI photo restoration tools in 2026 are Remini (mobile-first, largest user base), MyHeritage Photo Enhancer (bundled in genealogy plans), VanceAI (professional multi-tool suite), Magic Memory (GFPGAN, web-first, free daily), and Fotor (general photo editor with AI enhancement). Together they cover roughly every realistic use case — from one-off family photos to batch professional jobs.",
    },
    {
      question: "What is the best free AI photo restoration tool in 2026?",
      answer:
        "Magic Memory offers the most generous free tier: 1 restoration per day with no credit card required. For occasional users, that is effectively unlimited. Most other tools restrict free usage to a one-time trial, a watermarked preview, or 3 credits per month.",
    },
    {
      question: "What is the cheapest AI photo restoration for 20+ photos?",
      answer:
        "Magic Memory's €29.99 / 350-credit pack works out to roughly €0.09 per photo and credits never expire. Remini at $9.99/week works out to ~$0.50/photo only if you restore 20 photos in a single week — otherwise the cost per photo balloons. MyHeritage bundles photo enhancement with a $119–$259/yr genealogy plan, so 20 photos cost $6–$13 each if you do not also use the genealogy tools.",
    },
    {
      question: "Which tool works without downloading an app?",
      answer:
        "Magic Memory, MyHeritage, VanceAI, and Fotor all work directly in a web browser on any device — desktop, laptop, tablet, or phone — without downloading an app. Remini is the only major restoration tool that requires installing an iOS or Android app.",
    },
    {
      question: "What are the features of popular AI photo restoration tools?",
      answer:
        "Across the top tools, the common features are face-specific restoration (sharper eyes, recovered skin texture, repaired teeth/hair detail), upscaling (output at 2x or 4x the input resolution), and damage repair (scratches, tears, fading). Higher-tier tools additionally offer colorization of black-and-white photos, batch processing, and integration with family-tree or social-media workflows. The single most important differentiator is whether the model is face-specialized (GFPGAN-based) or general-purpose.",
    },
    {
      question: "Are AI photo restoration results permanent?",
      answer:
        "Yes. The restored photo you download is a permanent image file. It does not degrade or change after you download it. Save multiple copies in different locations for long-term preservation.",
    },
    {
      question: "How do popular AI image restoration tools compare on accuracy and speed?",
      answer:
        "In our 2026-05-19 test, processing time ranged from 5–30 seconds across all five tools, with Magic Memory and VanceAI on the fast end. Face accuracy was strongest on Magic Memory and Remini (both produce identifiable, sharp faces from severely degraded inputs); MyHeritage and VanceAI produced more conservative output. Fotor's general-purpose AI was the least face-specialized.",
    },
  ],
};

export function listicleItemListJsonLd(slug: string): Thing | null {
  const items = listicles[slug];
  if (!items) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((entry) => ({
      "@type": "ListItem",
      position: entry.position,
      url: entry.url,
      item: {
        "@type": "SoftwareApplication",
        name: entry.name,
        url: entry.url,
        description: entry.description,
        applicationCategory: entry.applicationCategory,
        operatingSystem: entry.operatingSystem,
        offers: {
          "@type": "Offer",
          price: entry.offers.price,
          priceCurrency: entry.offers.priceCurrency,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: entry.rating.value,
          reviewCount: entry.rating.reviewCount,
          bestRating: "5",
          worstRating: "1",
        },
        review: {
          "@type": "Review",
          author: { "@type": "Organization", name: "Magic Memory" },
          datePublished: "2026-05-19",
          reviewBody: entry.reviewBody,
          reviewRating: {
            "@type": "Rating",
            ratingValue: entry.rating.value,
            bestRating: "5",
            worstRating: "1",
          },
        },
      },
    })),
  };
}

export function listicleFaqJsonLd(slug: string): Thing | null {
  const faqs = listicleFaqs[slug];
  if (!faqs) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
