import { admissionSteps, contact, upcoming } from "@/content/ggy";
import { NoteRef, Value } from "./primitives";
import { TicketMotion } from "./motion/ticket-motion";
import { Readiness } from "./readiness";
import { Postmark } from "./postmark";

/**
 * Connect: the status of the upcoming edition set as a registration page
 * whose entries are still blank, a self-check, the process printed for 2025,
 * and the contact details. There is nothing to apply to yet.
 */
export function ConnectChapter() {
  return (
    <section id="status" aria-labelledby="status-title" className="bg-paper pb-[clamp(5rem,10vw,8rem)] pt-[clamp(3rem,6vw,5rem)]" data-thread="Status">
      <div className="page">
        <h2 id="status-title" className="sr-only">
          Status of the upcoming edition
        </h2>
        {/* The registration page: a field-journal page, its entries still blank */}
        <div className="register lg:mr-[16%]" data-register>
          <Postmark ring="GOOD GOVERNANCE YATRA ✦ UPCOMING EDITION ✦ WESTERN INDIA ✦ " centre="GGY" sub="To be announced" className="register-stamp" />
          <p className="kicker text-crimson">Registration, upcoming edition</p>
          <p className="register-title mt-4">Maharashtra, Goa and Gujarat</p>
          <p className="caption mt-1">The order of travel is to be announced.</p>
          <dl className="register-lines mt-8">
            {[
              ["Applications open", upcoming.applyUrl],
              ["Deadline", upcoming.applicationDeadline],
              ["Programme fee", upcoming.fee],
              ["Dates", upcoming.dates],
              ["Duration", upcoming.duration],
              ["Cohort", upcoming.cohortSize],
            ].map(([term, value]) => (
              <div key={term} className="register-line">
                <dt>{term}</dt>
                <dd>
                  <Value value={value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-[clamp(3rem,6vw,4rem)] lg:ml-[16%]" id="ready">
          <Readiness />
        </div>
      </div>

      <div id="process" className="page mt-[clamp(5rem,10vw,8rem)]" data-thread="Process">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-8">
            <p className="kicker">
              The admission process, as printed for the 2025 edition
              <NoteRef id="process" />
            </p>
            <ol className="steps mt-8">
              {admissionSteps.map((step, i) => (
                <li key={step.name} className="step">
                  <span className="step-dot" aria-hidden="true" />
                  <span className="num text-[1.4rem] text-crimson">{i + 1}</span>
                  <p className="mt-2 font-display text-[1.2rem] leading-tight">{step.name}</p>
                  <p className="mt-2 text-[0.88rem] text-ink-soft">
                    {step.text}
                    {step.note ? <NoteRef id={step.note} /> : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <address className="not-italic lg:col-span-3 lg:col-start-10">
            <p className="kicker">Contact, as printed in 2025</p>
            <p className="mt-6">
              <a className="tlink tlink-static font-display text-[1.4rem]" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
            <p className="mt-3">
              <a className="tlink tlink-static font-display text-[1.4rem]" href={contact.phoneHref}>
                {contact.phoneDisplay}
              </a>
            </p>
            <p className="mt-5 text-[0.88rem] text-ink-soft">{contact.address}</p>
            <p className="caption mt-3">Contact details for the upcoming edition are to be confirmed.</p>
          </address>
        </div>
      </div>
      <TicketMotion />
    </section>
  );
}
