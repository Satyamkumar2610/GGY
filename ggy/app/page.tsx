import "./landing.css";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { YatraFlight } from "@/components/landing/yatra-flight";
import { ComeAndSee, FieldCards, GroundBand, LandingFooter } from "@/components/landing/landing-sections";
import { LandingMotion } from "@/components/landing/landing-motion";
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
import { ScrollRefresh } from "@/components/motion/scroll-refresh";
import { PageMotion } from "@/components/motion/page-motion";
import { Interactions } from "@/components/motion/interactions";
import { ScrollProgress } from "@/components/motion/scroll-progress";

/**
 * The homepage.
 *
 * Opening    India is a window cut in paper; the camera dives through it into
 *            Maharashtra until the photograph fills the screen.
 * Band       Governance, on the ground: the states of India draw themselves in.
 * Field      The institutions and the people, two stepped photographs.
 * Journey    Gujarat → Maharashtra → Goa, flown on a pinned map.
 *            What is confirmed so far
 * Chapters   The idea and the learning journey, the programme, the archive and
 *            the 2025 itinerary, field photographs, people and institutions,
 *            where alumni went, questions.
 * Close      Come and see: the photograph opens out; then admissions and contact.
 */
export default function Home() {
  return (
    <div className="lp">
      <ScrollProgress />
      <LandingNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <LandingHero />
        <GroundBand />
        <FieldCards />
        <YatraFlight />
        <div className="lp-chapters">
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
        </div>
        <ComeAndSee />
        <div className="lp-chapters lp-chapters--deep">
          <AdmissionsChapter />
        </div>
      </main>
      <LandingFooter />
      <LandingMotion />
      <PageMotion />
      <Interactions />
      <ScrollRefresh />
    </div>
  );
}
