import Image from "next/image";
import { CONCEPT_NOTE, conceptFigures, pastEditions, photos, type PhotoKey } from "@/content/ggy";
import { NoteRef } from "./primitives";
import { ArchiveMotion } from "./motion/archive-motion";

const UPCOMING_STATES = ["Maharashtra", "Goa", "Gujarat"];

function RouteText({ route }: { route: string }) {
  const parts = route.split(" – ");
  return (
    <>
      {parts.map((p, i) => (
        <span key={p + i}>
          {UPCOMING_STATES.includes(p) ? <span className="text-ink underline decoration-crimson-deep decoration-1 underline-offset-[0.22em]">{p}</span> : p}
          {i < parts.length - 1 ? <span className="text-ink/60"> – </span> : null}
        </span>
      ))}
    </>
  );
}

type Item = { kind: "year"; i: number } | { kind: "photo"; key: PhotoKey; note?: boolean };
// The timeline, in order. Photographs sit between years without being tied to one,
// because the brochure does not say which edition they belong to.
const track: Item[] = [
  { kind: "year", i: 0 },
  { kind: "year", i: 1 },
  { kind: "photo", key: "flagOff", note: true },
  { kind: "year", i: 2 },
  { kind: "year", i: 3 },
  { kind: "photo", key: "address" },
  { kind: "year", i: 4 },
  { kind: "year", i: 5 },
  { kind: "year", i: 6 },
  { kind: "year", i: 7 },
];

/** A figure that counts up as it enters (the server renders the final value). */
function Figure({ value, label, note }: { value: string; label: string; note?: boolean }) {
  const n = parseInt(value, 10);
  const suffix = value.replace(String(n), "");
  return (
    <div className="archive-figure flex flex-col" data-figure>
      <dt className="caption order-3 mt-3 max-w-[11rem]" data-figure-label>
        {label}
      </dt>
      <div aria-hidden="true" className="route-rule order-2 mt-4 text-ink" data-figure-rule />
      <dd className="num order-1 whitespace-nowrap text-[clamp(3.25rem,2rem+3.6vw,6rem)] leading-[0.9] text-ink">
        <span data-count={n}>{n}</span>
        <span>{suffix}</span>
        {note ? <NoteRef id="alumni" /> : null}
      </dd>
    </div>
  );
}

const firstYear = pastEditions[0].year;
const lastYear = pastEditions[pastEditions.length - 1].year;

/**
 * The archive: the secondary colour at full strength, on a lit ground the
 * full width of the page. Its title widens into place with the scroll; the
 * figures sit in a ruled ledger, count up, and are ruled off one by one. Then the
 * reader travels sideways along a decade of routes, with archival
 * photographs developing from monochrome between the years.
 */
export function ArchiveChapter() {
  return (
    <section id="archive" aria-labelledby="archive-title" className="on-saffron ground gloss" data-archive>
      <div className="archive-head pb-[clamp(4rem,8vw,6rem)] pt-[clamp(6rem,12vw,10rem)]">
        <div className="archive-kicker" data-archive-kicker>
          <span className="caps">The archive</span>
          <span aria-hidden="true" className="archive-kicker-rule" data-archive-rule />
          <span className="caps num">
            {firstYear}–{lastYear}
          </span>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid items-end gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <h2 id="archive-title" className="d-xl lg:col-span-8" data-archive-title>
            A decade on the road
          </h2>
          <p className="max-w-[22rem] lg:col-span-4 lg:justify-self-end">
            Every figure and route in this chapter describes past editions, not the upcoming one. Routes are reproduced from the 2025 brochure.
          </p>
        </div>

        <div className="mt-[clamp(4rem,8vw,6rem)]">
          <p className="label">
            Figures from the {CONCEPT_NOTE}, ahead of the 9th edition
          </p>
          <dl className="archive-figures mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 lg:gap-x-0">
            {conceptFigures.map((s) => (
              <Figure key={s.label} value={s.value} label={s.label} note={Boolean(s.note)} />
            ))}
          </dl>
        </div>
      </div>

      {/* The road: a horizontal track on large screens, a list elsewhere */}
      <div className="archive-road" data-road>
        <div className="archive-road-head archive-head flex items-baseline justify-between gap-6">
          <h3 className="d-m">Past routes</h3>
          <p className="caption">States on the upcoming route are underlined.</p>
        </div>
        <ol className="archive-track" data-track aria-label="Past Good Governance Yatra routes by year">
          {track.map((item, k) => {
            if (item.kind === "photo") {
              const p = photos[item.key];
              return (
                <li key={item.key} className="archive-item archive-photo" aria-hidden={false}>
                  <figure data-develop>
                    <div className="media" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                      <Image src={p.src} alt={p.alt} fill quality={82} sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                    </div>
                    <figcaption className="caption mt-3 max-w-[22rem]">
                      {p.caption}
                      {item.note ? <NoteRef id="flagoff" /> : null} Photograph from the GGY brochure.
                    </figcaption>
                  </figure>
                </li>
              );
            }
            const e = pastEditions[item.i];
            return (
              <li key={e.year + e.route} className={`archive-item archive-year-card ${k % 2 ? "is-low" : ""}`} data-year-index={item.i}>
                {/* The milestone belongs to the road and stays on it; only the
                    card's body is carried by the arrival animation. */}
                <span aria-hidden="true" className="archive-milestone" />
                <div data-year-card>
                  <span className="archive-year num">{e.year}</span>
                  {e.season ? <span className="label mt-4 block">{e.season}</span> : null}
                  <p className="mt-3 max-w-[18rem] font-display text-[clamp(1.2rem,1.05rem+0.5vw,1.55rem)] leading-snug">
                    <RouteText route={e.route} />
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <nav aria-label="Jump to a year" className="archive-head mt-6 lg:mt-0">
          <div aria-hidden="true" className="archive-progress relative mb-4 h-px bg-ink/25">
            <div className="absolute inset-0 origin-left scale-x-0 bg-ink" data-road-progress />
          </div>
          <ul className="flex flex-wrap gap-x-1 gap-y-2">
            {pastEditions.map((e, i) => (
              <li key={e.year + e.route}>
                <button type="button" data-year-jump={i} aria-label={`${e.year}${e.season ? `, ${e.season}` : ""}: ${e.route}`} className="year-chip">
                  {e.year}
                  {e.season && e.season !== "8th edition" ? <span className="text-[0.7em]"> {e.season.toLowerCase()}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="h-[clamp(5rem,10vw,8rem)]" />
      <ArchiveMotion />
    </section>
  );
}
