export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  datePublished: string;
  dateModified: string;
  readingTime: number;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-restore-old-photos",
    title: "How to Restore Old Photos: A Complete Guide (2026)",
    description:
      "Learn how to restore old, damaged, and faded photos using AI tools. Covers scanning tips, AI restoration steps, and how to get the best results.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-02-23",
    readingTime: 8,
  },
  {
    slug: "best-ai-photo-restoration",
    title: "Best AI Photo Restoration Tools 2026: Remini, MyHeritage Tested",
    description:
      "Compared on real old photos: Remini ($9.99/wk), MyHeritage ($119/yr+), VanceAI, Fotor, and Magic Memory (free daily). Honest 2026 picks with pricing and speed.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-05-04",
    readingTime: 10,
  },
  {
    slug: "gfpgan-explained",
    title: "What is GFPGAN? How AI Face Restoration Works",
    description:
      "A plain-English explanation of GFPGAN — the AI model behind photo face restoration. Learn what it does, how it works, and what it excels at.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-02-23",
    readingTime: 7,
  },
  {
    slug: "restore-old-family-photos-tips",
    title: "How to Restore and Preserve Old Family Photos (Step-by-Step)",
    description:
      "A practical guide to scanning, restoring, organizing, and preserving old family photos. Includes AI restoration tips and long-term storage advice.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-02-23",
    readingTime: 9,
  },
  {
    slug: "photo-restoration-before-after",
    title: "Photo Restoration Before and After — Real AI Results",
    description:
      "See real before-and-after examples of AI photo restoration. Understand what changes, what to expect, and how to get the best results with Magic Memory.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-02-23",
    readingTime: 5,
  },
  {
    slug: "ai-photo-restoration-vs-photoshop",
    title: "AI Photo Restoration vs Photoshop — Which Is Better for Old Photos?",
    description:
      "AI restores a face in 15 seconds at €0.33/photo. Photoshop takes 1–4 hours plus a $20.99/month subscription. See which wins for old portraits, damage, and family photos.",
    date: "February 23, 2026",
    datePublished: "2026-02-23",
    dateModified: "2026-05-04",
    readingTime: 7,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
