import { CONCEPT_NOTE, itinerary8, proposedMaharashtra } from "@/content/ggy";
import { NoteRef } from "./primitives";
import { ItineraryMotion } from "./motion/itinerary-motion";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The 8th edition, day by day, from the concept note. On wide screens a
 * sticky plate keeps the day, date and city in view, with the route as a
 * column of stops that fills as the reader travels; the days pass beside it.
 * Days with a field note open it in place. The chapter ends with the plan
 * proposed for Maharashtra, marked as tentative.
 */
export function ItineraryChapter() {
  const first = itinerary8[0];
  return (
    <section id="itinerary" aria-labelledby="itinerary-title" className="overflow-x-clip bg-paper py-[clamp(6rem,12vw,11rem)]" data-itinerary>
      <div className="page">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-8">
            <h2 id="itinerary-title" className="d-xl" data-drift>
              Nine days on the road
            </h2>
          </div>
          <p className="max-w-[24rem] text-ink-soft lg:col-span-4">
            The itinerary of the 8th edition, 23 to 31 March, as printed in the {CONCEPT_NOTE}.
            <NoteRef id="dates8" />
          </p>
        </div>

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-[var(--gap)] lg:grid-cols-12">
          {/* The plate: day, date and city, and the route as stops. */}
          <div aria-hidden="true" className="hidden lg:col-span-4 lg:block">
            <div className="itin-plate">
              <p className="itin-plate-day">
                <span className="meta">Day</span>
                <span className="num" data-itin-day>
                  {pad(first.day)}
                </span>
              </p>
              <p className="itin-plate-date" data-itin-date>
                {first.date}
              </p>
              <ol className="itin-stops">
                <span className="itin-stops-line">
                  <span data-itin-progress />
                </span>
                {itinerary8.map((d) => (
                  <li key={d.date} className="itin-stop" data-itin-stop>
                    {d.city}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ol className="itin-days lg:col-span-7 lg:col-start-6">
            {itinerary8.map((d) => (
              <li key={d.date} className="itin-day" data-itin-entry>
                <p className="itin-day-meta">
                  <span className="num">Day {pad(d.day)}</span>
                  <span>{d.date}</span>
                </p>
                <h3 className="itin-city">{d.city}</h3>
                <ul className="itin-agenda">
                  {d.agenda.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                {d.field ? (
                  <details className="itin-field">
                    <summary>
                      <span className="meta">Field note</span>
                      <span className="itin-field-title">{d.field.title}</span>
                      <span aria-hidden="true" className="itin-field-plus" />
                    </summary>
                    <p>{d.field.text}</p>
                  </details>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="itin-next" data-itin-next>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-[var(--gap)]">
            <div className="lg:col-span-4">
              <p className="meta text-saffron-ink">Tentative, not yet confirmed</p>
              <h3 className="d-m mt-5">Proposed for Maharashtra</h3>
              <p className="caption mt-5 max-w-[22rem]">
                A plan for Mumbai and Nashik proposed in the {CONCEPT_NOTE}. Dates and visits are tentative and not yet confirmed.
              </p>
            </div>
            <ol className="itin-next-days lg:col-span-8">
              {proposedMaharashtra.map((d) => (
                <li key={d.date}>
                  <p className="meta text-saffron-ink">{d.date}</p>
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
      </div>
      <ItineraryMotion />
    </section>
  );
}
