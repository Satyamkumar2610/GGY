import { SiteHeader } from "@/components/site-header";
import { Atlas } from "@/components/atlas/atlas";
import { ConnectingJourney } from "@/components/journey/connecting-journey";
import { EditionNotes } from "@/components/edition-notes";
import { IdeaChapter } from "@/components/idea-chapter";
import { FormatChapter } from "@/components/format-chapter";
import { ProgrammeChapter } from "@/components/programme-chapter";
import { ArchiveAtlas } from "@/components/archive/archive-atlas";
import { ItineraryChapter } from "@/components/itinerary-chapter";
import { LifeAfterChapter, PeopleChapter } from "@/components/people-chapter";
import { AdmissionsChapter } from "@/components/admissions-chapter";
import { FieldGallery } from "@/components/field-gallery";
import { Questions } from "@/components/questions";
import { Colophon } from "@/components/colophon";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";
import { PageMotion } from "@/components/motion/page-motion";
import { Interactions } from "@/components/motion/interactions";
import { ScrollProgress } from "@/components/motion/scroll-progress";

/**
 * The Western India Field Journal. One map runs through the page: India in
 * the opening, the three states of the upcoming edition, the line that joins
 * the chapters, and the routes of past editions in the archive.
 *
 * 01–02 Atlas: the opening and the three states (sticky map, state dossiers)
 * 03    The connecting journey
 *       What is confirmed so far
 * 04    The idea, and the learning journey
 * 05    The programme experience
 * 06    The archive, and the 2025 itinerary and field photographs
 * 07    People and institutions, and where alumni went
 *       Questions
 * 08    The upcoming edition: connect with the team
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
        <Atlas />
        <ConnectingJourney />
        <EditionNotes />
        <IdeaChapter />
        <FormatChapter />
        <ProgrammeChapter />
        <ArchiveAtlas />
        <ItineraryChapter />
        <FieldGallery />
        <PeopleChapter />
        <LifeAfterChapter />
        <Questions />
        <AdmissionsChapter />
      </main>
      <Colophon />
      <PageMotion />
      <Interactions />
      <ScrollRefresh />
    </>
  );
}
