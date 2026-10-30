import { Fragment } from "react";
import { upcoming } from "@/content/ggy";
import { Script } from "./primitives";
import { BandMotion } from "./motion/band-motion";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The band: the three states of the upcoming edition, each in Latin and in its
 * own script, set in Anek — one design from Mumbai that covers all three
 * scripts. It runs the full width of the page in the secondary colour, ruled
 * by two hairlines, with a quiet running head and foot, and its edges fading
 * the words in and out. It travels sideways, and its letters
 * widen and lean with the speed of the reader's scroll. Decorative: the same
 * names are read elsewhere.
 */
export function Band() {
  const words = upcoming.states.flatMap((s) => [
    { key: s.name, text: s.name, lang: null as string | null },
    { key: s.native, text: s.native, lang: s.lang },
  ]);
  const count = pad(upcoming.states.length);
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
          <span className="band-mark" data-band-mark />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="band-wrap" data-band-wrap>
      <div className="band ground gloss" data-band>
        <span className="band-frame" />
        <div className="band-meta" data-band-meta>
          <span className="caps">The upcoming route</span>
          <span className="band-meta-rule" data-band-rule />
          <span className="caps">
            {count} states · {count} scripts
          </span>
        </div>
        <div className="band-stage">
          <div className="band-track" data-band-track>
            {group(0)}
            {group(1)}
          </div>
        </div>
        <div className="band-meta" data-band-meta>
          <span className="caps">{upcoming.states.map((s) => s.name).join(" · ")}</span>
          <span className="band-meta-rule" data-band-rule />
          <span className="caps">One typeface</span>
        </div>
      </div>
      <BandMotion />
    </div>
  );
}
