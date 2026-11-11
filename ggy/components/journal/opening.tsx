import { atlas } from "@/lib/atlas";
import { about, BROCHURE, upcoming } from "@/content/ggy";
import { NoteRef } from "../primitives";
import { Head, STAR, Title } from "./head";
import { FieldCompare } from "./field-compare";

// The confirmed route, north to south.
const ROUTE = ["Gujarat", "Maharashtra", "Goa"].map((n) => upcoming.states.find((s) => s.name === n)!);

/**
 * Departure: the crimson band after the opening. The states of India draw
 * themselves in beside the claim, and the four words from the brochure cover
 * open across the full width of the page as the band is crossed.
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
        <div className="j-glide" role="img" aria-label="The upcoming edition: Gujarat, Maharashtra, Goa">
          <div className="j-glide__belt" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span key={copy} className="j-glide__row">
                {ROUTE.map((s) => (
                  <span key={s.name} className="j-glide__item">
                    <b>{s.name}</b>
                    <span lang={s.lang} className="j-glide__native">
                      {s.native}
                    </span>
                    <svg viewBox="0 0 28.1 32" className="j-glide__star">
                      <path d={STAR} />
                    </svg>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="j-wrap j-words" data-words aria-label={`The four words on the brochure cover: ${about.tagline.join(", ")}`}>
        {about.tagline.map((w) => (
          <span key={w} aria-hidden="true">
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}

/* What the Yatra is for, each in the words of the 2025 brochure. */
const MODES = [
  { name: "First-hand exposure", quote: "witness transformative governance projects firsthand", src: "Brochure, p.2" },
  { name: "Leaders and institutions", quote: "engage with visionary policymakers shaping India’s future", src: "Brochure, p.2" },
  { name: "Learning in the field", quote: "Live exposure to last-mile governance institutions and interaction with stakeholders", src: "Field Visit, brochure p.10" },
  { name: "Administration in practice", quote: "experience first-hand the complications and contradictions of the policy implementation processes", src: "Experience, brochure p.7" },
  { name: "People and places", quote: "Deepen your understanding of Bharat through insights from grassroots leaders", src: "Bharat Insights, brochure p.3" },
];

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
          <ul className="j-rows j-idea__rows">
            {MODES.map((m) => (
              <li key={m.name} className="j-row">
                <i className="j-rule" data-rule />
                <h3 className="j-h3">{m.name}</h3>
                <p className="j-quote">“{m.quote}”</p>
                <p className="j-meta">{m.src}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="j-statement" data-ink>
          {about.text[0]}
        </p>
      </div>
    </section>
  );
}
