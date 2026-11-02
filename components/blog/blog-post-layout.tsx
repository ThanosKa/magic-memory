import Link from "next/link";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import type { BlogPost } from "@/lib/blog/posts";

type BlogPostLayoutProps = {
  post: BlogPost;
  children: React.ReactNode;
};

export function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
  return (
    <PageContainer as="div" className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-sm text-paper/60">
          <Link href="/" className="focus-ring hover:text-paper">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="focus-ring hover:text-paper">
            Blog
          </Link>
          <span>/</span>
          <span className="text-paper truncate max-w-[200px]">
            {post.title}
          </span>
        </nav>

        <header className="mb-12">
          <h1 className="font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-6xl text-balance mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-paper/70 mb-6">{post.description}</p>
          <div className="font-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.14em] text-paper/60 border-t border-border pt-6">
            <time dateTime={post.datePublished}>Published {post.date}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <time dateTime={post.dateModified}>
              Last updated: {post.dateModified}
            </time>
          </div>
        </header>

        <div className="article-body">{children}</div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2 className="font-serif text-3xl leading-[1.1] tracking-[-0.02em] mb-3">
            Ready to restore your photos?
          </h2>
          <p className="text-paper/65 mb-8">
            Start with your free daily restoration. No credit card required.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              Restore a Photo Free
              <ButtonArrow />
            </Link>
          </Button>
        </div>
      </article>
    </PageContainer>
  );
}
