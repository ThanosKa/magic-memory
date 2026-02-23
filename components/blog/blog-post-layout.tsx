import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog/posts";

type BlogPostLayoutProps = {
  post: BlogPost;
  children: React.ReactNode;
};

export function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">{post.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-6">
          <time dateTime={post.datePublished}>Published {post.date}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <time dateTime={post.dateModified}>Last updated: {post.dateModified}</time>
        </div>
      </header>

      <div className="article-body">
        {children}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Ready to restore your photos?
        </h2>
        <p className="text-muted-foreground mb-6">
          Start with your free daily restoration. No credit card required.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8">Restore a Photo Free</Button>
        </Link>
      </div>
    </article>
  );
}
