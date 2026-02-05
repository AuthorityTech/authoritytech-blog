import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/sheets';
import { normalizeBlogPostJsonLd } from '@/lib/utils';
import type { Metadata } from 'next';

export const revalidate = 300; // Revalidate every 5 minutes

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const BASE_URL = 'https://blog.authoritytech.io';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const postUrl = `${BASE_URL}/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishDate,
      authors: ['Jaxon Parrott'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = post.jsonLdSchema
    ? normalizeBlogPostJsonLd(post.jsonLdSchema, slug, post.publishDate)
    : null;

  return (
    <div className="min-h-dvh bg-background">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-ui text-muted-foreground transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0 rounded-md"
          >
            ← Back
          </Link>
        </div>
        {post.featuredImage && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8 border border-border">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 896px"
            />
          </div>
        )}

        {post.topic && (
          <span className="text-3xs font-medium tracking-wide uppercase font-ui text-muted-foreground">
            {post.topic}
          </span>
        )}

        <h1 className="mt-2 text-2xl font-medium tracking-tight font-serif text-foreground text-balance">
          {post.title}
        </h1>

        <p className="mt-3 text-sm font-ui text-muted-foreground text-pretty">
          {post.description}
        </p>

        <time className="mt-6 block text-xs font-ui text-muted-foreground tabular-nums border-b border-border pb-6">
          {new Date(post.publishDate + 'T12:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>

        <div
          className="prose prose-sm max-w-none font-ui mt-8"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <aside
          className="mt-12 pt-8 border-t border-border"
          aria-label="About the author"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src="/jaxon-parrott.png"
                alt="Jaxon Parrott"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <p className="font-ui font-medium text-foreground">Jaxon Parrott</p>
              <p className="text-sm font-ui text-muted-foreground">
                Founder & CEO, AuthorityTech
              </p>
            </div>
          </div>
        </aside>
      </article>

      <footer className="border-t border-border mt-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-muted-foreground font-ui text-xs">
          <p>© {new Date().getFullYear()} AuthorityTech</p>
        </div>
      </footer>
    </div>
  );
}
