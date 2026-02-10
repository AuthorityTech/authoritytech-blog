import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BLOG_BASE_URL = "https://blog.authoritytech.io";

type JsonNode = Record<string, unknown>;

/**
 * Returns true if the node's @type is or includes FAQPage.
 */
function isFaqNode(node: JsonNode): boolean {
  const t = node["@type"];
  return t === "FAQPage" || (Array.isArray(t) && t.includes("FAQPage"));
}

/**
 * Extract valid Question entries from an FAQPage node's mainEntity.
 */
function extractValidQuestions(node: JsonNode): JsonNode[] {
  const mainEntity = node.mainEntity;
  if (!Array.isArray(mainEntity)) return [];

  return (mainEntity as JsonNode[]).filter(
    (q) =>
      q["@type"] === "Question" &&
      typeof q.name === "string" &&
      q.name.trim().length > 0 &&
      q.acceptedAnswer &&
      typeof (q.acceptedAnswer as JsonNode).text === "string" &&
      ((q.acceptedAnswer as JsonNode).text as string).trim().length > 0
  );
}

/**
 * Merge all FAQPage nodes in a @graph into a single FAQPage node.
 * Removes duplicates and empty questions. Returns null if no valid questions.
 */
function mergeFaqNodes(graph: JsonNode[]): {
  faqNode: JsonNode | null;
  rest: JsonNode[];
} {
  const faqNodes: JsonNode[] = [];
  const rest: JsonNode[] = [];

  for (const node of graph) {
    if (isFaqNode(node)) {
      faqNodes.push(node);
    } else {
      rest.push(node);
    }
  }

  if (faqNodes.length === 0) return { faqNode: null, rest };

  // Collect all valid questions across all FAQ nodes
  const allQuestions: JsonNode[] = [];
  const seen = new Set<string>();

  for (const faq of faqNodes) {
    for (const q of extractValidQuestions(faq)) {
      // Deduplicate by question name (case-insensitive)
      const key = (q.name as string).trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        allQuestions.push(q);
      }
    }
  }

  if (allQuestions.length === 0) return { faqNode: null, rest };

  return {
    faqNode: {
      "@type": "FAQPage",
      mainEntity: allQuestions,
    },
    rest,
  };
}

/**
 * Normalizes JSON-LD from the sheet so required SEO fields are always correct:
 * mainEntityOfPage (blog.authoritytech.io), dateModified, author (Person).
 * Handles both flat schemas and @graph-based schemas.
 * Merges multiple FAQPage nodes into one to prevent GSC "duplicate FAQPage" errors.
 * Strips FAQPage entries with empty/invalid questions.
 */
export function normalizeBlogPostJsonLd(
  jsonLdSchema: string,
  slug: string,
  publishDate: string
): string {
  try {
    const data = JSON.parse(jsonLdSchema) as JsonNode;
    const postUrl = `${BLOG_BASE_URL}/${slug}`;

    let target: JsonNode = data;

    if (Array.isArray(data["@graph"])) {
      const graph = data["@graph"] as JsonNode[];

      // Merge all FAQPage nodes into one (or remove if no valid questions)
      const { faqNode, rest } = mergeFaqNodes(graph);
      data["@graph"] = faqNode ? [...rest, faqNode] : rest;

      const updatedGraph = data["@graph"] as JsonNode[];
      const article = updatedGraph.find((node) => {
        const t = node["@type"];
        return (
          t === "Article" ||
          t === "BlogPosting" ||
          (Array.isArray(t) &&
            (t.includes("Article") || t.includes("BlogPosting")))
        );
      });
      if (article) {
        target = article;
      }
    } else if (isFaqNode(data)) {
      // Flat schema that is itself an FAQPage — validate it
      const questions = extractValidQuestions(data);
      if (questions.length === 0) return "";
      data.mainEntity = questions;
    }

    target.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": postUrl,
    };

    if (!target.dateModified && target.datePublished) {
      target.dateModified = target.datePublished;
    } else if (!target.dateModified) {
      target.dateModified = publishDate;
    }

    target.author = {
      "@type": "Person",
      name: "Jaxon Parrott",
    };

    return JSON.stringify(data);
  } catch {
    return jsonLdSchema;
  }
}
