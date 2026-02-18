import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageFilename: string;
  publishDate: string;
  body: string;
  jsonLdSchema: string;
  topic?: string;
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
}

function parsePost(filename: string): BlogPost {
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  const slug = data.slug || filename.replace(/\.md$/, "");
  const date = data.date
    ? data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date).slice(0, 10)
    : "";

  return {
    title: data.title || "",
    slug,
    description: data.description || "",
    featuredImage: data.featured_image || "",
    featuredImageAlt: data.featured_image_alt || "",
    featuredImageFilename: "",
    publishDate: date,
    body: content.trim(),
    jsonLdSchema: data.json_ld || "",
    topic: data.topic || "",
  };
}

export function getAllPosts(): BlogPost[] {
  return getPostFiles()
    .map((f) => parsePost(f))
    .filter((p) => p.slug && p.title)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const files = getPostFiles();
  for (const f of files) {
    const post = parsePost(f);
    if (post.slug === slug) return post;
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getPostFiles().map((f) => parsePost(f).slug);
}

/** Return raw content + frontmatter for a slug (for LLM endpoints). */
export function getRawContent(slug: string): { meta: Omit<BlogPost, "body">; content: string } | null {
  const files = getPostFiles();
  for (const f of files) {
    const post = parsePost(f);
    if (post.slug === slug) {
      const { body, ...meta } = post;
      return { meta, content: body };
    }
  }
  return null;
}
