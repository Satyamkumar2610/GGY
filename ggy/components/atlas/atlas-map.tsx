import { atlas, project, type FocusIso } from "@/lib/atlas";

/** Texture for each state of the upcoming edition, and for India as a whole. */
export const STATE_TEXTURE: Record<FocusIso, string> = {
  "IN-GJ": "/images/map/gujarat-sabarmati-ashram.jpg",
  "IN-GA": "/images/map/goa-basilica-bom-jesus.jpg",
  "IN-MH": "/images/map/maharashtra-gateway-of-india.jpg",
};
export const INDIA_TEXTURE = "/images/map/ggy-delegates-field-group-duo.jpg";

export const STATE_NAME: Record<FocusIso, string> = { "IN-GJ": "Gujarat", "IN-GA": "Goa", "IN-MH": "Maharashtra" };

const focus = atlas.states.filter((s) => s.focus);
const context = atlas.states.filter((s) => !s.focus);
const india = atlas.outlineBounds;
const westCentre = project(73.5, 19.5);

/**
 * The map itself: one SVG in projected atlas units. The camera group is
 * transformed by the scroll engine (atlas-engine.ts); strokes do not scale
 * with it. Photographs are clipped to the true state outlines.
 */
export function AtlasMap({ onState, idPrefix = "atlas" }: { onState?: (iso: FocusIso) => void; idPrefix?: string }) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg className="atlas-svg" data-atlas-svg aria-hidden={onState ? undefined : true} role={onState ? "group" : undefined} aria-label={onState ? "Map of India. Gujarat, Goa and Maharashtra can be opened." : undefined}>
      <defs>
        <clipPath id={id("india")} clipPathUnits="userSpaceOnUse">
          <path d={atlas.outline} />
        </clipPath>
        {focus.map((s) => (
          <clipPath key={s.iso} id={id(`clip-${s.iso}`)} clipPathUnits="userSpaceOnUse">
            <path d={s.d} />
          </clipPath>
        ))}
        {/* The reveal: a disc that opens from the west coast. */}
        <mask id={id("reveal")} maskUnits="userSpaceOnUse" x="-200" y="-200" width={atlas.width + 400} height={atlas.height + 400}>
          <circle data-a-reveal cx={westCentre[0]} cy={westCentre[1]} r="1400" fill="#fff" />
        </mask>
        <pattern id={id("hatch")} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>

      <g data-camera>
        {/* Graticule */}
        <g className="atlas-grat" data-a-grat>
          {atlas.graticule.map((g, i) => (
            <path key={i} d={g.d} />
          ))}
        </g>

        {/* Neighbouring countries, for context */}
        <g className="atlas-neighbours" data-a-ctx>
          {atlas.neighbours.map((n) => (
            <path key={n.id} d={n.d} />
          ))}
        </g>

        {/* India: land, then the photograph through the silhouette */}
        <path className="atlas-land" d={atlas.outline} data-a-ctx />
        <g data-layer="india-photo" clipPath={`url(#${id("india")})`}>
          <g mask={`url(#${id("reveal")})`}>
            <image href={INDIA_TEXTURE} x={india[0]} y={india[1]} width={india[2] - india[0]} height={india[3] - india[1]} preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        {/* State boundaries */}
        <g className="atlas-states" data-a-ctx>
          {context.map((s) => (
            <path key={s.iso} d={s.d} data-iso={s.iso} />
          ))}
        </g>

        {/* The three states of the upcoming edition */}
        {focus.map((s) => {
          const iso = s.iso as FocusIso;
          const [x0, y0, x1, y1] = s.bounds;
          const pad = (x1 - x0) * 0.04;
          return (
            <g key={iso} className="atlas-focus" data-focus-iso={iso}>
              <path className="atlas-focus-fill" d={s.d} />
              <g data-state-photo={iso} clipPath={`url(#${id(`clip-${iso}`)})`}>
                <image href={STATE_TEXTURE[iso]} x={x0 - pad} y={y0 - pad} width={x1 - x0 + pad * 2} height={y1 - y0 + pad * 2} preserveAspectRatio="xMidYMid slice" />
              </g>
              <path className="atlas-focus-line" d={s.d} pathLength={1} data-a-focus-line />
              {onState ? (
                <path
                  className="atlas-hit"
                  d={s.d}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open the ${STATE_NAME[iso]} dossier`}
                  onClick={() => onState(iso)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onState(iso);
                    }
                  }}
                />
              ) : null}
            </g>
          );
        })}

        <path className="atlas-tropic" d={atlas.tropic} data-a-ctx />
        <path className="atlas-outline" d={atlas.outline} pathLength={1} data-a-outline />
      </g>
    </svg>
  );
}
