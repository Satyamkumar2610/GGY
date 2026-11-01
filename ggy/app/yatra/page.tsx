import type { Metadata } from "next";
import { IdeaChapter } from "@/components/idea-chapter";
import { FormatChapter } from "@/components/format-chapter";
import { ProgrammeChapter } from "@/components/programme-chapter";
import { PageHero } from "@/components/page-hero";
import { MapPlate, boxOf } from "@/components/map-plate";
import { Page } from "@/components/page-effects";
import { STATE_TEXTURE } from "@/components/atlas/atlas-map";

export const metadata: Metadata = {
  title: "The Yatra",
  description: "How the Good Governance Yatra teaches: the idea, the four stages of learning and the components of the programme, as described for the 2025 edition.",
  alternates: { canonical: "/yatra" },
};

export default function YatraPage() {
  return (
    <Page name="yatra">
      <PageHero
        kicker="The Yatra"
        title="Governance is learned in the field."
        standfirst="The Good Governance Yatra takes delegates to the places where policy is carried out, and to the people who carry it out. This page sets out the idea, how learning is structured, and the programme as it ran in 2025."
        meta={[
          { term: "Described for", value: "The 2025 edition" },
          { term: "Upcoming edition", value: <span className="tba">Programme to be confirmed</span> },
        ]}
      >
        <MapPlate
          box={boxOf(["IN-GJ", "IN-GA", "IN-MH"], 0.12)}
          photos={STATE_TEXTURE}
          outline={["IN-GJ", "IN-GA", "IN-MH"]}
          showRelief
          label="Map of western India with Gujarat, Goa and Maharashtra, the states of the upcoming edition."
        />
      </PageHero>
      <IdeaChapter />
      <FormatChapter />
      <ProgrammeChapter />
    </Page>
  );
}
