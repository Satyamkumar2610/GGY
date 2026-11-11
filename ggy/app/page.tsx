import "./landing.css";
import "./journal.css";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { YatraFlight } from "@/components/landing/yatra-flight";
import { ComeAndSee, LandingFooter } from "@/components/landing/landing-sections";
import { LandingMotion } from "@/components/landing/landing-motion";
import { Departure, Field } from "@/components/journal/opening";
import { Coda, Ledger, Programme } from "@/components/journal/chapters";
import { Stages } from "@/components/journal/stages";
import { Decade } from "@/components/journal/decade";
import { People } from "@/components/journal/people";
import { After } from "@/components/journal/after";
import { Questions } from "@/components/journal/questions";
import { Joining } from "@/components/journal/joining";
import { Thread } from "@/components/journal/thread";
import { JournalMotion } from "@/components/journal/journal-motion";
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
        <YatraFlight />
        <div className="lp-chapters">
          <Coda />
          <Stages />
          <Programme />
          <Decade />
          <Ledger />
          <FieldGallery />
          <People />
          <After />
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
      <PageMotion />
      <Interactions />
      <ScrollRefresh />
    </div>
  );
}
