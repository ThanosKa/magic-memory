import { createHash } from "node:crypto"
import { describe, expect, it, vi } from "vitest"
import { blogPosts } from "@/lib/blog/posts"

// Pages read these at import time, and CI sets different values than a laptop,
// so pin them before any page is imported (vi.hoisted runs first).
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_APP_URL = "https://magic-memory.dev"
  process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER = "price_snapshot_starter"
  process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH = "price_snapshot_growth"
  process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM = "price_snapshot_premium"
})

// /restore redirects signed-out visitors, so the tests call it as a signed-in user.
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => Promise.resolve({ userId: "user_snapshot" })),
}))

// Safety net for the marketing pages' <head>: records each page's exported
// metadata and the application/ld+json scripts in the tree its page function
// returns. Pages are called as plain functions, nothing is rendered.

type PageModule = {
  metadata?: unknown
  generateMetadata?: (props: {
    params: Promise<{ slug: string }>
  }) => Promise<unknown>
  default: (props: never) => unknown
}

const PAGES: Record<string, () => Promise<PageModule>> = {
  // 10 use-case pages
  "/fix-blurry-photos": () => import("@/app/fix-blurry-photos/page"),
  "/restore-portrait-photos": () => import("@/app/restore-portrait-photos/page"),
  "/restore-family-photos": () => import("@/app/restore-family-photos/page"),
  "/restore-damaged-photos": () => import("@/app/restore-damaged-photos/page"),
  "/restore-black-and-white-photos": () =>
    import("@/app/restore-black-and-white-photos/page"),
  "/restore-old-photos": () => import("@/app/restore-old-photos/page"),
  "/restore-faded-photos": () => import("@/app/restore-faded-photos/page"),
  "/enhance-old-photos": () => import("@/app/enhance-old-photos/page"),
  "/restore-wedding-photos": () => import("@/app/restore-wedding-photos/page"),
  "/restore-vintage-photos": () => import("@/app/restore-vintage-photos/page"),
  // 5 glossary
  "/glossary/photo-restoration": () =>
    import("@/app/glossary/photo-restoration/page"),
  "/glossary/face-restoration": () =>
    import("@/app/glossary/face-restoration/page"),
  "/glossary/image-upscaling": () =>
    import("@/app/glossary/image-upscaling/page"),
  "/glossary/gfpgan": () => import("@/app/glossary/gfpgan/page"),
  "/glossary/ai-photo-enhancement": () =>
    import("@/app/glossary/ai-photo-enhancement/page"),
  // 3 vs
  "/vs/remini": () => import("@/app/vs/remini/page"),
  "/vs/myheritage": () => import("@/app/vs/myheritage/page"),
  "/vs/vanceai": () => import("@/app/vs/vanceai/page"),
  // 4 alternatives, including the index
  "/alternatives": () => import("@/app/alternatives/page"),
  "/alternatives/remini": () => import("@/app/alternatives/remini/page"),
  "/alternatives/myheritage": () => import("@/app/alternatives/myheritage/page"),
  "/alternatives/vanceai": () => import("@/app/alternatives/vanceai/page"),
  // 3 for
  "/for/real-estate": () => import("@/app/for/real-estate/page"),
  "/for/genealogists": () => import("@/app/for/genealogists/page"),
  "/for/photographers": () => import("@/app/for/photographers/page"),
  // 2 blog pages (the post page generates its metadata per slug)
  "/blog": () => import("@/app/blog/page"),
  "/blog/[slug]": () => import("@/app/blog/[slug]/page"),
  // restore and pricing
  "/restore": () => import("@/app/restore/page"),
  "/pricing": () => import("@/app/pricing/page"),
}

function collectJsonLd(node: unknown, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((child) => collectJsonLd(child, found))
    return found
  }
  if (!node || typeof node !== "object") return found
  const element = node as {
    type?: unknown
    props?: {
      type?: string
      children?: unknown
      dangerouslySetInnerHTML?: { __html: string }
    }
  }
  if (!element.props) return found
  if (
    element.type === "script" &&
    element.props.type === "application/ld+json"
  ) {
    found.push(element.props.dangerouslySetInnerHTML?.__html ?? "")
  }
  collectJsonLd(element.props.children, found)
  return found
}

function describeJsonLd(raws: string[]) {
  return raws.map((raw) => ({
    // the exact serialised text is pinned by its hash, the parsed object keeps diffs readable
    sha256: createHash("sha256").update(raw).digest("hex"),
    data: JSON.parse(raw),
  }))
}

async function headOf(path: string, slug?: string) {
  const page = await PAGES[path]()
  const params = slug ? { params: Promise.resolve({ slug }) } : undefined
  const metadata = page.generateMetadata
    ? await page.generateMetadata(params as never)
    : page.metadata
  const tree = await page.default(params as never)
  return { metadata, jsonLd: describeJsonLd(collectJsonLd(tree)) }
}

describe("marketing page head snapshot", () => {
  it("covers the 29 marketing pages", () => {
    expect(Object.keys(PAGES)).toHaveLength(29)
  })

  it("records metadata and structured data for every page", async () => {
    const heads: Record<string, unknown> = {}
    for (const path of Object.keys(PAGES)) {
      if (path === "/blog/[slug]") {
        for (const post of blogPosts) {
          heads[`/blog/${post.slug}`] = await headOf(path, post.slug)
        }
      } else {
        heads[path] = await headOf(path)
      }
    }
    expect(heads).toMatchSnapshot()
  }, 60_000)
})
