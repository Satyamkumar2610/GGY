"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CONCEPT_NOTE, conceptFigures, pastEditions, previousEdition } from "@/content/ggy";
import { atlas, fit, INDIA_BOX, ROUTE_ISO, unionBox, type Box } from "@/lib/atlas";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { ContactSheet } from "../contact-sheet";
import { DayStrip } from "./day-strip";

const W = 1000;
const H = 1120;

const editionLabel = (e: (typeof pastEditions)[number]) => (e.season && e.season !== "8th edition" ? `${e.year} ${e.season.toLowerCase()}` : e.year);

/**
 * Section 06: the archive. Choosing an edition redraws the same map of India
 * used at the top of the page: that edition's states take the terracotta, the
 * camera moves to frame them, and a line joins them in the order the
 * brochure prints the route. Historical only: the upcoming edition is never
 * marked here.
 */
export function ArchiveAtlas() {
  const [active, setActive] = useState(pastEditions.length - 1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const edition = pastEditions[active];

  const stops = useMemo(() => edition.route.split(" – ").map((n) => ({ name: n, iso: ROUTE_ISO[n] })), [edition]);
  const isos = stops.map((s) => s.iso).filter(Boolean);

  // Frame the edition's states, never closer than a third of India.
  const camera = useMemo(() => {
    const b = unionBox(isos);
    const cx = (b[0] + b[2]) / 2;
    const cy = (b[1] + b[3]) / 2;
    const half = Math.max(b[2] - b[0], b[3] - b[1], 330) / 2 + 60;
    const box: Box = [cx - half, cy - half, cx + half, cy + half];
    const k = Math.min(1.9, fit(box, [0, 0, W, H]).k);
    const full = fit(INDIA_BOX, [0, 0, W, H]);
    const kk = Math.max(full.k, k);
    return { k: kk, x: W / 2 - cx * kk, y: H / 2 - cy * kk };
  }, [isos]);

  // The camera is the SVG's viewBox, eased by GSAP between editions. The
  // first value is rendered on the server; later ones are animated in place.
  const viewBox = `${(-camera.x / camera.k).toFixed(1)} ${(-camera.y / camera.k).toFixed(1)} ${(W / camera.k).toFixed(1)} ${(H / camera.k).toFixed(1)}`;
  const firstViewBox = useRef(viewBox);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(svg, { attr: { viewBox }, duration: reduce ? 0 : 1.3, ease: "swing", overwrite: true });
  }, [viewBox]);

  const centroids = stops
    .map((s) => atlas.states.find((x) => x.iso === s.iso))
    .filter((s): s is (typeof atlas.states)[number] => Boolean(s))
    .map((s) => [s.cx, s.cy] as const);
  const routeD = centroids.length > 1 ? centroids.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ") : "";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        gsap.from("[data-arch-fig]", { opacity: 0, y: 24, duration: 1, stagger: 0.08, ease: "land", scrollTrigger: { trigger: "[data-arch-figs]", start: "top 80%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Redraw the route line on every change.
  useEffect(() => {
    const p = routeRef.current;
    if (!p || !routeD) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: "swing", delay: 0.35 });
  }, [routeD]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = pastEditions.length;
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const is2025 = edition.year === "2025";

  return (
    <section ref={root} id="archive" aria-labelledby="archive-title" className="archive-atlas">
      <div className="page">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-8">
            <p className="kicker">
              <span className="num">06</span> The GGY archive
            </p>
            <h2 id="archive-title" className="d-xl mt-6" data-drift>
              A decade on the road
            </h2>
          </div>
          <p className="max-w-[22rem] text-ink-soft lg:col-span-4 lg:self-end">
            Every route and figure in this chapter belongs to a past edition, not the upcoming one. Routes are reproduced from the 2025 brochure.
          </p>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)]">
          <p className="caption">Figures from the {CONCEPT_NOTE}, ahead of the next edition</p>
          <dl className="archive-figs mt-5" data-arch-figs>
            {conceptFigures.map((f) => (
              <div key={f.label} data-arch-fig>
                <dd className="num archive-fig-num">
                  {f.value}
                  {f.note ? <NoteRef id={f.note} /> : null}
                </dd>
                <dt className="caption mt-2">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="archive-grid mt-[clamp(4rem,8vw,6rem)]">
          {/* Edition selector */}
          <div className="archive-select">
            <p className="caption mb-3">Choose an edition</p>
            <div role="tablist" aria-label="Past editions" aria-orientation="vertical" className="archive-tabs">
              {pastEditions.map((e, i) => (
                <button
                  key={e.year + e.route}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`arch-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="arch-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(ev) => onKey(ev, i)}
                  className="archive-tab"
                >
                  <span className="num archive-tab-year">{e.year}</span>
                  <span className="archive-tab-route">
                    {e.season && e.season !== "8th edition" ? `${e.season}. ` : ""}
                    {e.route}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* The map */}
          <figure className="archive-map">
            <svg ref={svgRef} viewBox={firstViewBox.current} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Map of India with the states of the ${editionLabel(edition)} route highlighted: ${edition.route}.`}>
              <g>
                <g className="atlas-grat">
                  {atlas.graticule.map((g, i) => (
                    <path key={i} d={g.d} />
                  ))}
                </g>
                <path className="archive-land" d={atlas.outline} />
                {atlas.states.map((s) => (
                  <path key={s.iso} d={s.d} className={`archive-state ${isos.includes(s.iso) ? "is-on" : ""}`} />
                ))}
                <path className="archive-outline" d={atlas.outline} />
                {routeD ? <path ref={routeRef} key={routeD} className="archive-route" d={routeD} /> : null}
                {centroids.map((p, i) => (
                  <g key={`${edition.year}-${i}`} transform={`translate(${p[0]} ${p[1]})`} className="archive-stop">
                    <circle r={9 / camera.k} />
                    <text y={3.6 / camera.k} fontSize={10 / camera.k} textAnchor="middle">
                      {i + 1}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
            <figcaption className="caption mt-3">
              Lines join the states in the order the brochure prints each route; they are not the roads taken. Boundaries: Natural Earth, India point of view.
            </figcaption>
          </figure>

          {/* The edition */}
          <div id="arch-panel" role="tabpanel" aria-labelledby={`arch-tab-${active}`} className="archive-panel" key={active}>
            <p className="archive-panel-year num">{edition.year}</p>
            {edition.season ? <p className="kicker mt-2">{edition.season}</p> : null}
            <ol className="mt-6 space-y-2">
              {stops.map((s, i) => (
                <li key={s.name + i} className="flex items-baseline gap-3">
                  <span className="num w-6 text-[0.95rem] text-saffron-ink">{i + 1}</span>
                  <span className="font-display text-[1.5rem] leading-tight">{s.name}</span>
                </li>
              ))}
            </ol>
            {is2025 ? (
              <dl className="atlas-facts mt-8">
                <div>
                  <dt>Dates</dt>
                  <dd>
                    {previousEdition.dates}
                    <NoteRef id="dates8" />
                  </dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>
                    {previousEdition.days}
                    <NoteRef id="duration" />
                  </dd>
                </div>
                <div>
                  <dt>Delegates</dt>
                  <dd>{previousEdition.delegates}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{previousEdition.distance}</dd>
                </div>
              </dl>
            ) : (
              <p className="caption mt-8 max-w-[20rem]">The brochure records the route of this edition. Its dates, stops and delegates are not recorded in the sources used for this page.</p>
            )}
            {is2025 ? (
              <a href="#itinerary" className="tlink tlink-static mt-7 text-[0.9rem]">
                Read the 2025 itinerary, day by day
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-[clamp(5rem,10vw,8rem)]">
          <DayStrip />
        </div>

        <div className="mt-[clamp(5rem,10vw,8rem)]">
          <ContactSheet />
        </div>
      </div>
    </section>
  );
}
