import type { Metadata } from "next";
import { JournalBoard } from "@/components/journal-board";
import { PageHero } from "@/components/page-hero";
import { Page } from "@/components/page-effects";

export const metadata: Metadata = {
  title: "Your field journal",
  description: "Stamp the three states as you read, keep one question for the field, and save your page. Kept only in your browser; not an application.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <Page name="journal">
      <PageHero
        tone="cream"
        kicker="Your field journal"
        title="Keep your own page."
        standfirst="Open a state and it is stamped here. Write the one question you would bring to the field, then save the page or send it to the team. It stays in this browser until you choose otherwise."
        meta={[
          { term: "Kept", value: "On this device only" },
          { term: "Status", value: "Not an application" },
        ]}
      />
      <JournalBoard />
    </Page>
  );
}
