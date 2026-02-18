import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

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

async function toHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  return String(result);
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
}

function parsePostRaw(filename: string): { post: BlogPost; rawContent: string } {
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
    rawContent: content.trim(),
    post: {
      title: data.title || "",
      slug,
      description: data.description || "",
      featuredImage: data.featured_image || "",
      featuredImageAlt: data.featured_image_alt || "",
      featuredImageFilename: "",
      publishDate: date,
      body: content.trim(), // replaced below if markdown
      jsonLdSchema: data.json_ld || "",
      topic: data.topic || "",
    },
  };
}

/** Returns true if content appears to be HTML (not raw markdown). */
function isHtml(content: string): boolean {
  return /^\s*</.test(content);
}

export function getAllPosts(): BlogPost[] {
  return getPostFiles()
    .map((f) => parsePostRaw(f).post)
    .filter((p) => p.slug && p.title)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const files = getPostFiles();
  for (const f of files) {
    const { post, rawContent } = parsePostRaw(f);
    if (post.slug === slug) {
      post.body = isHtml(rawContent) ? rawContent : await toHtml(rawContent);
      return post;
    }
  }
  return null;
}

export function getAllSlugs(): string[] {
  return getPostFiles().map((f) => parsePostRaw(f).post.slug);
}

/** Return raw content + frontmatter for a slug (for LLM endpoints). */
export function getRawContent(slug: string): { meta: Omit<BlogPost, "body">; content: string } | null {
  const files = getPostFiles();
  for (const f of files) {
    const { post, rawContent } = parsePostRaw(f);
    if (post.slug === slug) {
      const { body, ...meta } = post;
      return { meta, content: rawContent };
    }
  }
  return null;
}
