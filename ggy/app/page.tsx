import "./landing.css";
import "./journal.css";
import "./cinema.css";
import "./sections.css";
import "./metal.css";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { YatraFlight } from "@/components/landing/yatra-flight";
import { ComeAndSee, LandingFooter } from "@/components/landing/landing-sections";
import { LandingMotion } from "@/components/landing/landing-motion";
import { Departure } from "@/components/journal/opening";
import { KeyVisits } from "@/components/journal/key-visits";
import { Takeaways } from "@/components/journal/takeaways";
import { AlumniVoices } from "@/components/journal/alumni-voices";
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
 * The homepage of Good Governance Yatra'27, in four acts strung on one thread.
 *
 * Opening     India is a window cut in cream; the three states play through it,
 *             and the camera dives in. Learn governance while travelling.
 * Why go      The Yatra at a glance; key visits and interactions.
 * Where       Gujarat, Maharashtra, Goa, flown on a pinned map.
 * How         Four stages of the learning journey; six parts of the
 *             programme; the takeaways.
 * Proof       Past editions on one map; nine days of 2025; field photographs;
 *             the people delegates met; where alumni went; alumni in their
 *             own words.
 * Joining     FAQs; come and see; the pass and the admission process.
 *
 * Hidden for now, per the GGY'27 brief, and kept in the codebase for later:
 * Field (the hall/field comparison and "Beyond the map" idea panels, in
 * components/journal/opening.tsx) and Coda ("So far, only the route is
 * confirmed", components/journal/chapters.tsx), until the itinerary is
 * confirmed.
 */
export default function Home() {
  return (
    <div className="lp">
      <ScrollProgress />
      <LandingNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <LandingHero />
        <Departure />
        <KeyVisits />
        <Act id="act-where" n="I" photos={["highCourt", "sabarmati", "bomJesus", "municipalCorporation", "oldSecretariat"]} title="Along the western coast" dek="Gujarat, Maharashtra and Goa: the three states of the upcoming edition." />
        <YatraFlight />
        <div className="lp-chapters">
          <Act id="act-how" n="II" photos={["lectureHall", "fieldGroup", "overhead", "legislatureSteps", "address"]} title="How the days are spent" dek="Four stages of learning, and the field visits, workshops and conversations that make up the programme." />
          <Stages />
          <Programme />
          <Takeaways />
          <Act id="act-proof" n="III" photos={["flagOff", "overhead", "openLandscape", "fieldGroup", "legislatureSteps"]} title="The record so far" dek="Eight editions since 2015, the nine days of 2025, where delegates went next, and what they say about it." />
          <Decade />
          <Ledger />
          <FieldGallery />
          <People />
          <After />
          <AlumniVoices />
          <Act id="act-joining" n="IV" photos={["oldSecretariat", "address", "lectureHall", "flagOff", "overhead"]} title="Joining the next edition" dek="Frequently asked questions, a conversation with the team, and how admission works." />
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
