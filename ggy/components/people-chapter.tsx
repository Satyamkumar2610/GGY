import Image from "next/image";
import { BROCHURE, careerPaths, CONCEPT_NOTE, met8, photos, previousEdition, roleModels, saarthi } from "@/content/ggy";
import { NoteRef } from "./primitives";
import { PeopleRoll } from "./people-roll";
import { PathsMotion } from "./motion/paths-motion";
import { PeopleMotion } from "./motion/people-motion";

/**
 * People: the leaders delegates have met. The 8th edition's interactions,
 * from the concept note, come first, then the names printed in the 2025
 * brochure. The chapter opens on the count and the photograph of delegates
 * on the steps; the roll below can be filtered and has a spotlight.
 */
export function PeopleChapter() {
  const total = met8.length + roleModels.length;
  return (
    <section id="people" aria-labelledby="people-title" className="overflow-x-clip bg-paper py-[clamp(6rem,12vw,11rem)]" data-people>
      <div className="page">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-8">
            <p className="kicker">
              <span className="num">07</span> People and institutions
            </p>
            <h2 id="people-title" className="d-xl mt-6" data-drift>
              The people delegates met
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="flex items-baseline gap-4">
              <span className="num text-[clamp(4rem,2.5rem+4vw,7rem)] leading-[0.85] text-saffron" data-people-count>
                {total}
              </span>
              <span className="max-w-[10rem] text-[0.85rem] text-muted">leaders, officials and reformers named so far</span>
            </p>
            <p className="mt-6 max-w-[24rem] text-[0.95rem] text-ink-soft">
              From the {CONCEPT_NOTE} for the 8th edition and the {BROCHURE} for earlier ones. Names and titles are reproduced as printed.
              <NoteRef id="titles" />
            </p>
          </div>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <PeopleRoll />
        </div>

        <div className="institutions mt-[clamp(5rem,10vw,8rem)]">
          <h3 className="d-m lg:max-w-[18ch]">The institutions behind the 2025 edition</h3>
          <dl className="institutions-list">
            <div data-row>
              <dt className="caption">Organised by</dt>
              <dd>Rashtram School of Public Leadership</dd>
              <dd className="institutions-sub">Rishihood University, Sonipat</dd>
            </div>
            <div data-row>
              <dt className="caption">An initiative of</dt>
              <dd>{previousEdition.initiativeOf}</dd>
              <dd className="institutions-sub">As printed on the 2025 brochure cover</dd>
            </div>
            <div data-row>
              <dt className="caption">Yatra leader, 2025</dt>
              <dd>Shri Shantanu Gupta</dd>
              <dd className="institutions-sub">Professor of Practice, Rashtram School of Public Leadership, Rishihood University</dd>
            </div>
          </dl>
          <p className="caption mt-6 max-w-[34rem]">From the {BROCHURE}. The organiser and Yatra leader of the upcoming edition are to be confirmed.</p>
        </div>
      </div>
      <PeopleMotion />
    </section>
  );
}

/**
 * Life after the Yatra, on the crimson ground: the concept note's purpose for
 * its alumni, set as a quotation, and the paths alumni have taken, as listed
 * in the 2025 brochure, in large type. Each path is ruled off as it arrives
 * and lights up under the pointer.
 */
export function LifeAfterChapter() {
  const p = photos.overhead;
  return (
    <section id="after" aria-labelledby="after-title" className="on-dark on-ember ground gloss py-[clamp(6rem,12vw,10rem)]" data-paths>
      <div className="page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-6">
            <h2 id="after-title" className="d-l" data-drift>
              Where alumni went next
            </h2>
          </div>
          <figure className="lg:col-span-5 lg:col-start-8 lg:pt-4">
            <blockquote className="paths-quote font-serif">{saarthi.text}</blockquote>
            <figcaption className="caption mt-4">From the {CONCEPT_NOTE}.</figcaption>
          </figure>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="media relative aspect-[3/4]" data-reveal>
                <Image src={p.src} alt={p.alt} fill quality={80} sizes="(min-width: 1024px) 22vw, 100vw" className="object-cover" />
              </div>
              <p className="caption mt-3">{p.caption}. Photograph from the GGY brochure.</p>
            </div>
          </div>
          <div className="lg:col-span-9">
            <ol className="paths" aria-label="Paths alumni have taken">
              {careerPaths.map((c, i) => (
                <li key={c} className="paths-row" data-path>
                  <span aria-hidden="true" className="paths-rule" data-path-rule />
                  <span aria-hidden="true" className="paths-index num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="paths-name" data-path-name>
                    {c}
                  </span>
                  <span aria-hidden="true" className="paths-arrow">
                    ↗
                  </span>
                </li>
              ))}
            </ol>
            <p className="caption mt-6">As listed in the {BROCHURE} under “Life after Good Governance Yatra”.</p>
          </div>
        </div>
      </div>
      <PathsMotion />
    </section>
  );
}
