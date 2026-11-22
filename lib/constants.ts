export const CREDIT_PACKAGES = {
  starter: {
    name: "Starter",
    credits: 20,
    price: 999,
    priceDisplay: "€9.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    description: "Best for occasional use",
    popular: false,
    features: [
      "20 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
    ],
  },
  growth: {
    name: "Growth",
    credits: 60,
    price: 1999,
    priceDisplay: "€19.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH ?? "",
    description: "Best for regular users",
    popular: true,
    features: [
      "60 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium",
    credits: 120,
    price: 2999,
    priceDisplay: "€29.99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ?? "",
    description: "Best for professionals",
    popular: false,
    features: [
      "120 photo restorations",
      "Credits never expire",
      "High-quality results",
      "Fast processing",
      "Priority support",
    ],
  },
} as const;

export type PackageType = keyof typeof CREDIT_PACKAGES;

export function isPackageType(value: string): value is PackageType {
  return Object.hasOwn(CREDIT_PACKAGES, value);
}

export function perPhotoPrice(pkg: { price: number; credits: number }): string {
  return `€${(pkg.price / pkg.credits / 100).toFixed(2)}`;
}

export const APP_CONFIG = {
  name: "Magic Memory",
  description: "Magic Memory restores your old photos with AI",
  freeRestorationPerDay: 1,
  maxFileSize: 10 * 1024 * 1024,
  maxImageDimension: 4000,
  supportedFormats: ["image/jpeg", "image/png", "image/webp"],
  processingTimeSeconds: { min: 5, max: 60 },
} as const;
