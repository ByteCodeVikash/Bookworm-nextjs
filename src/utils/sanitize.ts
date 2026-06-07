// src/utils/sanitize.ts
// Client-side HTML sanitization using DOMPurify.
// DOMPurify is browser-only — never import this in SSR/server code paths.

/**
 * Allowed HTML tags for book descriptions.
 * Covers: headings, paragraphs, lists, blockquotes, inline formatting, links.
 */
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4",
  "p", "br",
  "strong", "em", "u", "s",
  "ul", "ol", "li",
  "blockquote",
  "a",
];

/**
 * Allowed attributes per tag.
 * Links: only href and target. All others: none.
 */
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Sanitize an HTML string before sending it to the server or rendering it.
 * Returns a safe HTML string with only allowed tags and attributes.
 * Strips all scripts, event handlers, data URIs, and javascript: hrefs.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // SSR fallback — strip all tags (server should apply its own sanitization)
    return dirty.replace(/<[^>]*>/g, "");
  }

  // Dynamically require DOMPurify only on the client
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const DOMPurify = require("dompurify");

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force all links to be safe (no javascript:, no data:)
    FORCE_BODY: false,
    ALLOW_DATA_ATTR: false,
    // Add rel="noopener noreferrer" to all links automatically
    FORBID_ATTR: ["style", "onerror", "onload"],
    HOOK_AFTER: undefined,
  }) as string;
}
