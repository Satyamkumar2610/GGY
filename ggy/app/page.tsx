import "./landing.css";
import "./journal.css";
import "./cinema.css";
import "./sections.css";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { YatraFlight } from "@/components/landing/yatra-flight";
import { ComeAndSee, LandingFooter } from "@/components/landing/landing-sections";
import { LandingMotion } from "@/components/landing/landing-motion";
import { Departure, Field } from "@/components/journal/opening";
import { Coda } from "@/components/journal/chapters";
import { Ledger } from "@/components/journal/ledger";
import { Programme } from "@/components/journal/programme";
import { Stages } from "@/components/journal/stages";
import { Decade } from "@/components/journal/decade";
import { People } from "@/components/journal/people";
import { After } from "@/components/journal/after";
import { Questions } from "@/components/journal/questions";
import { Joining } from "@/components/journal/joining";
import { Thread } from "@/components/journal/thread";
import { JournalMotion } from "@/components/journal/journal-motion";
import { Act } from "@/components/journal/act";
import { CinemaMotion } from "@/components/motion/cinema-motion";
import { FieldGallery } from "@/components/field-gallery";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";
import { PageMotion } from "@/components/motion/page-motion";
import { Interactions } from "@/components/motion/interactions";
import { ScrollProgress } from "@/components/motion/scroll-progress";

/**
 * The homepage, in six acts strung on one thread.
 *
 * Opening     India is a window cut in paper; the camera dives through it.
 * Why go      Governance, on the ground; the field is the classroom; the idea.
 * Where       Gujarat, Maharashtra, Goa, flown on a pinned map; what is
 *             confirmed so far, and the plan proposed for Maharashtra.
 * How         Four stages of the learning journey; six parts of the programme.
 * Proof       A decade of routes on one map; nine days of 2025 as a ledger;
 *             field photographs; the people delegates met.
 * Afterwards  Where alumni went, and what delegates took away.
 * Joining     Questions; come and see; the pass and the admission process.
 */
export default function Home() {
  return (
    <div className="lp">
      <ScrollProgress />
      <LandingNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <LandingHero />
        <Departure />
        <Field />
        <Act id="act-where" n="I" photos={["highCourt", "sabarmati", "bomJesus", "municipalCorporation", "oldSecretariat"]} title="Along the western coast" dek="Gujarat, Maharashtra and Goa: the three states of the upcoming edition." />
        <YatraFlight />
        <div className="lp-chapters">
          <Coda />
          <Act id="act-how" n="II" photos={["address", "fieldGroup", "overhead", "legislatureSteps", "lectureHall"]} title="How the days are spent" dek="Four stages of learning, and the field visits, workshops and conversations that make up the programme." />
          <Stages />
          <Programme />
          <Act id="act-proof" n="III" photos={["cohort", "flagOff", "openLandscape", "fieldGroup", "legislatureSteps"]} title="The record so far" dek="Eight editions since 2015, the nine days of 2025, and where delegates went next." />
          <Decade />
          <Ledger />
          <FieldGallery />
          <People />
          <After />
          <Act id="act-joining" n="IV" photos={["flagOff", "overhead", "address", "cohort", "lectureHall"]} title="Joining the next edition" dek="Common questions, a conversation with the team, and how admission works." />
          <Questions />
        </div>
        <ComeAndSee />
        <div className="lp-chapters lp-chapters--deep">
          <Joining />
        </div>
      </main>
      <LandingFooter />
      <Thread />
      <LandingMotion />
      <JournalMotion />
      <CinemaMotion />
      <PageMotion />
      <Interactions />
      <ScrollRefresh />
    </div>
  );
}
