import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getCanonicalUrl } from "@/lib/seo/metadata-helpers";
import { blogPosts } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog/blog-card";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

export const metadata: Metadata = {
  title: "Blog — AI Photo Restoration Tips and Guides | Magic Memory",
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
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">Blog</span>
            </nav>

            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                AI Photo Restoration Blog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Guides, tutorials, and tips for restoring old photos with AI — from scanning advice to tool comparisons.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
