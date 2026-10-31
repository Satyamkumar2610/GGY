/**
 * Builds content/india-atlas.json, the one map every section of the page draws.
 *
 * Source: Natural Earth 1:10m (public domain, naturalearthdata.com).
 *   - ne_10m_admin_0_countries_ind.geojson: countries as seen from India's
 *     point of view; gives the national outline and the neighbours.
 *   - ne_10m_admin_1_states_provinces.geojson: state and union-territory
 *     boundaries.
 *
 * Usage (paths are arguments; the downloaded files are never imported):
 *   node scripts/build-atlas.mjs <countries_ind.geojson> <admin1.geojson> [out.json]
 *
 * One Lambert conformal conic projection for the whole page, fitted to a
 * 1000-unit-wide frame. Coordinates are simplified in projected units
 * (Douglas–Peucker), finer for the three states of the upcoming edition so
 * they hold up when the map zooms in on them.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { geoConicConformal, geoPath, geoGraticule } from "d3-geo";

const [countriesPath, admin1Path, out = "content/india-atlas.json"] = process.argv.slice(2);
if (!countriesPath || !admin1Path) {
  console.error("usage: node scripts/build-atlas.mjs <countries_ind.geojson> <admin1.geojson> [out.json]");
  process.exit(1);
}
const countries = JSON.parse(readFileSync(countriesPath, "utf8"));
const admin1 = JSON.parse(readFileSync(admin1Path, "utf8"));

const india = countries.features.find((f) => f.properties.ADM0_A3 === "IND");
const NEIGHBOURS = ["PAK", "CHN", "NPL", "BTN", "BGD", "MMR", "LKA", "AFG"];
const neighbours = countries.features.filter((f) => NEIGHBOURS.includes(f.properties.ADM0_A3));
const states = admin1.features.filter((f) => f.properties.adm0_a3 === "IND");

const W = 1000;
const H = 1120;
const projection = geoConicConformal().parallels([12, 28]).rotate([-80, 0]).fitExtent(
  [
    [30, 30],
    [W - 30, H - 30],
  ],
  india,
);

/* ---- simplification in projected space ---- */
function dp(points, tol) {
  if (points.length <= 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1e-12;
    let max = -1;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      let t = ((px - ax) * dx + (py - ay) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const ex = ax + t * dx - px;
      const ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > t2) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}
const ringArea = (r) => {
  let s = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
  return Math.abs(s / 2);
};
const fmt = (n) => (Math.round(n * 10) / 10).toString();

/** Projects a geometry and returns an SVG path string, simplified. */
function toPath(geometry, tol, minArea) {
  const polys = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.type === "MultiPolygon" ? geometry.coordinates : [];
  let d = "";
  for (const poly of polys) {
    poly.forEach((ring, ri) => {
      const pts = ring.map((p) => projection(p)).filter(Boolean);
      if (pts.length < 3) return;
      if (ringArea(pts) < (ri === 0 ? minArea : minArea * 4)) return;
      const s = dp(pts, tol);
      if (s.length < 3) return;
      d += "M" + s.map((p) => fmt(p[0]) + "," + fmt(p[1])).join("L") + "Z";
    });
  }
  return d;
}

const FOCUS = { "IN-GJ": "Gujarat", "IN-GA": "Goa", "IN-MH": "Maharashtra" };
const path = geoPath(projection);

const outStates = states
  .map((f) => {
    const iso = f.properties.iso_3166_2;
    const focus = iso in FOCUS;
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    const [cx, cy] = path.centroid(f);
    return {
      iso,
      name: f.properties.name,
      focus,
      d: toPath(f.geometry, focus ? 0.12 : 0.55, focus ? 0.02 : 0.15),
      cx: +fmt(cx),
      cy: +fmt(cy),
      bounds: [x0, y0, x1, y1].map((n) => +fmt(n)),
    };
  })
  .sort((a, b) => a.iso.localeCompare(b.iso));

const outline = toPath(india.geometry, 0.3, 0.004);

// Neighbours, clipped to a generous box around India.
const outNeighbours = neighbours.map((f) => ({ id: f.properties.ADM0_A3, name: f.properties.NAME, d: toPath(f.geometry, 0.8, 1) })).filter((n) => n.d);

// Graticule every 4°, as lines in projected space.
const grat = geoGraticule().extent([
  [60, 2],
  [104, 40],
]).step([4, 4]);
const gratLines = grat.lines().map((l) => ({
  axis: l.coordinates[0][0] === l.coordinates[1][0] ? "lon" : "lat",
  value: l.coordinates[0][0] === l.coordinates[1][0] ? l.coordinates[0][0] : l.coordinates[0][1],
  d: path(l),
}));

// Points: capitals of the three states (reference only), and the tropic.
const pt = (lon, lat) => projection([lon, lat]).map((n) => +fmt(n));
const points = {
  Gandhinagar: pt(72.6369, 23.2156),
  Panaji: pt(73.8278, 15.4909),
  Mumbai: pt(72.8777, 19.076),
  NewDelhi: pt(77.209, 28.6139),
};
const tropic = path({ type: "LineString", coordinates: Array.from({ length: 50 }, (_, i) => [60 + i, 23.4367]) });

writeFileSync(
  out,
  JSON.stringify({
    source: "Natural Earth 1:10m Cultural Vectors (public domain): admin 0 countries, India point of view; admin 1 states and provinces. Simplified.",
    projection: { type: "conicConformal", parallels: [12, 28], rotate: [-80, 0], scale: +projection.scale().toFixed(3), translate: projection.translate().map((n) => +n.toFixed(3)) },
    width: W,
    height: H,
    outline,
    outlineBounds: path.bounds(india).flat().map((n) => +fmt(n)),
    states: outStates,
    neighbours: outNeighbours,
    graticule: gratLines,
    tropic,
    points,
  }),
);
console.log("wrote", out, (readFileSync(out).length / 1024).toFixed(0) + " KB", "states", outStates.length, "outline", outline.length);
