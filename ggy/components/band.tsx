import { Fragment } from "react";
import { upcoming } from "@/content/ggy";
import { Script } from "./primitives";
import { BandMotion } from "./motion/band-motion";

/**
 * The band: the three states of the upcoming edition, each in Latin and in its
 * own script, set in Anek — one design from Mumbai that covers all three
 * scripts. It travels sideways, and its letters widen and lean with the speed
 * of the reader's scroll. Decorative: the same names are read elsewhere.
 */
export function Band() {
  const words = upcoming.states.flatMap((s) => [
    { key: s.name, text: s.name, lang: null as string | null },
    { key: s.native, text: s.native, lang: s.lang },
  ]);
  const group = (copy: number) => (
    <div className="band-group" key={copy}>
      {words.map((w) => (
        <Fragment key={w.key}>
          {w.lang ? (
            <Script lang={w.lang} className="band-word">
              {w.text}
            </Script>
          ) : (
            <span className="band-word">{w.text}</span>
          )}
          <span className="band-mark" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="band" data-band>
      <div className="band-track" data-band-track>
        {group(0)}
        {group(1)}
      </div>
      <BandMotion />
    </div>
  );
}
