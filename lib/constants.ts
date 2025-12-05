// Credit packages configuration
export const CREDIT_PACKAGES = {
  starter: {
    name: "Starter",
    credits: 100,
    price: 900, // in cents ($9)
    priceDisplay: "$9",
    description: "Best for occasional use",
    popular: false,
    features: ["100 photo restorations", "Credits never expire", "High-quality results", "Fast processing"],
  },
  growth: {
    name: "Growth",
    credits: 350,
    price: 1900, // in cents ($19)
    priceDisplay: "$19",
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
    price: 2900, // in cents ($29)
    priceDisplay: "$29",
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
} as const

export type PackageType = keyof typeof CREDIT_PACKAGES

// App configuration
export const APP_CONFIG = {
  name: "RestorePhotos",
  description: "Restore your old photos with AI",
  freeRestorationPerDay: 1,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxImageDimension: 4000, // 4000x4000 max for GFPGAN
  supportedFormats: ["image/jpeg", "image/png", "image/webp"],
  processingTimeSeconds: { min: 5, max: 60 },
} as const

