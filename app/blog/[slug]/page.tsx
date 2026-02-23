import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getCanonicalUrl, getOgImageUrl, breadcrumbJsonLd } from "@/lib/seo/metadata-helpers";
import { blogPosts, getBlogPost } from "@/lib/blog/posts";
import { BlogPostLayout } from "@/components/blog/blog-post-layout";

// Content components
import { HowToRestoreOldPhotosContent } from "@/lib/blog/posts/how-to-restore-old-photos";
import { BestAIPhotoRestorationContent } from "@/lib/blog/posts/best-ai-photo-restoration";
import { GFPGANExplainedContent } from "@/lib/blog/posts/gfpgan-explained";
import { RestoreOldFamilyPhotosTipsContent } from "@/lib/blog/posts/restore-old-family-photos-tips";
import { PhotoRestorationBeforeAfterContent } from "@/lib/blog/posts/photo-restoration-before-after";
import { AIPhotoRestorationVsPhotoshopContent } from "@/lib/blog/posts/ai-photo-restoration-vs-photoshop";

const Header = dynamic(() => import("@/components/header").then((m) => m.Header), { ssr: true });
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer), { ssr: true });

const contentMap: Record<string, React.ComponentType> = {
  "how-to-restore-old-photos": HowToRestoreOldPhotosContent,
  "best-ai-photo-restoration": BestAIPhotoRestorationContent,
  "gfpgan-explained": GFPGANExplainedContent,
  "restore-old-family-photos-tips": RestoreOldFamilyPhotosTipsContent,
  "photo-restoration-before-after": PhotoRestorationBeforeAfterContent,
  "ai-photo-restoration-vs-photoshop": AIPhotoRestorationVsPhotoshopContent,
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: getCanonicalUrl(`/blog/${slug}`) },
    openGraph: {
      title: post.title,
      description: post.description,
      url: getCanonicalUrl(`/blog/${slug}`),
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [{ url: getOgImageUrl(), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [getOgImageUrl()],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const ContentComponent = contentMap[slug];

  if (!ContentComponent) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: "Magic Memory",
    },
    publisher: {
      "@type": "Organization",
      name: "Magic Memory",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://magic-memory.com"}/icon.svg`,
      },
    },
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Header />
      <main className="flex-1">
        <BlogPostLayout post={post}>
          <ContentComponent />
        </BlogPostLayout>
      </main>
      <Footer />
    </div>
  );
}
