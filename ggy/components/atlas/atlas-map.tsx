import { atlas, project, type FocusIso } from "@/lib/atlas";
import relief from "@/content/relief.json";

/** Texture for each state of the upcoming edition, and for India as a whole. */
export const STATE_TEXTURE: Record<FocusIso, string> = {
  "IN-GJ": "/images/map/gujarat-sabarmati-ashram.jpg",
  "IN-GA": "/images/map/goa-basilica-bom-jesus.jpg",
  "IN-MH": "/images/map/maharashtra-gateway-of-india.jpg",
};
export const INDIA_TEXTURE = "/images/map/ggy-delegates-field-group-duo.jpg";
/** The same photograph in colour, seen through the loupe. */
export const INDIA_TEXTURE_COLOUR = "/images/map/ggy-delegates-field-group.jpg";
/** The relief is baked for eight directions of light; the page blends the two nearest to the pointer. */
export const RELIEF_AZIMUTHS = [0, 45, 90, 135, 180, 225, 270, 315] as const;
export const RELIEF_DEFAULT = 315;
export const reliefSrc = (az: number) => `/images/map/relief-${az}.jpg`;
export const RELIEF = reliefSrc(RELIEF_DEFAULT);

export const STATE_NAME: Record<FocusIso, string> = { "IN-GJ": "Gujarat", "IN-GA": "Goa", "IN-MH": "Maharashtra" };

const focus = atlas.states.filter((s) => s.focus);
const context = atlas.states.filter((s) => !s.focus);
const india = atlas.outlineBounds;
const westCentre = project(73.5, 19.5);
const goa = atlas.states.find((s) => s.iso === "IN-GA")!;
/** Where Goa's label sits, east of the state, and the leader that joins them. */
export const GOA_LABEL_AT = [goa.cx + 17, goa.cy - 3] as const;

/**
 * The map itself: one SVG in projected atlas units. The camera group is
 * transformed by the scroll engine (atlas-engine.ts); strokes do not scale
 * with it. Photographs are clipped to the true state outlines; the relief of
 * western India sits under the boundaries once the photograph of India gives
 * way to the states.
 */
export function AtlasMap({ onState, idPrefix = "atlas", lit = false }: { onState?: (iso: FocusIso) => void; idPrefix?: string; lit?: boolean }) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const r = relief;
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
        {/* The loupe: a disc that follows the pointer (atlas-cursor.ts). */}
        <clipPath id={id("loupe")} clipPathUnits="userSpaceOnUse">
          <circle data-loupe-clip cx="-999" cy="-999" r="60" />
        </clipPath>
        {/* The relief fades out at the edges of the area it covers. */}
        <linearGradient id={id("relief-x")} gradientUnits="userSpaceOnUse" x1={r.x} x2={r.x + r.width} y1="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.82" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id={id("relief-y")} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={r.y} y2={r.y + r.height}>
          <stop offset="0" stopColor="#000" />
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.88" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={id("relief-mx")} maskUnits="userSpaceOnUse" x={r.x} y={r.y} width={r.width} height={r.height}>
          <rect x={r.x} y={r.y} width={r.width} height={r.height} fill={`url(#${id("relief-x")})`} />
        </mask>
        <mask id={id("relief-my")} maskUnits="userSpaceOnUse" x={r.x} y={r.y} width={r.width} height={r.height}>
          <rect x={r.x} y={r.y} width={r.width} height={r.height} fill={`url(#${id("relief-y")})`} />
        </mask>
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

        {/* India: land, relief, then the photograph through the silhouette */}
        <path className="atlas-land" d={atlas.outline} data-a-ctx />
        <g data-layer="relief" className="atlas-relief" clipPath={`url(#${id("india")})`}>
          <g mask={`url(#${id("relief-mx")})`}>
            <g mask={`url(#${id("relief-my")})`}>
              {/* The default light is always there; the other seven load once the pointer is over the map. */}
              {(lit ? RELIEF_AZIMUTHS : [RELIEF_DEFAULT]).map((az) => (
                <image key={az} data-relief-az={az} href={reliefSrc(az)} x={r.x} y={r.y} width={r.width} height={r.height} preserveAspectRatio="none" style={{ opacity: az === RELIEF_DEFAULT ? 1 : 0 }} />
              ))}
            </g>
          </g>
        </g>
        <g data-layer="india-photo" clipPath={`url(#${id("india")})`}>
          <g mask={`url(#${id("reveal")})`}>
            <image href={INDIA_TEXTURE} x={india[0]} y={india[1]} width={india[2] - india[0]} height={india[3] - india[1]} preserveAspectRatio="xMidYMid slice" />
          </g>
          {/* Through the loupe, the photograph in colour */}
          <g clipPath={`url(#${id("loupe")})`} data-loupe>
            <image href={INDIA_TEXTURE_COLOUR} x={india[0]} y={india[1]} width={india[2] - india[0]} height={india[3] - india[1]} preserveAspectRatio="xMidYMid slice" />
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
              <path className="atlas-focus-pulse" d={s.d} />
              <path className="atlas-focus-line" d={s.d} pathLength={1} data-a-focus-line />
              {onState ? (
                <path
                  className="atlas-hit"
                  d={s.d}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open the ${STATE_NAME[iso]} dossier`}
                  data-hit={iso}
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
        {/* Goa is too small to hold its name: a short leader carries it east. */}
        <path className="atlas-leader" d={`M${goa.cx + 2},${goa.cy} L${GOA_LABEL_AT[0] - 2},${GOA_LABEL_AT[1]}`} data-a-ctx />
      </g>
    </svg>
  );
}
