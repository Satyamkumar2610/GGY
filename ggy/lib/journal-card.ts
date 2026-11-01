import { atlas, unionBox } from "./atlas";
import type { FocusIso } from "./atlas";
import type { Journal } from "./journal";

export const CARD_W = 1080;
export const CARD_H = 1350;

const INK = "#191817";
const PAPER = "#f4f0e8";
const SAND = "#e9e2d5";
const CRIMSON = "#871b38";
const MUTED = "#6a625a";
const HAIR = "#d6cdbe";

const STATES: { iso: FocusIso; name: string; native: string; lang: "deva" | "guj"; ring: string }[] = [
  { iso: "IN-GJ", name: "Gujarat", native: "ગુજરાત", lang: "guj", ring: "GUJARAT ✦ GANDHINAGAR ✦ 23.22° N 72.64° E ✦ " },
  { iso: "IN-GA", name: "Goa", native: "गोंय", lang: "deva", ring: "GOA ✦ PANAJI ✦ 15.49° N 73.83° E ✦ " },
  { iso: "IN-MH", name: "Maharashtra", native: "महाराष्ट्र", lang: "deva", ring: "MAHARASHTRA ✦ MUMBAI ✦ 19.08° N 72.88° E ✦ " },
];

const family = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
};

type Fonts = { serif: string; sans: string; deva: string; guj: string };
const fonts = (): Fonts => ({
  serif: family("--font-gambetta", "Georgia, serif"),
  sans: family("--font-switzer", "system-ui, sans-serif"),
  deva: family("--font-anek-devanagari", "sans-serif"),
  guj: family("--font-anek-gujarati", "sans-serif"),
});

/** Makes sure the faces the card uses are loaded before it is drawn. */
export async function loadCardFonts() {
  const f = fonts();
  await Promise.all([
    document.fonts.load(`300 64px ${f.serif}`),
    document.fonts.load(`italic 300 40px ${f.serif}`),
    document.fonts.load(`600 20px ${f.sans}`),
    document.fonts.load(`400 24px ${f.deva}`, "गोंय महाराष्ट्र"),
    document.fonts.load(`400 24px ${f.guj}`, "ગુજરાત"),
  ]).catch(() => undefined);
}

function tracked(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function ringText(ctx: CanvasRenderingContext2D, text: string, r: number) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0);
  const gap = (2 * Math.PI * r - total) / chars.length;
  let angle = -Math.PI / 2;
  chars.forEach((c, i) => {
    ctx.save();
    ctx.rotate(angle + widths[i] / (2 * r));
    ctx.translate(0, -r);
    ctx.textAlign = "center";
    ctx.fillText(c, 0, 0);
    ctx.restore();
    angle += (widths[i] + gap) / r;
  });
}

function postmark(ctx: CanvasRenderingContext2D, f: Fonts, s: (typeof STATES)[number], cx: number, cy: number, size: number, rot: number) {
  const r = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.strokeStyle = CRIMSON;
  ctx.fillStyle = CRIMSON;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `600 ${Math.round(size * 0.058)}px ${f.sans}`;
  tracked(ctx, 0);
  ringText(ctx, s.ring, r - 34);
  ctx.font = `400 ${Math.round(size * 0.17)}px ${s.lang === "guj" ? f.guj : f.deva}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(s.native, 0, size * 0.01);
  ctx.restore();
}

/** Draws the visitor's journal page. Only what is in the journal is drawn; nothing is invented. */
export function drawJournalCard(canvas: HTMLCanvasElement, j: Journal) {
  const f = fonts();
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = HAIR;
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, CARD_W - 72, CARD_H - 72);

  // Running head
  ctx.fillStyle = MUTED;
  ctx.font = `600 20px ${f.sans}`;
  tracked(ctx, 4);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("WESTERN INDIA FIELD JOURNAL", 84, 112);
  tracked(ctx, 0);
  // Three bars, one per state
  ctx.fillStyle = CRIMSON;
  ctx.fillRect(CARD_W - 84 - 74, 96, 74, 7);
  ctx.fillStyle = "#b66c4c";
  ctx.fillRect(CARD_W - 84 - 74, 109, 53, 7);
  ctx.fillStyle = CRIMSON;
  ctx.fillRect(CARD_W - 84 - 74, 122, 32, 7);

  // Title
  ctx.fillStyle = INK;
  ctx.font = `300 98px ${f.serif}`;
  tracked(ctx, -2);
  ctx.fillText("Good Governance", 80, 250);
  ctx.fillText("Yatra", 80, 350);
  tracked(ctx, 0);

  // The three states, in their true places
  const box = unionBox(STATES.map((s) => s.iso));
  const mapX = 80;
  const mapY = 420;
  const mapW = 920;
  const mapH = 360;
  const k = Math.min(mapW / (box[2] - box[0]), mapH / (box[3] - box[1]));
  const ox = mapX + (mapW - (box[2] - box[0]) * k) / 2 - box[0] * k;
  const oy = mapY + (mapH - (box[3] - box[1]) * k) / 2 - box[1] * k;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(k, k);
  for (const s of STATES) {
    const st = atlas.states.find((x) => x.iso === s.iso);
    if (!st) continue;
    const path = new Path2D(st.d);
    const on = j.stamped.includes(s.iso);
    ctx.fillStyle = on ? "rgba(135,27,56,0.88)" : SAND;
    ctx.fill(path);
    ctx.lineWidth = 1.4 / k;
    ctx.strokeStyle = on ? CRIMSON : "#8c8378";
    ctx.stroke(path);
  }
  ctx.restore();

  // Stamps
  const size = 270;
  const y = 940;
  STATES.forEach((s, i) => {
    const cx = 80 + size / 2 + i * ((920 - size) / 2);
    if (j.stamped.includes(s.iso)) {
      postmark(ctx, f, s, cx, y, size, [-0.12, 0.08, -0.05][i]);
    } else {
      ctx.save();
      ctx.strokeStyle = "#8c8378";
      ctx.setLineDash([8, 10]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, y, size / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = MUTED;
      ctx.font = `italic 300 30px ${f.serif}`;
      ctx.textAlign = "center";
      ctx.fillText(s.name, cx, y + 8);
      ctx.restore();
    }
  });

  // The question, if there is one
  let ty = 1150;
  if (j.question.trim()) {
    ctx.fillStyle = MUTED;
    ctx.font = `600 18px ${f.sans}`;
    tracked(ctx, 3.5);
    ctx.textAlign = "left";
    ctx.fillText("A QUESTION FOR THE FIELD", 80, ty);
    tracked(ctx, 0);
    ctx.fillStyle = INK;
    ctx.font = `italic 300 38px ${f.serif}`;
    const lines = wrap(ctx, `“${j.question.trim()}”`, 920).slice(0, 3);
    lines.forEach((ln, i) => ctx.fillText(ln, 80, ty + 52 + i * 48));
    ty += 52 + lines.length * 48;
  }
  if (j.name.trim()) {
    ctx.fillStyle = MUTED;
    ctx.font = `400 24px ${f.sans}`;
    ctx.textAlign = "left";
    ctx.fillText(`Kept by ${j.name.trim()}`, 80, Math.min(ty + 40, 1236));
  }

  // Footer
  ctx.fillStyle = MUTED;
  ctx.font = `400 21px ${f.sans}`;
  ctx.textAlign = "left";
  ctx.fillText("Upcoming edition: Maharashtra, Goa and Gujarat. Dates to be announced. Not an application.", 80, 1272);
}

export function cardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
