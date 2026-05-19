type Thing = Record<string, unknown>;

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.dev";
const SITE_NAME = "Magic Memory";
const SITE_TITLE = "Magic Memory - AI-Powered Photo Restoration";

export const organizationJsonLd = (
  name: string = SITE_NAME,
  url: string = SITE_URL,
  logo: string = `${SITE_URL}/icon.svg`
): Thing => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name,
  url,
  logo,
  sameAs: [
    "https://twitter.com/KazakisThanos",
    "https://github.com/ThanosKa/magic-memory",
  ],
});

export const webApplicationJsonLd = (): Thing => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_TITLE,
  description:
    "AI-powered photo restoration service that brings your old memories back to life using GFPGAN technology.",
  url: SITE_URL,
  applicationCategory: "PhotographyApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description:
      "1 free restoration per day, with paid credit packages available",
  },
  featureList: [
    "AI-powered face restoration using GFPGAN",
    "Free daily restoration credit",
    "Instant results in 5-15 seconds",
    "Interactive before/after comparison",
    "No persistent image storage",
    "Secure authentication with Google",
  ],
});

export const breadcrumbJsonLd = (
  items: Array<{ name: string; url: string }>
): Thing => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export const productJsonLd = (product: {
  name: string;
  description: string;
  sku?: string;
  brand?: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
  };
}): Thing => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  brand: product.brand || SITE_NAME,
  sku: product.sku,
  offers: {
    "@type": "Offer",
    ...product.offers,
  },
});

export const offerCatalogJsonLd = (
  offers: Array<{
    name: string;
    description: string;
    price: number;
    credits: number;
  }>
): Thing => ({
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: `${SITE_NAME} Pricing Plans`,
  description: "Photo restoration credit packages that never expire",
  itemListElement: offers.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    price: offer.price,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: `${offer.credits} Photo Restoration Credits`,
      description: offer.description,
    },
  })),
});

export const faqPageJsonLd = (
  faqs: Array<{ question: string; answer: string }>
): Thing => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const getCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

export const getOgImageUrl = (
  imagePath: string = "/og-image-restore.png"
): string => {
  if (imagePath.startsWith("http")) return imagePath;
  return `${SITE_URL}${imagePath}`;
};

export const defaultMetadata = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  twitterHandle: "@KazakisThanos",
  ogType: "website" as const,
  locale: "en_US",
};

export const useCaseSoftwareJsonLd = (params: {
  name: string;
  description: string;
  url: string;
  category?: string;
}): Thing => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: params.name,
  description: params.description,
  url: params.url.startsWith("http") ? params.url : `${SITE_URL}${params.url}`,
  applicationCategory: params.category || "PhotographyApplication",
  applicationSubCategory: "PhotoRestoration",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "0",
    highPrice: "29.99",
    offerCount: 4,
    description:
      "1 free restoration per day plus one-time credit packs from €9.99 to €29.99",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "126",
    bestRating: "5",
    worstRating: "1",
  },
});

export const howToJsonLd = (params: {
  name: string;
  description?: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}): Thing => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: params.name,
  description: params.description,
  totalTime: params.totalTime || "PT15S",
  step: params.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});
