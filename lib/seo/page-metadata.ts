import type { Metadata } from "next"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"

type PageMetadataInput = {
  path: string
  title: string
  description: string
  /** Passed explicitly: social titles differ in format between pages. */
  social: { title: string; description: string; imageAlt: string }
  /** Only pages that have a Twitter card today pass this. */
  twitter?: { title: string; description: string }
}

/**
 * The `Metadata` a marketing page exports. Emits only the fields pages emit
 * today, because a page's metadata replaces the layout's Open Graph object
 * wholesale.
 */
export function pageMetadata({
  path,
  title,
  description,
  social,
  twitter,
}: PageMetadataInput): Metadata {
  const canonical = getCanonicalUrl(path)
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: social.title,
      description: social.description,
      url: canonical,
      images: [
        { url: getOgImageUrl(), width: 1200, height: 630, alt: social.imageAlt },
      ],
    },
    ...(twitter && {
      twitter: {
        card: "summary_large_image",
        title: twitter.title,
        description: twitter.description,
        images: [getOgImageUrl()],
      },
    }),
    robots: { index: true, follow: true },
  }
}
