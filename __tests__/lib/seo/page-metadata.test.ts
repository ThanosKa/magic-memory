import { describe, expect, it } from "vitest"
import { getCanonicalUrl, getOgImageUrl } from "@/lib/seo/metadata-helpers"
import { pageMetadata } from "@/lib/seo/page-metadata"

const input = {
  path: "/some-page",
  title: "Some Page",
  description: "About some page.",
  social: {
    title: "Some Page — Magic Memory",
    description: "Social blurb.",
    imageAlt: "Some alt",
  },
}

describe("pageMetadata", () => {
  it("returns the metadata a page exports today, without a twitter card", () => {
    expect(pageMetadata(input)).toEqual({
      title: "Some Page",
      description: "About some page.",
      alternates: { canonical: getCanonicalUrl("/some-page") },
      openGraph: {
        title: "Some Page — Magic Memory",
        description: "Social blurb.",
        url: getCanonicalUrl("/some-page"),
        images: [
          { url: getOgImageUrl(), width: 1200, height: 630, alt: "Some alt" },
        ],
      },
      robots: { index: true, follow: true },
    })
    expect(pageMetadata(input)).not.toHaveProperty("twitter")
  })

  it("adds the large-image card when twitter is passed", () => {
    expect(
      pageMetadata({
        ...input,
        twitter: { title: "Tw title", description: "Tw blurb." },
      }).twitter
    ).toEqual({
      card: "summary_large_image",
      title: "Tw title",
      description: "Tw blurb.",
      images: [getOgImageUrl()],
    })
  })

  it("keeps the canonical equal to the Open Graph URL", () => {
    const metadata = pageMetadata(input)
    expect(metadata.alternates?.canonical).toBe(
      (metadata.openGraph as { url: string }).url
    )
  })
})
