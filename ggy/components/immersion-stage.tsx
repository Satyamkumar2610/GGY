import Image from "next/image";
import { about, photos } from "@/content/ggy";
import { ImmersionMotion } from "./motion/immersion-motion";

/**
 * The four words on the brochure cover, set around a small window onto the
 * delegates. With motion, the stage pins and the window opens until the
 * photograph fills the screen, while the words are carried off to the four
 * edges at their own speeds. Without motion it is a row of words and a
 * photograph, in reading order.
 */
export function ImmersionStage() {
  // A wide photograph for wide screens and an upright one for phones, so the
  // full-screen window never has to enlarge a thin slice of a panorama.
  const p = photos.cohort;
  const tall = photos.legislatureSteps;
  return (
    <div className="immersion" data-immersion>
      <div className="immersion-stage" data-immersion-stage>
        <figure className="immersion-frame" data-frame>
          <div className="immersion-media is-wide">
            <Image src={p.src} alt={p.alt} fill quality={85} sizes="(min-width: 48rem) 100vw, 1px" className="object-cover" />
          </div>
          <div className="immersion-media is-tall">
            <Image src={tall.src} alt={tall.alt} fill quality={85} sizes="(min-width: 48rem) 1px, 100vw" className="object-cover" />
          </div>
          <div aria-hidden="true" className="immersion-scrim" data-scrim />
          <figcaption className="immersion-caption caption" data-caption>
            <span className="is-wide">{p.caption}.</span>
            <span className="is-tall">{tall.caption}.</span> Photograph from the GGY brochure.
          </figcaption>
        </figure>
        <ul className="immersion-words" aria-label="The four words on the brochure cover">
          {about.tagline.map((w, i) => (
            <li key={w} className="immersion-word" data-word>
              <span aria-hidden="true" className="immersion-index num">
                0{i + 1}
              </span>
              {w}
            </li>
          ))}
        </ul>
        <p className="immersion-note caption" data-immersion-note>
          The four words on the brochure cover.
        </p>
      </div>
      <ImmersionMotion />
    </div>
  );
}
