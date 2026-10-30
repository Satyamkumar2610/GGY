import Image from "next/image";
import { careerPaths, photos, roleModels } from "@/content/ggy";
import { NoteRef } from "./primitives";
import { AnnotatedPhoto } from "./annotated-photo";
import { BoardMotion } from "./motion/board-motion";
import { PeopleMotion } from "./motion/people-motion";

/**
 * People: one annotated documentary photograph, and the names of the leaders
 * past delegates met, set as a running roll that brightens under the pointer.
 */
export function PeopleChapter() {
  return (
    <section id="people" aria-labelledby="people-title" className="overflow-x-clip bg-paper py-[clamp(6rem,12vw,11rem)]" data-people>
      <div className="page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-5">
            <h2 id="people-title" className="d-l max-w-[12ch]">
              The people delegates met
            </h2>
            <p className="mt-7 max-w-[26rem] text-[0.95rem] text-ink-soft">
              Leaders whom delegates of past editions met, as listed in the 2025 brochure. Names and titles are reproduced as printed.
              <NoteRef id="titles" />
            </p>
            <p className="mt-12 flex items-baseline gap-4">
              <span className="num text-[clamp(4rem,2.5rem+4vw,7rem)] leading-[0.85] text-saffron" data-people-count>
                {roleModels.length}
              </span>
              <span className="max-w-[9rem] text-[0.85rem] text-muted">named in the 2025 brochure</span>
            </p>
          </div>
          <AnnotatedPhoto photoKey="legislatureSteps" sizes="(min-width: 1024px) 46vw, 100vw" className="lg:col-span-6 lg:col-start-7" />
        </div>

        {/* The ledger: everyone the road has introduced, in the brochure's order */}
        <ul className="people-ledger mt-[clamp(4rem,8vw,6rem)]" aria-label="Leaders listed in the 2025 brochure">
          {roleModels.map((r) => (
            <li key={r.name} className="people-row" data-people-row>
              <span className="people-name">{r.name}</span>
              <span className="people-title">{r.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <PeopleMotion />
    </section>
  );
}

/** Split a destination into words of single-letter tiles. */
function Tiles({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap gap-x-[0.6em] gap-y-1" aria-hidden="true">
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="flex gap-[2px]">
          {[...w].map((ch, ci) => (
            <span key={ci} className="flap" data-flap-char={ch}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/**
 * Life after the Yatra, set as a split-flap departure board: the paths alumni
 * have taken, as listed in the 2025 brochure. Each tile flips into place.
 */
export function LifeAfterChapter() {
  const p = photos.overhead;
  return (
    <section id="after" aria-labelledby="after-title" className="overflow-x-clip bg-paper pb-[clamp(6rem,12vw,10rem)]">
      <div className="page grid gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
        <div className="lg:col-span-3">
          <h2 id="after-title" className="d-m">
            Where alumni went next
          </h2>
          <div className="media relative mt-8 aspect-[3/2]" data-reveal>
            <Image src={p.src} alt={p.alt} fill quality={80} sizes="(min-width: 1024px) 22vw, 100vw" className="object-cover" />
          </div>
          <p className="caption mt-3">{p.caption}. Photograph from the GGY brochure.</p>
        </div>
        <div className="lg:col-span-9 lg:-mr-[var(--gutter)]">
          <div className="board on-dark" data-board>
            <div className="board-head">
              <span className="caps">Departures</span>
              <span className="caps text-dim">Good Governance Yatra</span>
            </div>
            <ul aria-label="Paths alumni have taken">
              {careerPaths.map((c) => (
                <li key={c} className="board-row">
                  <span className="sr-only">{c}</span>
                  <Tiles text={c.toUpperCase()} />
                  <span aria-hidden="true" className="board-lamp" />
                </li>
              ))}
            </ul>
          </div>
          <p className="caption mt-4 lg:pr-[var(--gutter)]">As listed in the 2025 brochure under “Life after Good Governance Yatra”.</p>
        </div>
      </div>
      <BoardMotion />
    </section>
  );
}
