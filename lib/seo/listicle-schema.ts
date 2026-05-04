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
};

const bestAiPhotoRestoration: ListicleEntry[] = [
  {
    position: 1,
    name: "Magic Memory",
    url: `${SITE_URL}/`,
    description:
      "Web-based AI photo restoration using GFPGAN. Free daily credit, one-time credit packs that never expire, no persistent photo storage.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "Web",
    offers: { price: "0", priceCurrency: "EUR" },
  },
  {
    position: 2,
    name: "Remini",
    url: "https://remini.ai",
    description:
      "Mobile photo enhancement app with face restoration and video enhancement. Weekly subscription, mobile-only.",
    applicationCategory: "PhotographyApplication",
    operatingSystem: "iOS, Android",
    offers: { price: "9.99", priceCurrency: "USD" },
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
  },
];

const listicles: Record<string, ListicleEntry[]> = {
  "best-ai-photo-restoration": bestAiPhotoRestoration,
};

export function listicleItemListJsonLd(slug: string): Thing | null {
  const items = listicles[slug];
  if (!items) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
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
      },
    })),
  };
}
