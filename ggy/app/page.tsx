import { Atlas } from "@/components/atlas/atlas";
import { ConnectingJourney } from "@/components/journey/connecting-journey";
import { EditionNotes } from "@/components/edition-notes";
import { WhereNext } from "@/components/where-next";
import { ClosingSection } from "@/components/closing-section";
import { Page } from "@/components/page-effects";

/**
 * Home: the opening and the three states on one map, the line that joins
 * them, what is confirmed so far, and the way to the other pages.
 */
export default function Home() {
  return (
    <Page name="home">
      <Atlas />
      <ConnectingJourney />
      <EditionNotes />
      <WhereNext />
      <ClosingSection />
    </Page>
  );
}
