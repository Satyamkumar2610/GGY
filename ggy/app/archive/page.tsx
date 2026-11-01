import type { Metadata } from "next";
import { ArchiveAtlas } from "@/components/archive/archive-atlas";
import { PageHero } from "@/components/page-hero";
import { MapPlate } from "@/components/map-plate";
import { Page } from "@/components/page-effects";
import { INDIA_BOX } from "@/lib/atlas";
import { pastEditions } from "@/content/ggy";
import { ROUTE_ISO } from "@/lib/atlas";

export const metadata: Metadata = {
  title: "The archive",
  description: "Every route the Good Governance Yatra has printed since 2015, the 2025 itinerary day by day, and photographs from past editions.",
  alternates: { canonical: "/archive" },
};

// Every state named in a printed route, tinted by how many editions named it.
const count: Record<string, number> = {};
for (const e of pastEditions) for (const n of e.route.split(" – ")) if (ROUTE_ISO[n]) count[ROUTE_ISO[n]] = (count[ROUTE_ISO[n]] ?? 0) + 1;
const tint = Object.fromEntries(Object.entries(count).map(([iso, c]) => [iso, `rgb(182 108 76 / ${Math.min(1, 0.32 + c * 0.22)})`]));

export default function ArchivePage() {
  return (
    <Page name="archive">
      <PageHero
        tone="cream"
        kicker="The archive"
        title="A decade on the road."
        standfirst="Eight editions since 2015, from Gujarat to Ladakh. Every route and figure on this page belongs to a past edition, not the upcoming one. Routes are reproduced from the 2025 brochure."
        meta={[
          { term: "First edition", value: "2015" },
          { term: "Latest", value: "8th edition, 2025" },
        ]}
      >
        <MapPlate box={INDIA_BOX} tint={tint} label="Map of India with every state named in a printed route tinted; darker states appear in more routes." />
      </PageHero>
      <ArchiveAtlas />
    </Page>
  );
}
