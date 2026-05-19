import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/posts";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.dev";

const LAST_REVIEWED = new Date("2026-05-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: LAST_REVIEWED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: LAST_REVIEWED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: LAST_REVIEWED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: LAST_REVIEWED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const useCasePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/restore-old-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/restore-wedding-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/restore-family-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/restore-black-and-white-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/restore-damaged-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fix-blurry-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/enhance-old-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/restore-vintage-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/restore-faded-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/restore-portrait-photos`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const competitorPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/alternatives`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/alternatives/remini`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/alternatives/myheritage`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/alternatives/vanceai`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/vs/remini`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/vs/myheritage`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vs/vanceai`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const glossaryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/glossary/photo-restoration`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/glossary/gfpgan`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/glossary/face-restoration`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/glossary/image-upscaling`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/glossary/ai-photo-enhancement`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const personaPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/for/genealogists`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/for/photographers`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/for/real-estate`,
      lastModified: LAST_REVIEWED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: LAST_REVIEWED, changeFrequency: "weekly", priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: new Date(post.dateModified),
    })),
  ];

  return [
    ...staticPages,
    ...useCasePages,
    ...competitorPages,
    ...glossaryPages,
    ...personaPages,
    ...blogPages,
  ];
}
