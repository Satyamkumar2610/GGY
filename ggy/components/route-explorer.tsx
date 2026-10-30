"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import map from "@/content/west-india-map.json";
import { photos, upcoming } from "@/content/ggy";
import { Script, Value } from "./primitives";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

const ISO: Record<string, string> = { Maharashtra: "IN-MH", Goa: "IN-GA", Gujarat: "IN-GJ" };
// Shown north to south, the way the map reads. Not the order of travel.
const states = [...upcoming.states].sort((a, b) => b.capital.lat - a.capital.lat);
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The route: an interactive map of western India beside a journey explorer.
 * Choose a state on the map or in the list; its photograph, notes and capital
 * marker come forward. No line joins the states: the order of travel is not confirmed.
 */
export function RouteExplorer() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const state = states[active];
  const photo = photos[state.photos[0]];
  const activeIso = ISO[state.name];

  // Draw the coastline and state outlines as the map arrives; markers drop in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-ctx]", { opacity: 0, duration: 1.2, stagger: 0.04, ease: "power1.out" }, 0)
          .fromTo("[data-outline]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "land", stagger: 0.2 }, 0.1)
          .from("[data-fill]", { opacity: 0, duration: 1, stagger: 0.2 }, 1.1)
          .from("[data-marker]", { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(2)", stagger: 0.12 }, 1.4)
          .from("[data-graticule]", { opacity: 0, duration: 1 }, 0.4);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % states.length : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + states.length) % states.length : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div ref={root} className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
      {/* Map: bleeds off the left edge on large screens */}
      <figure className="relative lg:col-span-7 lg:-ml-[var(--gutter)]">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} className="h-auto w-full" role="img" aria-label="Map of western India. Maharashtra, Goa and Gujarat are highlighted; neighbouring states are shown for context.">
          <defs>
            <clipPath id="map-clip">
              <rect x="0" y="0" width={map.width} height={map.height} />
            </clipPath>
            <pattern id="sea" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#d7d4cc" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={map.width} height={map.height} fill="url(#sea)" opacity="0.55" />
          <g clipPath="url(#map-clip)">
            {/* Latitude lines */}
            <g data-graticule>
              {map.lats.map((l) => (
                <g key={l.lat}>
                  <line x1="0" x2={map.width} y1={l.y} y2={l.y} stroke="#c9c5bc" strokeWidth="0.8" strokeDasharray="2 6" />
                  <text x="14" y={l.y - 6} fontSize="15" fill="#6b635b" className="font-sans">
                    {l.lat}° N
                  </text>
                </g>
              ))}
              <line x1="0" x2={map.width} y1={map.tropic} y2={map.tropic} stroke="#8e2531" strokeWidth="1" strokeDasharray="10 6" opacity="0.6" />
              <text x={map.width - 14} y={map.tropic - 8} fontSize="15" fill="#8e2531" textAnchor="end" className="font-sans">
                Tropic of Cancer
              </text>
            </g>
            {/* Neighbouring states */}
            {map.states
              .filter((s) => !s.focus)
              .map((s) => (
                <path key={s.iso} data-ctx d={s.d} fill="#ecebe6" stroke="#cfcbc2" strokeWidth="1" />
              ))}
            {/* The three states */}
            {map.states
              .filter((s) => s.focus)
              .map((s) => {
                const i = states.findIndex((st) => ISO[st.name] === s.iso);
                const on = s.iso === activeIso;
                const hov = hover === s.iso;
                return (
                  <g key={s.iso} className="cursor-pointer" onClick={() => setActive(i)} onMouseEnter={() => setHover(s.iso)} onMouseLeave={() => setHover(null)}>
                    <path data-fill d={s.d} fill={on ? "#8e2531" : hov ? "#e6c9cc" : "#f7f6f3"} style={{ transition: "fill 500ms cubic-bezier(.22,1,.36,1)" }} />
                    <path data-outline d={s.d} pathLength={1} strokeDasharray="1" fill="none" stroke="#8e2531" strokeWidth={on ? 2 : 1.4} />
                  </g>
                );
              })}
            {/* Labels and capitals */}
            {map.states
              .filter((s) => s.focus)
              .map((s) => {
                const on = s.iso === activeIso;
                const st = states.find((x) => ISO[x.name] === s.iso);
                return (
                  <g key={`l-${s.iso}`} pointerEvents="none">
                    {s.capital ? (
                      <g data-marker transform={`translate(${s.capital.x} ${s.capital.y})`}>
                        {on ? <circle r="16" fill="none" stroke={on ? "#f7f6f3" : "#8e2531"} strokeWidth="1" className="map-pulse" /> : null}
                        <circle r="5" fill={on ? "#f7f6f3" : "#141210"} />
                        <text x="12" y="5" fontSize="15" fill={on ? "#f7f6f3" : "#4a433d"} className="font-sans">
                          {s.capital.name}
                        </text>
                      </g>
                    ) : null}
                    <text x={s.iso === "IN-GA" ? s.cx + 34 : s.cx} y={s.iso === "IN-GA" ? s.cy + 6 : s.cy + 40} fontSize={s.iso === "IN-GA" ? 26 : 38} textAnchor={s.iso === "IN-GA" ? "start" : "middle"} fill={on ? "#f7f6f3" : "#141210"} className="font-display" style={{ fontVariationSettings: '"wdth" 112', fontWeight: 300, transition: "fill 400ms" }}>
                      {st?.name}
                    </text>
                  </g>
                );
              })}
            <text x="70" y={map.height * 0.78} fontSize="18" fill="#6b635b" letterSpacing="6" className="font-sans" data-ctx>
              ARABIAN SEA
            </text>
          </g>
        </svg>
        <figcaption className="caption mt-3 lg:pl-[var(--gutter)]">
          State boundaries from Natural Earth (public domain), simplified. Capitals are marked for reference only; they are not confirmed stops.
        </figcaption>
      </figure>

      {/* Explorer */}
      <div className="lg:col-span-5 lg:pt-6">
        <div role="tablist" aria-label="States on the upcoming route" aria-orientation="vertical" className="flex flex-col">
          {states.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`route-tab-${i}`}
                aria-selected={on}
                aria-controls="route-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                onMouseEnter={() => setHover(ISO[s.name])}
                onMouseLeave={() => setHover(null)}
                className="group relative flex items-baseline justify-between gap-4 py-3 text-left"
              >
                <span className={`font-display text-[clamp(2.2rem,1.4rem+2.4vw,3.8rem)] leading-none transition-colors duration-500 ${on ? "text-ink" : "text-ink/30 group-hover:text-ink/60"}`}>{s.name}</span>
                <Script lang={s.lang} className={`text-[1.3rem] transition-colors duration-500 ${on ? "text-crimson" : "text-ink/25"}`}>
                  {s.native}
                </Script>
                {on ? <motion.span layoutId="route-tab-line" aria-hidden="true" className="absolute -left-5 top-1/2 hidden h-px w-3 bg-crimson lg:block" transition={{ duration: 0.5, ease }} /> : null}
              </button>
            );
          })}
        </div>

        <div id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${active}`} className="mt-8">
          <div className="relative aspect-[3/2] overflow-hidden bg-sand">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={photo.src}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.9, ease }}
              >
                <motion.div className="absolute inset-0" initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
                  <Image src={photo.src} alt={photo.alt} fill quality={82} sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={state.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
              <dl className="mt-6 grid grid-cols-3 gap-4 text-[0.9rem]">
                <div>
                  <dt className="text-muted">Capital, for reference</dt>
                  <dd className="mt-1">
                    {state.capital.name}, {state.capital.lat.toFixed(1)}° N
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Earlier editions here</dt>
                  <dd className="mt-1">{state.visitedIn.join(" and ")}</dd>
                </div>
                <div>
                  <dt className="text-muted">Stops</dt>
                  <dd className="mt-1">
                    <Value value={null} />
                  </dd>
                </div>
              </dl>
              <p className="caption mt-4">
                {photo.caption}. {photo.credit} {photo.license?.name}.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
