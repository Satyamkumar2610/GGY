import { atlas, atLeast, fit, INDIA_BOX, invert, lerpCamera, project, unionBox, type Box, type Camera, type FocusIso } from "@/lib/atlas";

/**
 * The camera over the atlas, driven by the reading position.
 *
 * Each block of the text flow carries `data-stage`. When a block is centred
 * in the window its stage is fully reached; between two blocks the camera
 * travels, holding still at either end so the reader has time to read. This
 * is a pure function of scroll position, smoothed on GSAP's ticker, so it
 * never hijacks scrolling and always lands where the page is.
 */

export type StageId = "india" | "west" | FocusIso | "all";
export const STAGES: StageId[] = ["india", "west", "IN-GJ", "IN-GA", "IN-MH", "all"];

const WEST: Box = (() => {
  const b = unionBox(["IN-GJ", "IN-MH", "IN-GA"]);
  const m = (b[2] - b[0]) * 0.06;
  return [b[0] - m, b[1] - m, b[2] + m, b[3] + m];
})();

function boxFor(stage: StageId): Box {
  switch (stage) {
    case "india":
      return INDIA_BOX;
    case "west":
    case "all":
      return WEST;
    case "IN-GA":
      return atLeast(unionBox(["IN-GA"]), 96);
    default: {
      const b = unionBox([stage]);
      const m = (b[2] - b[0]) * 0.05;
      return [b[0] - m, b[1] - m, b[2] + m, b[3] + m];
    }
  }
}

export type Layout = { w: number; h: number; header: number; wide: boolean };

/** Where on screen the map should sit for a stage. */
export function frameFor(stage: StageId, l: Layout): Box {
  if (l.wide) {
    if (stage === "india") return [l.w * 0.4, l.header + 6, l.w * 0.985, l.h - 6];
    return [l.w * 0.47, l.header + 48, l.w * 0.955, l.h - 64];
  }
  if (stage === "india") return [14, l.header + 8, l.w - 14, Math.min(l.h * 0.5, l.h - 400)];
  return [18, l.header + 12, l.w - 18, l.h * 0.5];
}

export function cameraFor(stage: StageId, l: Layout): Camera {
  return fit(boxFor(stage), frameFor(stage, l), { x: stage === "india" && l.wide ? 0.62 : 0.5 });
}

/* ---- What each stage shows, interpolated between stages ---- */

type Look = { india: number; GJ: number; GA: number; MH: number };
const LOOKS: Record<StageId, Look> = {
  india: { india: 1, GJ: 1, GA: 1, MH: 1 },
  west: { india: 0, GJ: 0.92, GA: 0.92, MH: 0.92 },
  "IN-GJ": { india: 0, GJ: 1, GA: 0, MH: 0 },
  "IN-GA": { india: 0, GJ: 0, GA: 1, MH: 0 },
  "IN-MH": { india: 0, GJ: 0, GA: 0, MH: 1 },
  all: { india: 0, GJ: 1, GA: 1, MH: 1 },
};

export function lookAt(s: number): Look {
  const i = Math.max(0, Math.min(STAGES.length - 1, Math.floor(s)));
  const j = Math.min(STAGES.length - 1, i + 1);
  const t = s - i;
  const a = LOOKS[STAGES[i]];
  const b = LOOKS[STAGES[j]];
  return { india: a.india + (b.india - a.india) * t, GJ: a.GJ + (b.GJ - a.GJ) * t, GA: a.GA + (b.GA - a.GA) * t, MH: a.MH + (b.MH - a.MH) * t };
}

/* ---- Map labels, positioned in HTML over the SVG ---- */

export type Label = {
  id: string;
  x: number;
  y: number;
  kind: "state" | "capital" | "sea" | "context" | "line";
  text: string;
  native?: { text: string; lang: string };
  sub?: string;
  /** Stages at which the label is fully shown. */
  on: number[];
  align?: "left" | "right" | "center";
};

const c = (iso: string) => {
  const s = atlas.states.find((x) => x.iso === iso)!;
  return [s.cx, s.cy] as const;
};
const P = atlas.points;

