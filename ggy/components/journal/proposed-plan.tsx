"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { CONCEPT_NOTE, proposedMaharashtra } from "@/content/ggy";
import { atlas, project, stateByIso } from "@/lib/atlas";

const MH = stateByIso("IN-MH")!;
const [bx0, by0, bx1, by1] = MH.bounds;
const PAD = 14;
const VIEW = `${bx0 - PAD} ${by0 - PAD} ${bx1 - bx0 + PAD * 2} ${by1 - by0 + PAD * 2}`;

const MUMBAI = atlas.points.Mumbai as [number, number];
const NASHIK = project(73.79, 20.0);
const CITIES = [
  { name: "Nashik", at: NASHIK, label: [10, -8] },
  { name: "Mumbai", at: MUMBAI, label: [10, 14] },
];
/** Which city each proposed day is spent in: the first at Nashik, the rest in Mumbai. */
const DAY_CITY = proposedMaharashtra.map((_, i) => (i === 0 ? 0 : 1));
const LINK = `M${NASHIK[0]},${NASHIK[1]} Q${NASHIK[0] + 22},${(NASHIK[1] + MUMBAI[1]) / 2} ${MUMBAI[0]},${MUMBAI[1]}`;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The plan proposed for Maharashtra, kept visibly tentative: the state in
 * outline with Nashik and Mumbai marked on a dashed link, four dated tabs,
 * and the visits of the chosen day dealt out as cards. Choosing a day lights
 * the city it is spent in.
 */
export function ProposedPlan() {
  const [day, setDay] = useState(0);
  const d = proposedMaharashtra[day];
  const city = DAY_CITY[day];

  return (
    <div className="x-plan">
      <div className="x-plan__lead">
        <h3 className="x-plan__title">Proposed for Maharashtra</h3>
        <p className="x-plan__meta">A plan for Mumbai and Nashik proposed in the {CONCEPT_NOTE}. Dates and visits are tentative and not yet confirmed.</p>
      </div>

      <div className="x-plan__grid">
        <figure className="x-plan__map">
          <span className="x-plan__stamp" aria-hidden="true">
            Tentative
          </span>
          <svg viewBox={VIEW} role="img" aria-label={`Map of Maharashtra with Nashik and Mumbai marked. The day selected is spent in ${CITIES[city].name}.`}>
            <path d={MH.d} className="x-plan__state" />
            <path d={LINK} className="x-plan__link" />
            {CITIES.map((c, i) => (
              <g key={c.name} transform={`translate(${c.at[0]} ${c.at[1]})`} className="x-plan__city" data-on={i === city ? "" : undefined}>
                <circle r="9" className="x-plan__ring" />
                <circle r="3.6" className="x-plan__dot" />
                <text x={c.label[0]} y={c.label[1]}>
                  {c.name}
                </text>
              </g>
            ))}
          </svg>
        </figure>

        <div className="x-plan__side">
          <div className="x-plan__tabs" role="tablist" aria-label="Proposed days">
            {proposedMaharashtra.map((p, i) => {
              const on = i === day;
              const [num, month] = p.date.split(" ");
              return (
                <button key={p.date} type="button" role="tab" aria-selected={on} className="x-plan__tab" onClick={() => setDay(i)}>
                  {on ? <motion.span layoutId="plan-tab" className="x-plan__tab-bg" transition={{ duration: 0.45, ease: EASE }} /> : null}
                  <span className="x-plan__tab-n">{num}</span>
                  <span className="x-plan__tab-m">{month}</span>
                </button>
              );
            })}
          </div>

          <div className="x-plan__panel" role="tabpanel" aria-live="polite">
            <p className="x-plan__where">
              <MapPin aria-hidden="true" strokeWidth={1.8} />
              Day {day + 1} · {CITIES[city].name}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={day} className="x-plan__visits" initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.07 } }, hide: {} }}>
                {d.items.map((it, i) => (
                  <motion.li key={it} variants={{ hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.45, ease: EASE }}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {it}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
