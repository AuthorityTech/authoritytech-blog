import { NextResponse } from "next/server";
import { getRawContent } from "@/lib/posts";

/**
 * GET /api/raw/:slug — Returns the raw content of a post.
 * Designed for LLM crawlers and readers who want plain text.
 * Responds with text/plain content type.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const result = getRawContent(slug);

  if (!result) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const { meta, content } = result;

  const header = [
    `# ${meta.title}`,
    "",
    meta.description ? `> ${meta.description}` : "",
    "",
    `**Author:** Jaxon Parrott`,
    `**Date:** ${meta.publishDate}`,
    meta.topic ? `**Topic:** ${meta.topic}` : "",
    "",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(header + content.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
