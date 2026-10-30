import { about, BROCHURE } from "@/content/ggy";
import { AnnotatedPhoto } from "./annotated-photo";
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

/**
 * The idea: the programme's own description of itself, set as a statement on
 * ember and lit from behind in saffron. Two phrases take a brush mark as the
 * reader arrives, the four words from the brochure cover are set as the
 * chapter's own marks, and the photograph is printed in two inks until it
 * reaches the reader, when it comes back to colour.
 */
export function IdeaChapter() {
  return (
    <section id="about" aria-labelledby="about-title" className="on-dark on-ember ground relative overflow-hidden py-[clamp(6rem,13vw,12rem)]" data-idea>
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

        <ul className="idea-tagline" aria-label="The four words on the brochure cover">
          {about.tagline.map((w) => (
            <li key={w}>
              <span data-idea-word>{w}</span>
            </li>
          ))}
        </ul>
        <p className="caption mt-7">The four words on the brochure cover.</p>

        <div className="mt-[clamp(4rem,9vw,7rem)] grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <AnnotatedPhoto photoKey="openLandscape" sizes="(min-width: 1024px) 58vw, 100vw" className="lg:col-span-7 lg:-ml-[var(--gutter)]" dark duotone />

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-[8%]">
            <p className="lede text-cream/85">
              {about.text[0]}
              <NoteRef id="duration" />
            </p>
            <p className="caption mt-4">From the {BROCHURE}.</p>
          </div>
        </div>
      </div>
      <IdeaMotion />
    </section>
  );
}
