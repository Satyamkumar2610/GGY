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

// The phrases of the brochure's description that carry it, lit in saffron
// as the statement fills.
/* What the Yatra is for, each in the words of the 2025 brochure. */
const MODES = [
  { name: "First-hand exposure", quote: "witness transformative governance projects firsthand", src: "Brochure, p.2" },
  { name: "Leaders and institutions", quote: "engage with visionary policymakers shaping India’s future", src: "Brochure, p.2" },
  { name: "Learning in the field", quote: "Live exposure to last-mile governance institutions and interaction with stakeholders", src: "Field Visit, brochure p.10" },
  { name: "Administration in practice", quote: "experience first-hand the complications and contradictions of the policy implementation processes", src: "Experience, brochure p.7" },
  { name: "People and places", quote: "Deepen your understanding of Bharat through insights from grassroots leaders", src: "Bharat Insights, brochure p.3" },
];

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
    <section id="idea" aria-labelledby="about-title" className="on-dark on-ember ground gloss py-[clamp(6rem,13vw,12rem)]" data-idea data-ground-reveal>
      <div className="page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-7">
            <p className="kicker text-ivory/80">
              <span className="num">04</span> The idea behind the Yatra
            </p>
            <h2 id="about-title" className="d-xl mt-6" data-drift>
              Beyond the map lies the real learning.
            </h2>
          </div>
          <ol className="idea-modes lg:col-span-5 lg:pt-4">
            {MODES.map((m, i) => (
              <li key={m.name} className="idea-mode" data-mode>
                <span className="idea-mode-num num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="idea-mode-name">{m.name}</span>
                  <span className="idea-mode-quote">“{m.quote}”</span>
                  <span className="idea-mode-src">{m.src}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="page mt-[clamp(6rem,12vw,10rem)]">
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

      {/* The four words on the brochure cover, set as one line. */}
      <div className="page mt-[clamp(4rem,8vw,6.5rem)]">
        <p className="idea-words" aria-label={`The four words on the brochure cover: ${about.tagline.join(", ")}`}>
          {about.tagline.map((w, i) => (
            <span key={w} aria-hidden="true" className="idea-word" data-row>
              <span className="idea-word-num num">{String(i + 1).padStart(2, "0")}</span>
              {w}
            </span>
          ))}
        </p>
        <p className="caption mt-4">The four words on the cover of the {BROCHURE}.</p>
      </div>

      <div className="page">
        <p className="idea-statement" data-ink>
          <InkText text={about.text[0]} />
        </p>
        <p className="caption mt-6">
          From the {BROCHURE}.
          <NoteRef id="duration" />
        </p>

        <div className="mt-[clamp(4rem,9vw,7rem)] grid lg:grid-cols-12 lg:gap-[var(--gap)]">
          <AnnotatedPhoto photoKey="openLandscape" sizes="(min-width: 1024px) 66vw, 100vw" className="lg:col-span-8 lg:col-start-5 lg:-mr-[var(--gutter)]" dark duotone />
        </div>
      </div>
      <IdeaMotion />
    </section>
  );
}
