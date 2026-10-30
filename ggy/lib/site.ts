/**
 * Deployment settings, from the environment.
 * NEXT_PUBLIC_SITE_URL: the public origin, e.g. https://ggy.rishihood.edu.in.
 *   Used for canonical, sitemap and share-image URLs.
 * NEXT_PUBLIC_ALLOW_INDEXING: "true" once the content is confirmed and the
 *   site may appear in search results. Anything else keeps it out.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