export const LABELS: Label[] = [
  { id: "l-gj", x: c("IN-GJ")[0] + 14, y: c("IN-GJ")[1] - 10, kind: "state", text: "Gujarat", native: { text: "ગુજરાત", lang: "gu" }, on: [0, 1, 5], align: "center" },
  { id: "l-mh", x: c("IN-MH")[0] + 6, y: c("IN-MH")[1] + 4, kind: "state", text: "Maharashtra", native: { text: "महाराष्ट्र", lang: "mr" }, on: [0, 1, 5], align: "center" },
  { id: "l-ga", x: c("IN-GA")[0] + 5, y: c("IN-GA")[1], kind: "state", text: "Goa", native: { text: "गोंय", lang: "kok" }, on: [0, 1, 3, 5], align: "left" },
  { id: "c-gn", x: P.Gandhinagar[0], y: P.Gandhinagar[1], kind: "capital", text: "Gandhinagar", sub: "23.22° N  72.64° E", on: [2], align: "left" },
  { id: "c-pj", x: P.Panaji[0], y: P.Panaji[1], kind: "capital", text: "Panaji", sub: "15.49° N  73.83° E", on: [3], align: "right" },
  { id: "c-mb", x: P.Mumbai[0], y: P.Mumbai[1], kind: "capital", text: "Mumbai", sub: "19.08° N  72.88° E", on: [4], align: "right" },
  { id: "s-as", x: project(69.6, 11.2)[0], y: project(69.6, 11.2)[1], kind: "sea", text: "Arabian Sea", on: [0, 1, 2, 3, 4, 5], align: "center" },
  { id: "s-bb", x: project(88.2, 15.4)[0], y: project(88.2, 15.4)[1], kind: "sea", text: "Bay of Bengal", on: [0], align: "center" },
  { id: "x-rj", x: c("IN-RJ")[0], y: c("IN-RJ")[1], kind: "context", text: "Rajasthan", on: [1, 2, 5] },
  { id: "x-mp", x: c("IN-MP")[0], y: c("IN-MP")[1], kind: "context", text: "Madhya Pradesh", on: [1, 2, 4, 5] },
  { id: "x-ka", x: c("IN-KA")[0] + 4, y: c("IN-KA")[1] - 30, kind: "context", text: "Karnataka", on: [1, 3, 4, 5] },
  { id: "x-tg", x: c("IN-TG")[0], y: c("IN-TG")[1], kind: "context", text: "Telangana", on: [1, 4, 5] },
  { id: "x-dh", x: project(72.75, 20.6)[0], y: project(72.75, 20.6)[1], kind: "context", text: "Daman", on: [2, 4] },
  { id: "t-tc", x: project(93.9, 23.44)[0], y: project(93.9, 23.44)[1], kind: "line", text: "Tropic of Cancer", on: [0], align: "left" },
  { id: "t-tc2", x: project(68.1, 23.44)[0], y: project(68.1, 23.44)[1], kind: "line", text: "Tropic of Cancer", on: [1, 2, 5], align: "right" },
];

export function labelOpacity(l: Label, s: number) {
  let o = 0;
  for (const st of l.on) o = Math.max(o, 1 - Math.abs(s - st) * 1.6);
  return Math.max(0, Math.min(1, o));
}

/* ---- Readouts ---- */

export function centreCoords(cam: Camera, frame: Box) {
  const cx = (frame[0] + frame[2]) / 2;
  const cy = (frame[1] + frame[3]) / 2;
  return invert((cx - cam.x) / cam.k, (cy - cam.y) / cam.k);
}

const KM_PER_UNIT = 6371 / atlas.projection.scale;
const NICE = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
/** A scale bar about 90px long, in round kilometres. Approximate: the projection is conformal, not equal-distance. */
export function scaleBar(k: number) {
  const pxPerKm = k / KM_PER_UNIT;
  let km = NICE[0];
  for (const n of NICE) if (n * pxPerKm <= 120) km = n;
  return { km, px: km * pxPerKm };
}

export { lerpCamera };

export const smooth = (t: number) => t * t * (3 - 2 * t);
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
