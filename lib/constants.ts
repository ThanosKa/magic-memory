export const CREDIT_PACKAGES = {
  starter: {
    name: "Starter",
    credits: 100,
    price: 999, // in cents (€9.99)
    priceDisplay: "€9.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    description: "Best for occasional use",
    popular: false,
    features: [
      "100 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
    ],
  },
  growth: {
    name: "Growth",
    credits: 350,
    price: 1999, // in cents (€19.99)
    priceDisplay: "€19.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH ?? "",
    description: "Best for regular users",
    popular: true,
    features: [
      "350 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium",
    credits: 1000,
    price: 2999, // in cents (€29.99)
    priceDisplay: "€29.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ?? "",
    description: "Best for professionals",
    popular: false,
    features: [
      "1000 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
      "Priority support",
      "Bulk processing",
    ],
  },
} as const;

export type PackageType = keyof typeof CREDIT_PACKAGES;

export const APP_CONFIG = {
  name: "RestorePhotos",
  description: "Restore your old photos with AI",
  freeRestorationPerDay: 1,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxImageDimension: 4000, // 4000x4000 max for GFPGAN
  supportedFormats: ["image/jpeg", "image/png", "image/webp"],
  processingTimeSeconds: { min: 5, max: 60 },
} as const;
