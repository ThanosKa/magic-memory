type Thing = Record<string, unknown>;

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.dev";

type ListicleEntry = {
  position: number;
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: { price: string; priceCurrency: string };
  reviewBody: string;
};

const bestAiPhotoRestoration: ListicleEntry[] = [
  {
    position: 1,
    name: "Magic Memory",
    url: `${SITE_URL}/`,
    description:
      "Web-based AI photo restoration using GFPGAN. One-time credit packs that never expire (€9.99–€29.99, €0.25/photo at the largest pack), no persistent photo storage.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    offers: { price: "9.99", priceCurrency: "EUR" },
    reviewBody:
      "Best for web-based portrait restoration. GFPGAN face restoration at 2x resolution, no subscription, credits never expire, and photos are never stored on our servers.",
  },
  {
    position: 2,
    name: "Remini",
    url: "https://remini.ai",
    description:
      "Photo enhancement app with face restoration. In-app subscription with weekly and monthly options; iOS and web.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "iOS, Web",
    reviewBody:
      "Best for phone users who want an app. Strong face enhancement. A recurring subscription is poor value for a few photos.",
  },
  {
    position: 3,
    name: "MyHeritage Photo Enhancer",
    url: "https://myheritage.com",
    description:
      "Photo enhancement inside a genealogy platform. Unlimited use comes with the Photo subscription or a plan that includes it.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    reviewBody:
      "Best for people already researching their family history on MyHeritage. Sign-up is free, but unlimited enhancement needs a recurring plan, which is a lot for a one-off job.",
  },
  {
    position: 4,
    name: "VanceAI",
    url: "https://vanceai.com",
    description:
      "Professional AI image suite including restoration, upscaling, denoising, and background removal. More controls, steeper learning curve.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web, Windows",
    offers: { price: "15", priceCurrency: "USD" },
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
        "Five tools cover most needs in 2026: Remini (best known as a phone app), MyHeritage Photo Enhancer (part of a genealogy platform), VanceAI (professional multi-tool suite), Magic Memory (GFPGAN, web-first, one-time credits), and Fotor (general photo editor with AI enhancement). Together they span one-off family photos to batch professional jobs.",
    },
    {
      question: "What is the best free AI photo restoration tool in 2026?",
      answer:
        "Magic Memory has no free tier: restorations use one-time credits from €9.99 for 20, and a failed restoration costs no credit. Of the others, VanceAI gives 10 credits to try, Fotor has a free Basic plan with limited credits, and MyHeritage has free sign-up but does not publish a free-use limit.",
    },
    {
      question: "What is the cheapest AI photo restoration for 20+ photos?",
      answer:
        "Magic Memory's €29.99 / 120-credit pack works out to €0.25 per photo, and €9.99 buys 20 photos; credits never expire. Remini and MyHeritage sell recurring subscriptions, so their cost per photo depends on how many photos you restore before you cancel.",
    },
    {
      question: "Which tool works without downloading an app?",
      answer:
        "All five work in a web browser, so you can restore a photo without installing anything. Remini, MyHeritage, and Fotor also have mobile apps.",
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
        ...(entry.offers && {
          offers: {
            "@type": "Offer",
            price: entry.offers.price,
            priceCurrency: entry.offers.priceCurrency,
          },
        }),
        review: {
          "@type": "Review",
          author: { "@type": "Organization", name: "Magic Memory" },
          datePublished: "2026-11-13",
          reviewBody: entry.reviewBody,
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
