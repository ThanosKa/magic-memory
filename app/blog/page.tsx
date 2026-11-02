import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl } from "@/lib/seo/metadata-helpers";
import { blogPosts } from "@/lib/blog/posts";
import { PageContainer } from "@/components/layout/page-container";
import { BlogCard } from "@/components/blog/blog-card";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "Blog — AI Photo Restoration Tips and Guides",
  description:
    "Learn how to restore old photos, understand AI photo restoration technology, and compare tools. Guides, tips, and tutorials from the Magic Memory team.",
  alternates: { canonical: getCanonicalUrl("/blog") },
  openGraph: {
    title: "Blog — AI Photo Restoration Tips and Guides | Magic Memory",
    description: "Guides and tutorials for AI photo restoration.",
    url: getCanonicalUrl("/blog"),
  },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24">
          <PageContainer>
            <nav className="mb-8 flex items-center gap-2 text-sm text-paper/60">
              <Link href="/" className="focus-ring hover:text-paper">Home</Link>
              <span>/</span>
              <span className="text-paper">Blog</span>
            </nav>

            <div className="mb-12">
              <h1 className="font-serif text-5xl leading-[1.02] tracking-[-0.03em] sm:text-7xl mb-5">
                AI Photo Restoration Blog
              </h1>
              <p className="text-lg text-paper/70 max-w-2xl">
                Guides, tutorials, and tips for restoring old photos with AI — from scanning advice to tool comparisons.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
