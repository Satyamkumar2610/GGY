import { atlas, unionBox } from "@/lib/atlas";

const FOCUS = ["IN-GJ", "IN-MH", "IN-GA"];
const CONTEXT = ["IN-RJ", "IN-MP", "IN-KA", "IN-TG", "IN-DH", "IN-CT", "IN-AP", "IN-KL"];

/**
 * The last composition: the three states of the upcoming edition in ivory
 * linework on the maroon, their neighbours barely there. Drawn by the scroll.
 */
export function ClosingMap() {
  const b = unionBox(FOCUS);
  const pad = 70;
  const vb = [b[0] - pad, b[1] - pad, b[2] - b[0] + pad * 2, b[3] - b[1] + pad * 2];
  return (
    <svg className="closing-map" viewBox={vb.join(" ")} preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <g className="closing-grat">
        {atlas.graticule.map((g, i) => (
          <path key={i} d={g.d} />
        ))}
      </g>
      {atlas.states
        .filter((s) => CONTEXT.includes(s.iso))
        .map((s) => (
          <path key={s.iso} d={s.d} className="closing-ctx" />
        ))}
      {atlas.states
        .filter((s) => FOCUS.includes(s.iso))
        .map((s) => (
          <path key={s.iso} d={s.d} pathLength={1} className="closing-state" data-draw />
        ))}
    </svg>
  );
}
