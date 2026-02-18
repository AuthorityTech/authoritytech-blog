import type { MetadataRoute } from "next";

/** Explicit allow for AI and search crawlers (GEO strategy). */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "PerplexityBot",
  "GPTBot",
  "ChatGPT-User",
  "Claude-Web",
  "anthropic-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: "https://blog.authoritytech.io/sitemap.xml",
  };
}
