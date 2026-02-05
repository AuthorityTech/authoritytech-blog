import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BLOG_BASE_URL = "https://blog.authoritytech.io";

/**
 * Normalizes JSON-LD from the sheet so required SEO fields are always correct:
 * mainEntityOfPage (blog.authoritytech.io), dateModified, author (Person).
 */
export function normalizeBlogPostJsonLd(
  jsonLdSchema: string,
  slug: string,
  publishDate: string
): string {
  try {
    const data = JSON.parse(jsonLdSchema) as Record<string, unknown>;
    const postUrl = `${BLOG_BASE_URL}/${slug}`;

    data.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": postUrl,
    };

    if (!data.dateModified && data.datePublished) {
      data.dateModified = data.datePublished;
    } else if (!data.dateModified) {
      data.dateModified = publishDate;
    }

    data.author = {
      "@type": "Person",
      name: "Jaxon Parrott",
    };

    return JSON.stringify(data);
  } catch {
    return jsonLdSchema;
  }
}
