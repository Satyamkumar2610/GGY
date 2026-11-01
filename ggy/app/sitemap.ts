import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { stateDossiers } from "@/content/ggy";
import { SLUG } from "@/lib/states";

const pages = ["/", "/states", "/yatra", "/archive", "/people", "/connect", "/journal"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...stateDossiers.map((d) => ({ url: `${SITE_URL}/states/${SLUG[d.iso]}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
