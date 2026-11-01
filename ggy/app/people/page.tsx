import type { Metadata } from "next";
import { LifeAfterChapter, PeopleChapter } from "@/components/people-chapter";
import { PageHero } from "@/components/page-hero";
import { MapPlate, boxOf } from "@/components/map-plate";
import { Page } from "@/components/page-effects";

export const metadata: Metadata = {
  title: "The people",
  description: "The leaders, officials and reformers delegates of the Good Governance Yatra have met, and the institutions behind the 2025 edition. Names and titles as printed.",
  alternates: { canonical: "/people" },
};

// Where delegates of the 8th edition met people, from the concept note.
const CITIES = [
  { lon: 77.21, lat: 28.61, label: "Delhi", place: "above" as const },
  { lon: 80.95, lat: 26.85, label: "Lucknow", place: "left" as const },
  { lon: 81.85, lat: 25.44, label: "Prayagraj", place: "below" as const },
  { lon: 82.2, lat: 26.8, label: "Ayodhya", place: "right" as const },
  { lon: 83.78, lat: 26.5, label: "Deoria", place: "right" as const },
];

export default function PeoplePage() {
  return (
    <Page name="people">
      <PageHero
        kicker="The people"
        title="The people delegates met."
        standfirst="Delegates learn from the officials, reformers and institutions that run the programmes they visit. Names and titles are reproduced as printed in the 2025 brochure and the concept note, and may no longer be current."
        meta={[
          { term: "Met in 2025", value: "Delhi, Lucknow, Prayagraj, Ayodhya, Deoria" },
        ]}
      >
        <MapPlate box={boxOf(["IN-DL", "IN-UP", "IN-HR", "IN-BR"], 0.12)} dots={CITIES} outline={["IN-UP"]} label="Map of India marking the five cities where delegates of the 8th edition met people, in Delhi and Uttar Pradesh." />
      </PageHero>
      <PeopleChapter />
      <LifeAfterChapter />
    </Page>
  );
}
