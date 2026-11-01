import Link from "next/link";
import { atlas, project, unionBox, type Box } from "@/lib/atlas";
import { RELIEF } from "./atlas/atlas-map";
import relief from "@/content/relief.json";

export type PlateDot = { lon: number; lat: number; label?: string; place?: "left" | "right" | "above" | "below" };

type Props = {
  /** The region to show, in atlas units. */
  box: Box;
  /** States tinted, by ISO code. */
  tint?: Record<string, string>;
  /** States printed with a photograph inside their outline. */
  photos?: Record<string, string>;
  /** States drawn with a crimson outline that draws itself. */
  outline?: string[];
  /** States that open a page. */
  links?: Record<string, { href: string; label: string }>;
  /** Names set on the map. */
  names?: Record<string, string>;
  dots?: PlateDot[];
  showRelief?: boolean;
  /** Label read by assistive technology. Plates are otherwise decorative. */
  label?: string;
  className?: string;
};

/**
 * A still of the atlas: the same geometry the home page flies over, framed
 * for one page. The page's own hero sets the region; paths marked data-draw
 * draw themselves with the scroll.
 */
export function MapPlate({ box, tint = {}, photos = {}, outline = [], links = {}, names = {}, dots = [], showRelief = false, label, className = "" }: Props) {
  const pad = Math.max(box[2] - box[0], box[3] - box[1]) * 0.04;
  const vb: Box = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad];
  const w = vb[2] - vb[0];
  const h = vb[3] - vb[1];
  const u = w / 560; // one unit of type is about one pixel at 560px wide
  const id = `plate-${Math.round(box[0])}-${Math.round(box[1])}-${Object.keys(photos).join("")}${Object.keys(tint).length}`;
  const states = atlas.states;
  const focus = new Set([...Object.keys(tint), ...Object.keys(photos), ...outline, ...Object.keys(links)]);
  return (
    <svg viewBox={`${vb[0]} ${vb[1]} ${w} ${h}`} className={`plate ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ aspectRatio: `${w} / ${h}` }}>
      <defs>
        <clipPath id={`${id}-india`} clipPathUnits="userSpaceOnUse">
          <path d={atlas.outline} />
        </clipPath>
        {states
          .filter((s) => photos[s.iso])
          .map((s) => (
            <clipPath key={s.iso} id={`${id}-${s.iso}`} clipPathUnits="userSpaceOnUse">
              <path d={s.d} />
            </clipPath>
          ))}
      </defs>
      <g className="plate-grat">
        {atlas.graticule.map((g, i) => (
          <path key={i} d={g.d} />
        ))}
      </g>
      <path className="plate-land" d={atlas.outline} />
      {showRelief ? (
        <g clipPath={`url(#${id}-india)`} className="plate-relief">
          <image href={RELIEF} x={relief.x} y={relief.y} width={relief.width} height={relief.height} preserveAspectRatio="none" />
        </g>
      ) : null}
      <g className="plate-states">
        {states.map((s) => (
          <path key={s.iso} d={s.d} className={focus.has(s.iso) ? "is-focus" : ""} style={tint[s.iso] ? { fill: tint[s.iso] } : undefined} />
        ))}
      </g>
      {states
        .filter((s) => photos[s.iso])
        .map((s) => {
          const [x0, y0, x1, y1] = s.bounds;
          const p = (x1 - x0) * 0.04;
          return (
            <g key={s.iso} clipPath={`url(#${id}-${s.iso})`}>
              <image href={photos[s.iso]} x={x0 - p} y={y0 - p} width={x1 - x0 + p * 2} height={y1 - y0 + p * 2} preserveAspectRatio="xMidYMid slice" />
            </g>
          );
        })}
      <path className="plate-edge" d={atlas.outline} />
      {outline.map((iso) => {
        const s = states.find((x) => x.iso === iso);
        return s ? <path key={iso} className="plate-line" d={s.d} pathLength={1} data-draw /> : null;
      })}
      {Object.entries(links).map(([iso, l]) => {
        const s = states.find((x) => x.iso === iso);
        if (!s) return null;
        return (
          <Link key={iso} href={l.href} aria-label={l.label} className="plate-link">
            <path d={s.d} />
          </Link>
        );
      })}
      {Object.entries(names).map(([iso, name]) => {
        const s = states.find((x) => x.iso === iso);
        if (!s) return null;
        return (
          <text key={iso} x={s.cx} y={s.cy} textAnchor="middle" className="plate-name" style={{ fontSize: 11 * u }}>
            {name}
          </text>
        );
      })}
      {dots.map((d, i) => {
        const [x, y] = project(d.lon, d.lat);
        const place = d.place ?? "right";
        const dx = place === "left" ? -9 * u : place === "right" ? 9 * u : 0;
        const dy = place === "above" ? -9 * u : place === "below" ? 15 * u : 4 * u;
        return (
          <g key={i} transform={`translate(${x} ${y})`} className="plate-dot">
            <circle r={9 * u} className="plate-dot-ring" />
            <circle r={3.4 * u} />
            {d.label ? (
              <text x={dx} y={dy} textAnchor={place === "left" ? "end" : place === "right" ? "start" : "middle"} style={{ fontSize: 11 * u }}>
                {d.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** The box around a set of states, with a margin. */
export function boxOf(isos: string[], margin = 0.08): Box {
  const b = unionBox(isos);
  const m = Math.max(b[2] - b[0], b[3] - b[1]) * margin;
  return [b[0] - m, b[1] - m, b[2] + m, b[3] + m];
}
