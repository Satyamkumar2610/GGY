import { geoConicConformal } from "d3-geo";
import atlas from "@/content/india-atlas.json";

/**
 * The page's one map. Every section that draws India draws these paths, in
 * the same projected coordinates (see scripts/build-atlas.mjs), and moves a
 * camera over them rather than swapping images. That is what lets the hero's
 * India become the western states, then the archive.
 */
export { atlas };

export type AtlasState = (typeof atlas.states)[number];
export type Box = [number, number, number, number];
/** Screen = atlas * k + (x, y). */
export type Camera = { k: number; x: number; y: number };

export const FOCUS_ISO = ["IN-GJ", "IN-GA", "IN-MH"] as const;
export type FocusIso = (typeof FOCUS_ISO)[number];

const byIso = new Map(atlas.states.map((s) => [s.iso, s]));
export const stateByIso = (iso: string) => byIso.get(iso);

export function unionBox(isos: readonly string[]): Box {
  let b: Box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const iso of isos) {
    const s = byIso.get(iso);
    if (!s) continue;
    const [x0, y0, x1, y1] = s.bounds;
    b = [Math.min(b[0], x0), Math.min(b[1], y0), Math.max(b[2], x1), Math.max(b[3], y1)];
  }
  return b;
}

/** The national outline, including the parts of Jammu and Kashmir and Ladakh outside any state polygon. */
export const INDIA_BOX = atlas.outlineBounds as Box;

/** Grows a box about its centre so that neither side is under `min` units. */
export function atLeast(b: Box, min: number): Box {
  const cx = (b[0] + b[2]) / 2;
  const cy = (b[1] + b[3]) / 2;
  const w = Math.max(b[2] - b[0], min) / 2;
  const h = Math.max(b[3] - b[1], min) / 2;
  return [cx - w, cy - h, cx + w, cy + h];
}

/** The camera that fits box `b` (atlas units) inside screen frame `f` (px). */
export function fit(b: Box, f: Box, align: { x?: number; y?: number } = {}): Camera {
  const bw = b[2] - b[0];
  const bh = b[3] - b[1];
  const fw = f[2] - f[0];
  const fh = f[3] - f[1];
  const k = Math.min(fw / bw, fh / bh);
  const ax = align.x ?? 0.5;
  const ay = align.y ?? 0.5;
  return { k, x: f[0] + (fw - bw * k) * ax - b[0] * k, y: f[1] + (fh - bh * k) * ay - b[1] * k };
}

/** Interpolates two cameras about their frame centres, zooming geometrically. */
export function lerpCamera(a: Camera, b: Camera, t: number, cx: number, cy: number): Camera {
  // Atlas point under the frame centre for each camera.
  const pa = { x: (cx - a.x) / a.k, y: (cy - a.y) / a.k };
  const pb = { x: (cx - b.x) / b.k, y: (cy - b.y) / b.k };
  const k = a.k * Math.pow(b.k / a.k, t);
  const px = pa.x + (pb.x - pa.x) * t;
  const py = pa.y + (pb.y - pa.y) * t;
  return { k, x: cx - px * k, y: cy - py * k };
}

const projection = geoConicConformal()
  .parallels(atlas.projection.parallels as [number, number])
  .rotate(atlas.projection.rotate as [number, number])
  .scale(atlas.projection.scale)
  .translate(atlas.projection.translate as [number, number]);

/** Atlas units to longitude and latitude. */
export function invert(x: number, y: number): [number, number] | null {
  return projection.invert ? projection.invert([x, y]) : null;
}
export function project(lon: number, lat: number): [number, number] {
  return projection([lon, lat]) ?? [0, 0];
}

export function formatCoords(lon: number, lat: number, digits = 2) {
  return `${Math.abs(lat).toFixed(digits)}° ${lat >= 0 ? "N" : "S"}  ${Math.abs(lon).toFixed(digits)}° ${lon >= 0 ? "E" : "W"}`;
}

/** Route names as printed in the brochure, mapped to ISO codes. */
export const ROUTE_ISO: Record<string, string> = {
  Gujarat: "IN-GJ",
  Rajasthan: "IN-RJ",
  Haryana: "IN-HR",
  Delhi: "IN-DL",
  Karnataka: "IN-KA",
  "Andhra Pradesh": "IN-AP",
  Telangana: "IN-TG",
  Maharashtra: "IN-MH",
  "Madhya Pradesh": "IN-MP",
  Chhattisgarh: "IN-CT",
  Jharkhand: "IN-JH",
  Odisha: "IN-OR",
  "Uttar Pradesh": "IN-UP",
  Bihar: "IN-BR",
  Goa: "IN-GA",
  Kerala: "IN-KL",
  "Tamil Nadu": "IN-TN",
  "Jammu & Kashmir": "IN-JK",
  Ladakh: "IN-LA",
};
