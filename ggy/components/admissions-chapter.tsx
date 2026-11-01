import { admissionSteps, contact, upcoming } from "@/content/ggy";
import { Button, NoteRef, Value } from "./primitives";
import { TicketMotion } from "./motion/ticket-motion";
import { Readiness } from "./readiness";
import { ClosingMap } from "./closing-map";
import { Postmark } from "./postmark";

/**
 * Admissions: a crimson page with the one action available today, and the
 * upcoming edition set as a pass whose fields are still blank.
 */
export function AdmissionsChapter() {
  return (
    <section id="connect" aria-labelledby="admissions-title" className="on-crimson on-dark gloss bg-crimson-deep text-ivory" data-ground-reveal>
      {/* The closing composition: the three states, drawn in ivory linework */}
      <div className="closing">
        <ClosingMap />
        <div className="page relative">
          <div className="closing-copy">
            <p className="kicker text-ivory/80">
              <span className="num">08</span> The upcoming edition
            </p>
            <h2 id="admissions-title" className="closing-title mt-7" data-drift>
              The journey changes the way you see governance.
            </h2>
            <p className="lede mt-8 max-w-[30rem] text-ivory/90">Explore the upcoming Good Governance Yatra across Maharashtra, Goa and Gujarat.</p>
            <p className="mt-4 max-w-[30rem] text-[0.95rem] text-ivory/75">
              Applications for the upcoming edition have not opened, and its dates are still to be announced. Until then, the GGY team can be reached directly.
            </p>
            <Button href={`mailto:${contact.email}`} variant="cream" className="mt-9">
              Connect with the GGY team
            </Button>
          </div>
        </div>
      </div>

      <div id="admissions" className="page pb-[clamp(6rem,12vw,10rem)]">

        {/* The registration page: a field-journal page, its entries still blank */}
        <div className="register mt-[clamp(4rem,8vw,6rem)] lg:mr-[16%]" data-register>
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

        <div className="mt-[clamp(3rem,6vw,4rem)] lg:ml-[16%]">
          <Readiness />
        </div>

        <div className="mt-[clamp(4rem,8vw,6rem)] grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-8">
            <p className="label text-ivory/80">
              The admission process, as printed for the 2025 edition
              <NoteRef id="process" />
            </p>
            <ol className="steps mt-8">
              {admissionSteps.map((step, i) => (
                <li key={step.name} className="step">
                  <span className="step-dot" aria-hidden="true" />
                  <span className="num text-[1.4rem] text-ivory/80">{i + 1}</span>
                  <p className="mt-2 font-display text-[1.2rem] leading-tight">{step.name}</p>
                  <p className="mt-2 text-[0.88rem] text-ivory/85">
                    {step.text}
                    {step.note ? <NoteRef id={step.note} /> : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <address className="not-italic lg:col-span-3 lg:col-start-10">
            <p className="label text-ivory/80">Contact, as printed in 2025</p>
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
            <p className="mt-5 text-[0.88rem] text-ivory/85">{contact.address}</p>
            <p className="mt-3 text-[0.78rem] text-ivory/70">Contact details for the upcoming edition are to be confirmed.</p>
          </address>
        </div>
      </div>
      <TicketMotion />
    </section>
  );
}
