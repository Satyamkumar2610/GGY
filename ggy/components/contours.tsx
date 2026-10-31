/**
 * Topographic contour lines: the terrain the journey crosses, and the
 * texture the glass panels refract. Deterministic, so server and client
 * draw the same lines. Decorative; the motion layer drifts them with scroll.
 */

type Field = { cx: number; cy: number; rings: number; r0: number; step: number; seed: number };

const W = 1600;
const H = 1000;

function ringPath(f: Field, k: number) {
  const n = 72;
  const r = f.r0 + k * f.step;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const wobble =
      0.13 * Math.sin(3 * t + f.seed + k * 0.21) +
      0.07 * Math.sin(5 * t + f.seed * 1.7 - k * 0.13) +
      0.04 * Math.sin(9 * t + f.seed * 2.3 + k * 0.4);
    const rr = r * (1 + wobble);
    pts.push([f.cx + Math.cos(t) * rr * 1.25, f.cy + Math.sin(t) * rr]);
  }
  // Closed Catmull-Rom spline through the points, as cubic Béziers.
  const p = (i: number) => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)},${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = p(i - 1);
    const [x1, y1] = p(i);
    const [x2, y2] = p(i + 1);
    const [x3, y3] = p(i + 2);
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return d + "Z";
}

const VARIANTS: Record<string, Field[]> = {
  a: [
    { cx: 1280, cy: 220, rings: 11, r0: 40, step: 46, seed: 0.7 },
    { cx: 180, cy: 860, rings: 8, r0: 30, step: 52, seed: 2.1 },
  ],
  b: [
    { cx: 260, cy: 260, rings: 10, r0: 36, step: 50, seed: 1.3 },
    { cx: 1360, cy: 780, rings: 12, r0: 44, step: 44, seed: 3.4 },
  ],
  c: [{ cx: 820, cy: 520, rings: 14, r0: 50, step: 48, seed: 4.2 }],
};

export function Contours({ variant = "a", className = "" }: { variant?: keyof typeof VARIANTS; className?: string }) {
  const fields = VARIANTS[variant];
  return (
    <svg className={`contours ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g data-contours>
        {fields.map((f, fi) =>
          Array.from({ length: f.rings }, (_, k) => (
            <path key={`${fi}-${k}`} d={ringPath(f, k)} className={k % 4 === 3 ? "is-index" : undefined} />
          )),
        )}
      </g>
    </svg>
  );
}
