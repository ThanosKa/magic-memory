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
    tagline: "Mobile-first AI photo enhancer",
    description:
      "Remini is a popular mobile app for enhancing and restoring photos using AI. It is widely used for portrait enhancement and is known for its ease of use on smartphones.",
    strengths: [
      "Strong mobile app with editing features",
      "Large user base and brand recognition",
      "Video enhancement capabilities",
    ],
    weaknesses: [
      "Weekly subscription required ($9.99/week)",
      "Mobile-only — no web access",
      "Photos stored in cloud without clear retention policy",
    ],
    pricing: "$9.99/week subscription",
    platform: "iOS and Android (mobile only)",
    features: [
      {
        label: "Price",
        magicMemory: "One-time credits (€9.99–€29.99)",
        competitor: "$9.99/week subscription",
      },
      {
        label: "Free tier",
        magicMemory: "1 restoration/day, no credit card",
        competitor: "Limited free tier",
      },
      {
        label: "Platform",
        magicMemory: "Web (any device)",
        competitor: "Mobile app only",
      },
      {
        label: "Photo storage",
        magicMemory: "None (privacy-first)",
        competitor: "Cloud stored",
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
    tagline: "Photo enhancement bundled with genealogy",
    description:
      "MyHeritage is primarily a genealogy platform that includes a photo enhancer tool. The photo restoration feature is bundled into a genealogy subscription, making it expensive if you only want photo restoration.",
    strengths: [
      "Excellent genealogy research tools",
      "Family tree building",
      "Deep roots in heritage and ancestry community",
    ],
    weaknesses: [
      "Photo restoration locked behind full genealogy subscription",
      "Expensive for users who only want photo restoration",
      "Interface designed for genealogy, not photo editing",
    ],
    pricing: "Bundled with genealogy subscription",
    platform: "Web",
    features: [
      {
        label: "Price",
        magicMemory: "One-time credits (€9.99–€29.99)",
        competitor: "Genealogy subscription bundle",
      },
      {
        label: "Free tier",
        magicMemory: "1 restoration/day, no credit card",
        competitor: "Very limited",
      },
      {
        label: "Platform",
        magicMemory: "Web (any device)",
        competitor: "Web",
      },
      {
        label: "Standalone photo tool",
        magicMemory: "Yes",
        competitor: "No — bundled with genealogy",
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
        competitor: "Credits from $4.95/month",
      },
      {
        label: "Free tier",
        magicMemory: "1 restoration/day, no credit card",
        competitor: "3 free images/month",
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
