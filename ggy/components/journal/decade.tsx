"use client";

import { useEffect, useRef, useState } from "react";
import { CONCEPT_NOTE, conceptFigures, pastEditions, previousEdition } from "@/content/ggy";
import { atlas, ROUTE_ISO, stateByIso } from "@/lib/atlas";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head } from "./head";

const [X0, Y0, X1, Y1] = atlas.outlineBounds;

/** Each edition's states, and the line joining them in the order the brochure prints the route. */
const editions = pastEditions.map((e) => {
  const isos = e.route.split(" – ").map((n) => ROUTE_ISO[n]).filter(Boolean);
  const pts = isos.map((iso) => stateByIso(iso)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return { ...e, isos, d: pts.map((s, i) => `${i ? "L" : "M"}${s.cx},${s.cy}`).join(" "), ends: pts.map((s) => [s.cx, s.cy] as const) };
});
const LAST = editions.length - 1;

/**
 * A decade on the road. The eight past routes are listed down the left; the
 * map of India stays beside them. As each year reaches the reader its route
 * draws itself and stays, earlier routes fade back, and the states the Yatra
 * has crossed fill in, so by 2025 the map shows the decade. Historical only:
 * the upcoming edition is never marked here.
 */
export function Decade() {
  const root = useRef<HTMLElement>(null);
  // Without scroll motion (phones, reduced motion) the finished map is shown.
  const [active, setActive] = useState(LAST);
  const drawn = useRef(LAST);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // The four figures count up once as they arrive.
      mm.add(MOTION_QUERIES.any, () => {
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
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
        return () => gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => (el.textContent = el.dataset.count ?? ""));
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

  // A route draws itself the first time the reader reaches it going down.
  useEffect(() => {
    const prev = drawn.current;
    drawn.current = active;
    if (active <= prev || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const path = root.current?.querySelector(`[data-route="${active}"]`);
    if (path) gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "swing" });
  }, [active]);

  const visited = new Set(editions.slice(0, active + 1).flatMap((e) => e.isos));
  const now = new Set(editions[active].isos);

  return (
    <section ref={root} id="archive" className="j-sec j-cream" data-nav="dark" data-j-station="archive" aria-labelledby="archive-title">
      <div className="j-wrap">
        <Head id="archive-title" title="A decade" em="on the road">
          <p>Every route and figure here belongs to a past edition, not the upcoming one. Routes are reproduced from the 2025 brochure.</p>
        </Head>

        <dl className="j-figs">
          {conceptFigures.map((f) => (
            <div key={f.label}>
              <i className="j-rule" data-rule aria-hidden="true" />
              <dd>
                <span data-count={f.value}>{f.value}</span>
                {f.note ? <NoteRef id={f.note} /> : null}
              </dd>
              <dt>{f.label}</dt>
            </div>
          ))}
        </dl>
        <p className="j-meta j-figs__src">Figures from the {CONCEPT_NOTE}, ahead of the next edition.</p>

        <div className="j-decade">
          <ol className="j-years">
            {editions.map((e, i) => (
              <li key={e.year + e.route} className="j-year" data-year data-on={i === active ? "" : undefined} data-past={i < active ? "" : undefined}>
                <p className="j-year__n">{e.year}</p>
                <div>
                  <p className="j-year__route">{e.route}</p>
                  {e.season ? <p className="j-meta">{e.season}</p> : null}
                  {e.year === "2025" ? (
                    <p className="j-meta j-year__facts">
                      {previousEdition.dates}
                      <NoteRef id="dates8" />; {previousEdition.days}
                      <NoteRef id="duration" />; {previousEdition.delegates}; {previousEdition.distance}.
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <figure className="j-map">
            <svg viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`} role="img" aria-label={`Map of India showing the routes of past editions up to ${editions[active].year}: ${editions[active].route}.`}>
              {atlas.states.map((s) => (
                <path key={s.iso} d={s.d} className={`j-map__state${now.has(s.iso) ? " is-now" : visited.has(s.iso) ? " is-seen" : ""}`} />
              ))}
              <path d={atlas.outline} className="j-map__outline" />
              {editions.map((e, i) =>
                i <= active && e.d ? <path key={i} d={e.d} data-route={i} className={`j-map__route${i === active ? " is-now" : ""}`} /> : null,
              )}
              {editions[active].ends.map((p, i) => (
                <circle key={`${active}-${i}`} cx={p[0]} cy={p[1]} r="5.5" className="j-map__stop" />
              ))}
            </svg>
            <figcaption className="j-meta">
              Lines join the states in the order the brochure prints each route; they are not the roads taken. Boundaries: Natural Earth, India point of view.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
