export type CompetitorFeature = {
  label: string;
  magicMemory: string;
  competitor: string;
};

export type Competitor = {
  id: string;
  name: string;
  slug: string;
  url: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  platform: string;
  features: CompetitorFeature[];
};

export const competitors: Record<string, Competitor> = {
  remini: {
    id: "remini",
    name: "Remini",
    slug: "remini",
    url: "https://remini.ai",
    tagline: "AI photo enhancer app, best known on phones",
    description:
      "Remini is a popular AI photo enhancer, best known as a phone app, with a web version at app.remini.ai. It is widely used for portrait enhancement.",
    strengths: [
      "Strong mobile app with editing features",
      "Large user base and brand recognition",
      "Web version as well as the app",
    ],
    weaknesses: [
      "Recurring in-app subscription (weekly, monthly and yearly options)",
      "Poor value if you only have a few photos",
    ],
    pricing: "In-app subscription (weekly, monthly and yearly options)",
    platform: "Phone app and web (app.remini.ai)",
    features: [
      {
        label: "Price",
        magicMemory: "One-time credits (€9.99–€29.99)",
        competitor: "In-app subscription, weekly, monthly or yearly",
      },
      {
        label: "Free tier",
        magicMemory: "None (a failed restoration costs no credit)",
        competitor: "Limited free tier",
      },
      {
        label: "Platform",
        magicMemory: "Web (any device)",
        competitor: "Phone app and web",
      },
      {
        label: "Photo storage",
        magicMemory: "None (privacy-first)",
        competitor: "See Remini's privacy policy",
      },
      {
        label: "Processing time",
        magicMemory: "5–15 seconds",
        competitor: "5–30 seconds",
      },
      {
        label: "AI model",
        magicMemory: "GFPGAN",
        competitor: "Proprietary",
      },
      {
        label: "Credits expire",
        magicMemory: "Never",
        competitor: "N/A (subscription)",
      },
    ],
  },
  myheritage: {
    id: "myheritage",
    name: "MyHeritage Photo Enhancer",
    slug: "myheritage",
    url: "https://myheritage.com",
    tagline: "Photo enhancement from a genealogy platform",
    description:
      "MyHeritage is primarily a genealogy platform that includes a photo enhancer tool. Unlimited use of its Photo Enhancer comes with the MyHeritage Photo subscription or a plan that includes it, so you pay a recurring subscription even if you only have a few photos.",
    strengths: [
      "Excellent genealogy research tools",
      "Family tree building",
      "Deep roots in heritage and ancestry community",
    ],
    weaknesses: [
      "Unlimited enhancing needs a recurring subscription",
      "Poor value if you only have a few photos",
      "Interface designed for genealogy, not photo editing",
    ],
    pricing: "Photo subscription, or a plan that includes it",
    platform: "Web",
    features: [
      {
        label: "Price",
        magicMemory: "One-time credits (€9.99–€29.99)",
        competitor: "Photo subscription or a plan that includes it",
      },
      {
        label: "Free tier",
        magicMemory: "None (a failed restoration costs no credit)",
        competitor: "Limited free use; number not stated",
      },
      {
        label: "Platform",
        magicMemory: "Web (any device)",
        competitor: "Web",
      },
      {
        label: "Standalone photo tool",
        magicMemory: "Yes",
        competitor: "Yes — Photo subscription (recurring)",
      },
      {
        label: "Processing time",
        magicMemory: "5–15 seconds",
        competitor: "Variable",
      },
      {
        label: "Privacy",
        magicMemory: "No persistent storage",
        competitor: "Photos stored in account",
      },
      {
        label: "Credits expire",
        magicMemory: "Never",
        competitor: "N/A (subscription)",
      },
    ],
  },
  vanceai: {
    id: "vanceai",
    name: "VanceAI",
    slug: "vanceai",
    url: "https://vanceai.com",
    tagline: "Professional AI image tools suite",
    description:
      "VanceAI is a professional-grade image enhancement suite with many tools including photo restoration, upscaling, and background removal. It is desktop-focused with a more complex interface suited for power users.",
    strengths: [
      "Many AI tools in one platform",
      "High level of control and customization",
      "Batch processing capabilities",
    ],
    weaknesses: [
      "Complex interface — steep learning curve",
      "More expensive for casual users",
      "Overwhelming for people who just want one-click restoration",
    ],
    pricing: "Credit-based and subscription plans",
    platform: "Web and desktop",
    features: [
      {
        label: "Price",
        magicMemory: "One-time credits (€9.99–€29.99)",
        competitor: "Monthly credits from $15/month billed yearly",
      },
      {
        label: "Free tier",
        magicMemory: "None (a failed restoration costs no credit)",
        competitor: "10 credits to try",
      },
      {
        label: "Platform",
        magicMemory: "Web (any device)",
        competitor: "Web and desktop",
      },
      {
        label: "Ease of use",
        magicMemory: "One-click restoration",
        competitor: "Multiple tools and options",
      },
      {
        label: "Processing time",
        magicMemory: "5–15 seconds",
        competitor: "5–60 seconds",
      },
      {
        label: "AI model",
        magicMemory: "GFPGAN",
        competitor: "Proprietary suite",
      },
      {
        label: "Batch processing",
        magicMemory: "Sequential",
        competitor: "Yes",
      },
    ],
  },
};

export const allCompetitors = Object.values(competitors);
