import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/lib/blog/posts";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg h-full">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground mb-3">
            {post.date} · {post.readingTime} min read
          </p>
          <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
          <p className="mt-4 text-sm font-medium text-primary">Read article →</p>
        </CardContent>
      </Card>
    </Link>
  );
}
