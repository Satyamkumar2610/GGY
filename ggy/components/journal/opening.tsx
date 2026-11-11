import TiltedCard from "../TiltedCard";
import { optimized } from "@/lib/image-url";
import { atlas } from "@/lib/atlas";
import { about, annotations, BROCHURE, components, photos } from "@/content/ggy";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";

const field = components.find((c) => c.name === "Field Visit")!;
const policy = components.find((c) => c.name === "Interaction with Policy Architects")!;
const cases = components.find((c) => c.name === "Case Studies")!;

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
        </svg>
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
 * The field: the lecture hall and the open country side by side, opening
 * outward from the gutter between them as the reader arrives. Then the idea
 * of the Yatra in the brochure's own words.
 */
export function Field() {
  const hall = photos.lectureHall;
  const land = photos.openLandscape;
  const notes = annotations.openLandscape ?? [];
  return (
    <section className="j-sec j-paper" data-nav="dark" data-j-station="field" aria-labelledby="field-title">
      <div className="j-wrap">
        <Head id="field-title" title="The field is" em="the classroom">
          <p>Delegates leave the lecture hall for the places where policy is carried out, and meet the people carrying it out.</p>
        </Head>

        {/* Two prints from the field. Each can be turned over to read what
            the brochure says about it, as on the back of a photograph. */}
        <div className="j-pair" data-pair>
          <figure className="j-fig">
            <div className="j-print" data-pair-left data-cursor="Turn over">
              <TiltedCard
                imageSrc={optimized(hall.src)}
                altText={hall.alt}
                captionText="Turn over: the lecture hall"
                showTooltip={false}
                containerWidth="100%"
                containerHeight="auto"
                imageWidth="100%"
                imageHeight="100%"
                style={{ aspectRatio: "3 / 2" }}
                radius={4}
                rotateAmplitude={7}
                scaleOnHover={1.02}
                glare={0.28}
                glareColor="#fbf3e6"
                shadow={0.35}
                gyroscope={false}
                intro={false}
                backContent={
                  <div className="j-print__back">
                    <p className="j-print__hand">{hall.caption}</p>
                    <p className="j-meta">Photograph from the GGY brochure.</p>
                  </div>
                }
              />
            </div>
            <figcaption>
              <h3 className="j-h3">The institutions</h3>
              <p className="j-body">{field.text}</p>
            </figcaption>
          </figure>
          <figure className="j-fig">
            <div className="j-print" data-pair-right data-cursor="Turn over">
              <TiltedCard
                imageSrc={optimized(land.src)}
                altText={land.alt}
                captionText="Turn over: the Tropic of Cancer marker"
                showTooltip={false}
                containerWidth="100%"
                containerHeight="auto"
                imageWidth="100%"
                imageHeight="100%"
                style={{ aspectRatio: "3 / 2" }}
                radius={4}
                rotateAmplitude={7}
                scaleOnHover={1.02}
                glare={0.28}
                glareColor="#fbf3e6"
                shadow={0.35}
                gyroscope={false}
                intro={false}
                backContent={
                  <div className="j-print__back">
                    <dl className="j-seen">
                      {notes.map((n) => (
                        <div key={n.title}>
                          <dt>{n.title}</dt>
                          <dd>{n.text}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="j-meta">{land.caption} Photograph from the GGY brochure.</p>
                  </div>
                }
              />
            </div>
            <figcaption>
              <h3 className="j-h3">The people</h3>
              <p className="j-body">
                {policy.text} {cases.text}
              </p>
            </figcaption>
          </figure>
        </div>
        <p className="j-meta j-pair__hint">Select a photograph to turn it over.</p>

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
