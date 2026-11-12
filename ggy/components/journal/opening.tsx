import { atlas } from "@/lib/atlas";
import { about, BROCHURE } from "@/content/ggy";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";
import { FieldCompare } from "./field-compare";
import { IdeaPanels } from "./idea-panels";

// The Yatra at a glance, as given in the GGY'27 brief.
const STATS = [
  { value: "1", label: "Unforgettable Experience" },
  { value: "7", label: "Immersive Days" },
  { value: "1000+", label: "Kms of Exploration" },
  { value: "3", label: "States" },
  { value: "40", label: "Handpicked Delegates" },
].map((s) => ({ ...s, count: s.value.replace(/\D/g, "") }));

/* What each cover word stands for, in lines the brochure itself prints. */
const WORD_LINES: Record<string, string> = {
  Immerse: "“witness transformative governance projects firsthand”",
  Engage: "“engage with visionary policymakers shaping India’s future”",
  Learn: "“Live exposure to last-mile governance institutions”",
  Network: "“Join an exclusive network of 350+ alumni”",
};

/**
 * Departure: the red band after the opening. The states of India draw
 * themselves in beside the claim; the Yatra in five figures; and the four
 * words from the brochure cover open across the full width of the page.
 */
export function Departure() {
  const [x0, y0, x1, y1] = atlas.outlineBounds;
  return (
    <section className="lp-band j-band on-dark" data-nav="light" data-j-station="band" aria-labelledby="lp-band-title">
      <div className="j-wrap j-band__top">
        <div className="j-band__copy">
          <h2 id="lp-band-title" className="lp-band__title" data-settle>
            Governance,
            <br />
            on the ground
          </h2>
          <p className="j-band__claim">{about.claim}.</p>
        </div>
        <svg className="j-band__map" viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} aria-hidden="true">
          {atlas.states.map((s) => (
            <path key={s.iso} d={s.d} data-lp-draw className={s.focus ? "is-focus" : undefined} pathLength={1} />
          ))}
          {/* The national outline as India states it, Gilgit-Baltistan and all: the
              state polygons alone leave the north-west open. */}
          <path d={atlas.outline} data-lp-draw className="is-border" pathLength={1} />
        </svg>
      </div>
      <div className="j-wrap">
        <dl className="j-stats" aria-label="The Yatra at a glance">
          {STATS.map((f) => (
            <div key={f.label} className="j-stats__item">
              <dt className="j-stats__label">{f.label}</dt>
              <dd className="j-stats__value" data-count={f.count}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="j-wrap j-words" data-words aria-label={`The four words on the brochure cover: ${about.tagline.join(", ")}`}>
        {about.tagline.map((w) => (
          <span key={w} aria-hidden="true" data-tip={WORD_LINES[w]}>
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}

/**
 * The field: the lecture hall and the open country in one frame, divided by
 * a handle the reader drags from one into the other. Then the idea
 * of the Yatra in the brochure's own words.
 */
export function Field() {
  return (
    <section className="j-sec j-paper" data-nav="dark" data-j-station="field" data-arch aria-labelledby="field-title">
      <div className="j-wrap">
        <Head id="field-title" title="The field is" em="the classroom">
          <p>Delegates leave the lecture hall for the places where policy is carried out, and meet the people carrying it out.</p>
        </Head>

        <FieldCompare />

        <div id="idea" className="j-idea">
          <div className="j-idea__lead">
            <Title title="Beyond the map lies" em="the real learning" />
            <p className="j-meta">
              From the {BROCHURE}.
              <NoteRef id="duration" />
            </p>
          </div>
          <IdeaPanels />
        </div>

        <p className="j-statement" data-ink>
          {about.text[0]}
        </p>
      </div>
    </section>
  );
}
