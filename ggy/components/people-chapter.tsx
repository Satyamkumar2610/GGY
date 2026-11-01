import Image from "next/image";
import { BROCHURE, careerPaths, CONCEPT_NOTE, met8, photos, previousEdition, roleModels, saarthi } from "@/content/ggy";
import { NoteRef } from "./primitives";
import { PeopleRoll } from "./people-roll";
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
    <section id="roll" aria-label="The people delegates met" className="overflow-x-clip bg-paper pb-[clamp(6rem,12vw,11rem)] pt-[clamp(3rem,6vw,5rem)]" data-people data-thread="People">
      <div className="page">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-4 lg:col-start-1">
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
  // The brochure's list, set as one sentence. Acronyms keep their capitals.
  const inSentence = (c: string) => (/^[A-Z]{2,}/.test(c) ? c : c[0].toLowerCase() + c.slice(1));
  return (
    <section id="after" aria-labelledby="after-title" className="bg-cream py-[clamp(6rem,12vw,10rem)]" data-thread="Alumni">
      <div className="page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-3">
            <div className="media relative aspect-[3/4]" data-reveal>
              <Image src={p.src} alt={p.alt} fill quality={80} sizes="(min-width: 1024px) 22vw, 100vw" className="object-cover" />
            </div>
            <p className="caption mt-3">{p.caption}. Photograph from the GGY brochure.</p>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 id="after-title" className="kicker">
              Where alumni went next
            </h2>
            <p className="paths-sentence mt-6">
              Alumni have gone on to{" "}
              {careerPaths.map((c, i) => (
                <span key={c}>
                  <span className="paths-term">{inSentence(c)}</span>
                  {i < careerPaths.length - 2 ? ", " : i === careerPaths.length - 2 ? ", and " : "."}
                </span>
              ))}
            </p>
            <p className="caption mt-5">As listed in the {BROCHURE} under “Life after Good Governance Yatra”.</p>
            <figure className="paths-saarthi mt-12">
              <blockquote className="font-display text-[clamp(1.3rem,1.1rem+0.6vw,1.7rem)] italic leading-snug">“{saarthi.text}”</blockquote>
              <figcaption className="caption mt-3">From the {CONCEPT_NOTE}.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
