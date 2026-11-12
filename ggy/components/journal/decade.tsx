"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, GraduationCap, Landmark, MapPinned, TrainFront, type LucideIcon } from "lucide-react";

const FIG_ICONS: LucideIcon[] = [Flag, MapPinned, GraduationCap, Landmark];
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CONCEPT_NOTE, conceptFigures, pastEditions, previousEdition } from "@/content/ggy";
import { editionPhotos } from "@/content/ggy27";
import { atlas, ROUTE_ISO, stateByIso } from "@/lib/atlas";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head } from "./head";

const [X0, Y0, X1, Y1] = atlas.outlineBounds;

/** A railway between two stations bows gently, alternating sides, as lines laid over land do. */
function track(pts: (readonly [number, number])[]) {
  if (!pts.length) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const bow = (i % 2 ? 1 : -1) * 0.22;
    d += ` Q${(ax + dx / 2 - dy * bow).toFixed(1)},${(ay + dy / 2 + dx * bow).toFixed(1)} ${bx},${by}`;
  }
  return d;
}

/** Each edition's states, and the track joining them in the order the brochure prints the route. */
const editions = pastEditions.map((e) => {
  const names = e.route.split(" – ");
  const isos = names.map((n) => ROUTE_ISO[n]).filter(Boolean);
  const pts = isos.map((iso) => stateByIso(iso)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const ends = pts.map((s) => [s.cx, s.cy] as const);
  // A photograph of a famous place on the route, keyed "2016 Summer" where a year ran twice.
  const photo = editionPhotos[e.season && /Summer|Winter/.test(e.season) ? `${e.year} ${e.season}` : e.year];
  return { ...e, names, isos, d: track(ends), ends, photo };
});
const LAST = editions.length - 1;

/**
 * A decade on the road. The eight past routes are listed down the left as
 * tickets; the map of India stays beside them. As each year reaches the
 * reader (or is chosen) its railway is laid and a train runs it, earlier
 * routes fade back to dotted lines, and the states the Yatra has crossed
 * fill in. Historical only: the upcoming edition is never marked here.
 */
export function Decade() {
  const root = useRef<HTMLElement>(null);
  // Without scroll motion (phones, reduced motion) the finished map is shown.
  const [active, setActive] = useState(LAST);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The four figures count up once as they arrive.
      mm.add(MOTION_QUERIES.any, () => {
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          // The printed figure is kept on the element, so a second pass
          // never reads a half-counted value back as the target.
          const full = el.dataset.count ?? "";
          const to = parseInt(full, 10);
          const tail = full.replace(/^\d+/, "");
          if (!to) return;
          const n = { v: 0 };
          gsap.to(n, {
            v: to,
            duration: 1.6,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => (el.textContent = `${n.v}${tail}`),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        return () => root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => (el.textContent = el.dataset.count ?? ""));
      });
      mm.add(MOTION_QUERIES.desktop, () => {
        setActive(0);
        const rows = gsap.utils.toArray<HTMLElement>("[data-year]");
        const sts = rows.map((row, i) =>
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 58%",
            onToggle: (self) => self.isActive && setActive(i),
          }),
        );
        return () => {
          sts.forEach((s) => s.kill());
          setActive(LAST);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // The active route's track is laid, then a train runs it end to end and
  // waits at the last station before running again.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rails = el.querySelectorAll(`[data-route="${active}"]`);
    const path = el.querySelector<SVGPathElement>(`[data-route-path="${active}"]`);
    const train = el.querySelector<SVGGElement>("[data-map-train]");
    if (!path || !train) return;
    const len = path.getTotalLength();
    const tl = gsap.timeline();
    tl.fromTo(rails, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: "swing" });
    if (len > 1) {
      tl.set(train, { autoAlpha: 1 }).to(train, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
        duration: Math.max(2.2, len / 140),
        ease: "sine.inOut",
        repeat: -1,
        repeatDelay: 0.9,
      });
    } else {
      tl.set(train, { autoAlpha: 0 });
    }
    return () => {
      tl.kill();
    };
  }, [active]);

  const visited = new Set(editions.slice(0, active + 1).flatMap((e) => e.isos));
  const now = new Set(editions[active].isos);

  return (
    <section ref={root} id="archive" className="j-sec j-cream" data-nav="dark" data-j-station="archive" data-arch aria-labelledby="archive-title">
      <div className="j-wrap">
        <Head id="archive-title" title="Past editions," em="a decade on the road">
          <p>Every route and figure here belongs to a past edition, not the upcoming one. Routes are reproduced from the 2025 brochure.</p>
        </Head>

        <dl className="x-figs">
          {conceptFigures.map((f, i) => {
            const Icon = FIG_ICONS[i] ?? Flag;
            return (
              <div key={f.label} className="x-figs__card" data-row>
                <span className="x-figs__icon" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <dd>
                  <span data-count={f.value}>{f.value}</span>
                  {f.note ? <NoteRef id={f.note} /> : null}
                </dd>
                <dt>{f.label}</dt>
              </div>
            );
          })}
        </dl>
        <p className="j-meta j-figs__src">Figures from the {CONCEPT_NOTE}, ahead of the next edition.</p>

        <div className="j-decade x-decade">
          <ol className="j-years x-years">
            {editions.map((e, i) => (
              <li key={e.year + e.route} className="j-year x-year" data-year data-on={i === active ? "" : undefined} data-past={i < active ? "" : undefined}>
                <button type="button" className="x-year__btn" aria-pressed={i === active} onClick={() => setActive(i)}>
                  <span className="x-year__n">{e.year}</span>
                  <span className="x-year__body">
                    <span className="x-year__stops">
                      {e.names.map((n, k) => (
                        <span key={n} className="x-year__stop">
                          {k ? <i aria-hidden="true" /> : null}
                          {n}
                        </span>
                      ))}
                    </span>
                    {e.season ? <span className="x-year__season">{e.season}</span> : null}
                  </span>
                  <TrainFront className="x-year__icon" aria-hidden="true" strokeWidth={1.6} />
                </button>
                {e.year === "2025" ? (
                  <p className="j-meta j-year__facts">
                    {previousEdition.dates}
                    <NoteRef id="dates8" />; {previousEdition.days}
                    <NoteRef id="duration" />; {previousEdition.delegates}; {previousEdition.distance}.
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <figure className="j-map x-map">
            <div className="x-map__plate">
              <AnimatePresence initial={false}>
                {editions[active].photo ? (
                  <motion.div
                    key={editions[active].photo.src}
                    className="x-map__photo"
                    initial={{ opacity: 0, y: 14, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 1.5 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image src={editions[active].photo.src} alt={editions[active].photo.alt} fill sizes="(min-width: 64rem) 18rem, 40vw" quality={80} className="object-cover" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <p className="x-map__year" aria-hidden="true" key={editions[active].year + active}>
                {editions[active].year}
              </p>
              <svg viewBox={`${X0 - 20} ${Y0 - 20} ${X1 - X0 + 40} ${Y1 - Y0 + 40}`} role="img" aria-label={`Map of India showing the routes of past editions up to ${editions[active].year}: ${editions[active].route}.`}>
                <defs>
                  <filter id="x-map-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#cd1f36" floodOpacity="0.16" />
                  </filter>
                </defs>
                <g filter="url(#x-map-shadow)">
                  {atlas.states.map((s) => (
                    <path key={s.iso} d={s.d} className={`j-map__state${now.has(s.iso) ? " is-now" : visited.has(s.iso) ? " is-seen" : ""}`} />
                  ))}
                </g>
                <path d={atlas.outline} className="j-map__outline" />
                {editions.map((e, i) =>
                  i < active && e.d ? <path key={`old-${i}`} d={e.d} className="x-map__old" /> : null,
                )}
                {editions[active].d ? (
                  <g className="x-map__line">
                    <path d={editions[active].d} className="x-map__bed" data-route={active} />
                    <path d={editions[active].d} className="x-map__sleepers" data-route={active} />
                    <path d={editions[active].d} className="x-map__rail" data-route={active} data-route-path={active} />
                  </g>
                ) : null}
                {editions[active].ends.map((p, i) => (
                  <g key={`${active}-${i}`} className="x-map__station" transform={`translate(${p[0]} ${p[1]})`}>
                    <circle r="16" className="x-map__pulse" style={{ animationDelay: `${i * 0.35}s` }} />
                    <circle r="7.5" className="x-map__dot" />
                    <text y="-17" className="x-map__label">
                      {editions[active].names[i]}
                    </text>
                  </g>
                ))}
                <g data-map-train className="x-map__train" style={{ visibility: "hidden" }}>
                  <rect x="-24" y="-7" width="20" height="14" rx="4" className="car" />
                  <rect x="-1" y="-8" width="27" height="16" rx="6" className="engine" />
                  <rect x="20" y="-3.5" width="4" height="7" rx="2" className="lamp" />
                  <rect x="4" y="-4" width="6" height="8" rx="1.5" className="win" />
                  <rect x="-19" y="-3.5" width="5" height="7" rx="1.5" className="win" />
                  <rect x="-11" y="-3.5" width="5" height="7" rx="1.5" className="win" />
                </g>
              </svg>
              <ul className="x-map__legend" aria-hidden="true">
                <li><i className="is-now" /> Route of {editions[active].year}</li>
                <li><i className="is-seen" /> States crossed so far</li>
                <li><i className="is-old" /> Earlier routes</li>
              </ul>
            </div>
            <figcaption className="j-meta">
              Tracks join the states in the order the brochure prints each route; they are not the roads taken. Boundaries: Natural Earth, India point of view.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
