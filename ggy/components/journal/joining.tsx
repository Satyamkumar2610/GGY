import { admissionSteps, contact, upcoming } from "@/content/ggy";
import { Button, NoteRef, Value } from "../primitives";
import { TicketMotion } from "../motion/ticket-motion";
import { Readiness } from "../readiness";
import { Head, Title } from "./head";

/**
 * Joining: the one action available today, the upcoming edition set as a
 * pass whose fields are still blank, a self-check, and the admission process
 * as printed for 2025, its five steps on one line.
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

        {/* The pass: issued, but with none of its details filled in yet */}
        <div id="admissions" className="ticket j-pass" data-ticket>
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
            <span aria-hidden="true" className="ticket-code" />
          </div>
        </div>

        <div className="j-ready">
          <Readiness />
        </div>

        <div className="j-process">
          <Title as="h3" sub title="The admission process" em="as printed for 2025">
            <NoteRef id="process" />
          </Title>
          <div className="j-steps" data-steps>
            <i className="j-steps__line" data-steps-line aria-hidden="true" />
            <ol>
              {admissionSteps.map((step, i) => (
                <li key={step.name}>
                  <span className="j-steps__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h4 className="j-h3">{step.name}</h4>
                  <p className="j-body">
                    {step.text}
                    {step.note ? <NoteRef id={step.note} /> : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <address className="j-contact">
          <p className="j-meta">Contact, as printed in 2025. Details for the upcoming edition are to be confirmed.</p>
          <a className="tlink tlink-static" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <a className="tlink tlink-static" href={contact.phoneHref}>
            {contact.phoneDisplay}
          </a>
          <p className="j-body">{contact.address}</p>
        </address>
      </div>
      <TicketMotion />
    </section>
  );
}
