import type { Metadata } from "next";
import { ConnectChapter } from "@/components/connect-chapter";
import { Questions } from "@/components/questions";
import { PageHero } from "@/components/page-hero";
import { MapPlate, boxOf } from "@/components/map-plate";
import { Page } from "@/components/page-effects";
import { Button, Value } from "@/components/primitives";
import { contact, upcoming } from "@/content/ggy";

export const metadata: Metadata = {
  title: "Connect with the team",
  description: "Applications for the upcoming Good Governance Yatra have not opened. Contact the GGY team, read the 2025 admission process, and find answers to common questions.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return (
    <Page name="connect">
      <PageHero
        kicker="Connect"
        title="Applications have not yet opened."
        standfirst="The upcoming Yatra travels through Maharashtra, Goa and Gujarat. Its dates, fee and application process will be announced. Until then, the GGY team can be reached directly."
        meta={[
          { term: "Applications", value: <Value value={upcoming.applyUrl} /> },
          { term: "Dates", value: <Value value={upcoming.dates} /> },
        ]}
      >
        <div className="flex h-full flex-col justify-between gap-10">
          <MapPlate box={boxOf(["IN-GJ", "IN-GA", "IN-MH"], 0.1)} outline={["IN-GJ", "IN-GA", "IN-MH"]} label="Map of Gujarat, Goa and Maharashtra, outlined." />
          <div>
            <Button href={`mailto:${contact.email}`}>Write to the GGY team</Button>
            <p className="caption mt-3">{contact.email}, as printed in the 2025 brochure.</p>
          </div>
        </div>
      </PageHero>
      <ConnectChapter />
      <Questions />
    </Page>
  );
}
