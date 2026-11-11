"use client";

import { useRef, useState, type MouseEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { atlas, FOCUS_ISO, INDIA_BOX, stateByIso } from "@/lib/atlas";

/* The locator: India at thumbnail size, the edition's three states filled,
   and the route the page walks, Gandhinagar to Mumbai to Panaji. */
const [bx0, by0, bx1, by1] = INDIA_BOX;
const LOCATOR_BOX = `${bx0 - 8} ${by0 - 8} ${bx1 - bx0 + 16} ${by1 - by0 + 16}`;
const { Gandhinagar: G, Mumbai: M, Panaji: P } = atlas.points;
const ROUTE = `M${G[0]},${G[1]} Q${G[0] - 60},${(G[1] + M[1]) / 2} ${M[0]},${M[1]} T${P[0]},${P[1]}`;
const FOCUS = FOCUS_ISO.map((iso) => stateByIso(iso)?.d ?? "");

/** The stations of the page, in order: a section's id and the name shown beside it. */
const STATIONS: [string, string][] = [
  ["band", "Departure"],
  ["field", "The field"],
  ["act-where", "The western coast"],
  ["journey", "The route"],
  ["editions", "What is confirmed"],
  ["act-how", "The days"],
  ["learning", "How it runs"],
  ["act-proof", "The record"],
  ["archive", "A decade"],
  ["itinerary", "Nine days"],
  ["gallery", "Photographs"],
  ["people", "People"],
  ["after", "Afterwards"],
  ["act-joining", "The next edition"],
  ["questions", "Questions"],
  ["connect", "Joining"],
];
const LAST = STATIONS.length - 1;

/**
 * The chapter rail: a glass capsule in the left margin. The India locator
 * sits at its head with a dot walking the edition's route; below it, one
 * station per chapter, evenly spaced, with a fill that runs down the rail as
 * the page is read. The chapter in view is numbered and named in a chip that
 * shows when it changes and under the pointer. Each station is a link.
 * Wide screens only; it carries nothing the page does not.
 */
export function Thread() {
  const root = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem)", () => {
        const el = root.current!;
        const fill = el.querySelector<HTMLElement>("[data-fill]")!;
        const route = el.querySelector<SVGPathElement>("[data-route]");
        const dot = el.querySelector<SVGCircleElement>("[data-dot]");
        const routeLen = route?.getTotalLength() ?? 0;
        const sections = STATIONS.map(([id]) => document.querySelector<HTMLElement>(`[data-j-station="${id}"]`));
        let tops: number[] = [];
        let current = -1;

        // Where each chapter starts, measured once per refresh, not per frame.
        const place = () => {
          tops = sections.map((s, i) => (s ? s.getBoundingClientRect().top + window.scrollY : (tops[i - 1] ?? 0)));
        };
        place();
        ScrollTrigger.addEventListener("refresh", place);

        const whole = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const y = window.scrollY + window.innerHeight * 0.5;
            let i = 0;
            while (i < LAST && tops[i + 1] <= y) i++;
            const next = i < LAST ? tops[i + 1] : tops[i] + window.innerHeight;
            const frac = gsap.utils.clamp(0, 1, (y - tops[i]) / Math.max(1, next - tops[i]));
            const before = y < tops[0];
            gsap.set(fill, { scaleY: before ? 0 : (i + frac) / LAST });
            if (route && dot) {
              const pt = route.getPointAtLength(self.progress * routeLen);
              dot.setAttribute("cx", String(pt.x));
              dot.setAttribute("cy", String(pt.y));
            }
            if (i !== current) {
              current = i;
              setAt(i);
              const s = sections[i];
              el.dataset.tone = s && (s.classList.contains("on-dark") || s.closest(".on-dark")) ? "light" : "dark";
              el.setAttribute("data-flash", "");
              window.clearTimeout(Number(el.dataset.flashT));
              el.dataset.flashT = String(window.setTimeout(() => el.removeAttribute("data-flash"), 1800));
            }
            el.toggleAttribute("data-on", !before || self.progress > 0.08);
          },
        });
        return () => {
          ScrollTrigger.removeEventListener("refresh", place);
          whole.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const go = (id: string) => (e: MouseEvent) => {
    const target = document.querySelector<HTMLElement>(`[data-j-station="${id}"]`);
    if (!target) return;
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav ref={root} className="j-rail" aria-label="Chapters" data-tone="dark">
      <div className="j-rail__capsule">
        <svg className="j-rail__map" viewBox={LOCATOR_BOX} aria-hidden="true" focusable="false">
          <path className="j-locator__land" d={atlas.outline} />
          {FOCUS.map((d, i) => (
            <path key={FOCUS_ISO[i]} className="j-locator__state" d={d} />
          ))}
          <path className="j-locator__route" d={ROUTE} data-route />
          <circle className="j-locator__dot" r={64} cx={G[0]} cy={G[1]} data-dot />
        </svg>
        <p className="j-rail__count" aria-hidden="true">
          <span key={at}>{String(at + 1).padStart(2, "0")}</span>
        </p>
        <ol className="j-rail__stops">
          <i className="j-rail__line" aria-hidden="true">
            <i data-fill />
          </i>
          {STATIONS.map(([id, name], i) => (
            <li key={id} data-state={i < at ? "past" : i === at ? "now" : undefined}>
              <a href={`#${id}`} onClick={go(id)} aria-current={i === at ? "location" : undefined}>
                <i aria-hidden="true" />
                <span className="j-rail__tip">{name}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="j-rail__total" aria-hidden="true">
          {String(STATIONS.length).padStart(2, "0")}
        </p>
      </div>
      <p className="j-rail__chip" aria-hidden="true" key={`chip-${at}`}>
        <small>Chapter {String(at + 1).padStart(2, "0")}</small>
        {STATIONS[at][1]}
      </p>
    </nav>
  );
}
