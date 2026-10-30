import { admissionSteps, contact, upcoming } from "@/content/ggy";
import { Button, NoteRef, Value } from "./primitives";
import { TicketMotion } from "./motion/ticket-motion";
import { Readiness } from "./readiness";

/**
 * Admissions: a crimson page with the one action available today, and the
 * upcoming edition set as a pass whose fields are still blank.
 */
export function AdmissionsChapter() {
  return (
    <section id="admissions" aria-labelledby="admissions-title" className="on-crimson on-dark gloss bg-crimson-deep text-ivory">
      <div className="page py-[clamp(6rem,12vw,10rem)]">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <h2 id="admissions-title" className="d-l lg:col-span-7" data-drift>
            Applications for the next Yatra have not yet opened.
          </h2>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="lede text-ivory/90">Until they do, the GGY team can be reached directly.</p>
            <Button href={`mailto:${contact.email}`} variant="cream" className="mt-8">
              Write to the GGY team
            </Button>
          </div>
        </div>

        {/* The pass: issued, but with none of its details filled in yet */}
        <div className="ticket mt-[clamp(4rem,8vw,6rem)] lg:mr-[16%]" data-ticket>
          <div className="ticket-main">
            <span aria-hidden="true" className="ticket-band" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="caps text-crimson">Good Governance Yatra</p>
              <p className="caps text-muted">Upcoming edition</p>
            </div>
            <p className="d-m mt-5 text-ink">Maharashtra, Goa and Gujarat</p>
            <p className="caption mt-1">The order of travel is to be announced.</p>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 text-ink sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Applications open", upcoming.applyUrl],
                ["Deadline", upcoming.applicationDeadline],
                ["Programme fee", upcoming.fee],
                ["Dates", upcoming.dates],
              ].map(([term, value]) => (
                <div key={term} className="ticket-field">
                  <dt className="caps text-muted">{term}</dt>
                  <dd className="mt-1.5 whitespace-nowrap font-display text-[1.25rem]">
                    <Value value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="ticket-stub">
            <p className="caps text-muted">Yatra</p>
            <p className="mt-2 font-display text-[1.6rem] leading-none text-ink">GGY</p>
            <dl className="mt-6">
              <dt className="caps text-muted">States</dt>
              <dd className="mt-1 font-display text-[1.1rem] text-ink">Three</dd>
              <dt className="caps mt-4 text-muted">Dates</dt>
              <dd className="mt-1 text-[0.95rem]">
                <Value value={upcoming.dates} />
              </dd>
            </dl>
            <span aria-hidden="true" className="ticket-code" />
          </div>
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
