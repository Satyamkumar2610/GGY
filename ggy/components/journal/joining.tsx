import { contact, upcoming } from "@/content/ggy";
import { Button, NoteRef, Value } from "../primitives";
import { TicketMotion } from "../motion/ticket-motion";
import { Readiness } from "../readiness";
import { Head, Title } from "./head";
import BorderGlow from "../BorderGlow";
import HoloCard from "../HoloCard";
import { AdmissionPath } from "./admission-path";

/**
 * Joining: the one action available today, the upcoming edition set as a
 * pass whose fields are still blank, a self-check, and the admission process
 * as printed for 2025, its five steps set as a climb.
 */
export function Joining() {
  return (
    <section id="connect" className="j-sec j-deep on-dark on-crimson" data-nav="light" data-j-station="connect" aria-labelledby="admissions-title">
      <div className="j-wrap">
        <Head id="admissions-title" title="The journey changes" em="the way you see governance">
          <p>Applications for the upcoming edition have not opened, and its dates are still to be announced. Until then, the GGY team can be reached directly.</p>
          <Button href={`mailto:${contact.email}`} variant="cream" className="j-join__cta">
            Connect with the GGY team
          </Button>
        </Head>

        {/* The pass: issued, but with none of its details filled in yet. Its
            edge catches the light where the pointer comes near it, and the
            stub carries a foil seal, as a printed pass would. */}
        <div id="admissions" className="j-pass-wrap" data-ticket>
          <BorderGlow
            className="j-pass-glow"
            backgroundColor="#ffffff"
            borderRadius={10}
            glowRadius={34}
            glowColor="36 83 60"
            glowIntensity={0.9}
            edgeSensitivity={26}
            coneSpread={22}
            fillOpacity={0.32}
            colors={["#ffeed3", "#cd1f36", "#fff6e6"]}
          >
        <div className="ticket j-pass">
          <div className="ticket-main">
            <span aria-hidden="true" className="ticket-band" />
            <div className="j-pass__top">
              <p>Good Governance Yatra</p>
              <p>Upcoming edition</p>
            </div>
            <p className="j-pass__route">Gujarat, Maharashtra and Goa</p>
            <p className="j-meta">The order of travel is to be announced.</p>
            <dl className="j-pass__fields">
              {[
                ["Applications open", upcoming.applyUrl],
                ["Deadline", upcoming.applicationDeadline],
                ["Programme fee", upcoming.fee],
                ["Dates", upcoming.dates],
              ].map(([term, value]) => (
                <div key={term} className="ticket-field">
                  <dt>{term}</dt>
                  <dd>
                    <Value value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ticket-stub">
            <p className="j-pass__mark">GGY</p>
            <dl>
              <dt>States</dt>
              <dd>Three</dd>
              <dt>Cohort</dt>
              <dd>
                <Value value={upcoming.cohortSize} />
              </dd>
            </dl>
            <div className="j-pass__seal">
              <HoloCard image="/images/ggy-seal.png" alt="Foil seal of the Good Governance Yatra" preset="stars" width={112} radius={56} intensity={0.7} edgeSparkle={0.5} frame={0} glare={0.45} foilColor="#ffeed3" tiltMax={18} hoverScale={1.06} shadow={false} />
            </div>
            <span aria-hidden="true" className="ticket-code" />
          </div>
        </div>
          </BorderGlow>
        </div>

        <div className="j-ready">
          <Readiness />
        </div>

        <div className="j-process">
          <Title as="h3" sub title="The admission process" em="as printed for 2025">
            <NoteRef id="process" />
          </Title>
          <AdmissionPath />
        </div>

      </div>
      <TicketMotion />
    </section>
  );
}
