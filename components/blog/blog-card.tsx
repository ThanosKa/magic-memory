import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="focus-ring group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-paper/30 sm:p-7"
    >
      <p className="font-mono mb-4 text-[11px] uppercase tracking-[0.18em] text-paper/60">
        {post.date} · {post.readingTime} min read
      </p>
      <h2 className="font-serif text-2xl leading-[1.15] tracking-[-0.02em] text-paper">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-paper/65">{post.description}</p>
      <p className="mt-auto pt-6 text-sm font-medium text-paper">
        <span className="border-b border-ember pb-0.5">Read article</span>
        <span
          aria-hidden="true"
          className="ml-2 inline-block transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </p>
    </Link>
  );
}
