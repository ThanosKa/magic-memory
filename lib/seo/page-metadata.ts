import type { Metadata } from "next"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"

type PageMetadataInput = {
  path: string
  title: string
  description: string
  social: { title: string; description: string; imageAlt: string }
  twitter?: { title: string; description: string }
}

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
