import Image from "next/image";
import { BROCHURE, components, CONCEPT_NOTE, itinerary8, photos, previousEdition, proposedMaharashtra, upcoming } from "@/content/ggy";
import { NoteRef } from "../primitives";
import { Head } from "./head";
import { Marquee } from "./marquee";
import { Places } from "./places";

// The confirmed route, north to south as the flight above draws it.
const ROUTE = ["Gujarat", "Maharashtra", "Goa"].map((n) => upcoming.states.find((s) => s.name === n)!);

/**
 * What is confirmed: the route, and nothing else yet. The one concrete
 * glimpse of the next edition is the plan proposed for Maharashtra, set on a
 * dashed line because it is tentative.
 */
export function Coda() {
  return (
    <section id="editions" className="j-sec j-cream j-sec--led" data-nav="dark" data-j-station="editions" aria-labelledby="editions-title">
      <Marquee
        label="The route of the upcoming edition: Gujarat, Maharashtra and Goa"
        items={ROUTE.flatMap((s) => [
          s.name,
          <span key={s.lang} lang={s.lang} className="j-marquee__native">
            {s.native}
          </span>,
        ])}
      />
      <div className="j-wrap">
        <Head id="editions-title" title="So far, only the route" em="is confirmed">
          <p>The dates, the stops, the order of travel and the size of the cohort will be announced with the programme.</p>
        </Head>

        <div className="j-proposed" data-proposed>
          <div className="j-proposed__lead">
            <h3 className="j-h3">Proposed for Maharashtra</h3>
            <p className="j-meta">A plan for Mumbai and Nashik proposed in the {CONCEPT_NOTE}. Dates and visits are tentative and not yet confirmed.</p>
          </div>
          <div className="j-proposed__track">
            <i className="j-dash" data-dash aria-hidden="true" />
            <ol className="j-proposed__days">
            {proposedMaharashtra.map((d) => (
              <li key={d.date} data-proposed-day>
                <i className="j-node" aria-hidden="true" />
                <p className="j-date">{d.date}</p>
                <ul>
                  {d.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
            </ol>
          </div>
        </div>

        <Places />
      </div>
    </section>
  );
}

/** The six parts of the programme, as run in 2025: a ruled list beside one photograph from the field. */
export function Programme() {
  const p = photos.fieldGroup;
  return (
    <section id="programme" className="j-sec j-paper" data-nav="dark" aria-labelledby="programme-title">
      <div className="j-wrap">
        <Head id="programme-title" title="Six parts of the programme" em="as run in 2025">
          <p>As the {BROCHURE} describes them. The programme for the upcoming edition will be confirmed with its dates.</p>
        </Head>
        <div className="j-split">
          <figure className="j-split__side j-fig">
            <div className="j-fig__frame" data-reveal style={{ aspectRatio: "4 / 3" }}>
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 64rem) 38vw, 100vw" quality={80} className="object-cover" />
            </div>
            <figcaption>
              <p className="j-meta">{p.caption} Photograph from the GGY brochure.</p>
            </figcaption>
          </figure>
          <ul className="j-rows j-split__main">
            {components.map((c) => (
              <li key={c.name} className="j-row">
                <i className="j-rule" data-rule aria-hidden="true" />
                <h3 className="j-h3">{c.name}</h3>
                <p className="j-body">
                  {c.text ?? <span className="tba">Description awaiting confirmation</span>}
                  {c.note ? <NoteRef id={c.note} /> : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * The 8th edition, day by day, from the concept note: a ledger of nine
 * rows. The road runs down the middle of the page; a bead walks it as the
 * days are read, and the field notes are set open beside their day.
 */
export function Ledger() {
  const facts: [string, string][] = [
    ["Route", previousEdition.route],
    ["Delegates", previousEdition.delegates],
    ["Distance", previousEdition.distance],
    ["Yatra leader", previousEdition.yatraLeader],
  ];
  return (
    <section id="itinerary" className="j-sec j-paper j-sec--led" data-nav="dark" data-j-station="itinerary" aria-labelledby="itinerary-title">
      <Marquee label="The stops of the 8th edition, in order" items={itinerary8.map((d) => d.city)} />
      <div className="j-wrap">
        <Head id="itinerary-title" title="Nine days" em="on the road">
          <p>
            The itinerary of the 8th edition, 23 to 31 March, as printed in the {CONCEPT_NOTE}.
            <NoteRef id="dates8" />
          </p>
        </Head>

        <dl className="j-facts">
          {facts.map(([t, v]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="j-ledger" data-ledger>
          <i className="j-ledger__road" aria-hidden="true">
            <i data-ledger-line />
          </i>
          <i className="j-ledger__bead" data-ledger-bead aria-hidden="true" />
          <ol>
          {itinerary8.map((d) => (
            <li key={d.date} className="j-day" data-day>
              <i className="j-rule" data-rule aria-hidden="true" />
              <p className="j-day__date">
                <span>Day {d.day}</span>
                {d.date}
              </p>
              <h3 className="j-day__city">{d.city}</h3>
              <i className="j-day__dot" aria-hidden="true" />
              <div className="j-day__agenda">
                <ul>
                  {d.agenda.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                {d.field ? (
                  <div className="j-dispatch">
                    <h4>{d.field.title}</h4>
                    <p>{d.field.text}</p>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
