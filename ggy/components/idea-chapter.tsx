import { about, BROCHURE } from "@/content/ggy";
import { AnnotatedPhoto } from "./annotated-photo";
import { ImmersionStage } from "./immersion-stage";
import { NoteRef } from "./primitives";
import { IdeaMotion } from "./motion/idea-motion";

/** A saffron brush mark, swept under a word as the reader arrives. */
function Mark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 24" preserveAspectRatio="none" className="mark">
      <path data-mark d="M1 12 C 74 3, 146 20, 299 6 L 299 17 C 146 30, 74 13, 1 21 Z" fill="currentColor" />
    </svg>
  );
}

// The phrases of the brochure's description that carry it, lit in saffron
// as the statement fills.
const KEYS = ["10-day immersive travel program", "witness transformative governance projects firsthand", "visionary policymakers"];

/** The brochure's text, verbatim, with its key phrases marked. */
function InkText({ text }: { text: string }) {
  const parts = text.split(new RegExp(`(${KEYS.join("|")})`));
  return (
    <>
      {parts.map((part, i) =>
        KEYS.includes(part) ? (
          <em key={i} className="ink-key">
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * The idea: the programme's own description of itself, set as a statement on
 * the crimson ground. Two phrases take a brush mark as the reader arrives;
 * then the four words from the brochure cover open onto the delegates
 * themselves. The brochure's description is set large and fills with ink
 * word by word at the pace of the scroll, and the second photograph is
 * printed in two inks until it reaches the reader, when it comes back to
 * colour.
 */
export function IdeaChapter() {
  return (
    <section id="about" aria-labelledby="about-title" className="on-dark on-ember ground gloss py-[clamp(6rem,13vw,12rem)]" data-idea>
      <div className="page">
        <h2 id="about-title" className="sr-only">
          The idea behind the Yatra
        </h2>

        <figure>
          <blockquote>
            <p className="idea-claim font-serif" data-idea-claim>
              India’s oldest immersive yatra into{" "}
              <span className="relative inline-block italic">
                governance
                <Mark />
              </span>{" "}
              and{" "}
              <span className="relative inline-block italic">
                leadership
                <Mark />
              </span>
            </p>
          </blockquote>
          <figcaption className="caption mt-7">How the programme describes itself in the {BROCHURE}.</figcaption>
        </figure>
      </div>

      <ImmersionStage />

      <div className="page">
        <p className="idea-statement" data-ink>
          <InkText text={about.text[0]} />
          <NoteRef id="duration" />
        </p>
        <p className="caption mt-6">From the {BROCHURE}.</p>

        <div className="mt-[clamp(4rem,9vw,7rem)] grid lg:grid-cols-12 lg:gap-[var(--gap)]">
          <AnnotatedPhoto photoKey="openLandscape" sizes="(min-width: 1024px) 66vw, 100vw" className="lg:col-span-8 lg:col-start-5 lg:-mr-[var(--gutter)]" dark duotone />
        </div>
      </div>
      <IdeaMotion />
    </section>
  );
}
