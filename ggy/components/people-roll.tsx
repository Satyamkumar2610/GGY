"use client";

import { useMemo, useRef, useState } from "react";
import { met8, roleModels } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { atlas, project } from "@/lib/atlas";

/* Where 8th-edition delegates met each person, as printed in the concept note. Reference coordinates of the cities. */
const CITY: Record<string, [number, number]> = {
  Delhi: [77.21, 28.61],
  Lucknow: [80.95, 26.85],
  Prayagraj: [81.85, 25.44],
  Ayodhya: [82.2, 26.8],
  Deoria: [83.78, 26.5],
};
const PREVIEW = 6;

type Person = { name: string; title: string; from: "8th" | "brochure"; where?: string };

const people: Person[] = [
  ...met8.map((p) => ({ name: p.name, title: p.title, from: "8th" as const, where: p.where })),
  ...roleModels.map((p) => ({ name: p.name, title: p.title, from: "brochure" as const })),
];

const FILTERS = [
  { id: "all", label: "Everyone" },
  { id: "8th", label: "8th edition" },
  { id: "brochure", label: "Earlier editions" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

/** A small map of India locating where delegates met the person, when the source records it. */
function Locator({ where }: { where?: string }) {
  const at = where && CITY[where] ? project(...CITY[where]) : null;
  const [x0, y0, x1, y1] = atlas.outlineBounds;
  return (
    <svg viewBox={`${x0 - 10} ${y0 - 10} ${x1 - x0 + 20} ${y1 - y0 + 20}`} className="roll-locator" aria-hidden="true">
      <path d={atlas.outline} className="roll-locator-land" />
      {at ? (
        <g transform={`translate(${at[0]} ${at[1]})`}>
          <circle r="34" className="roll-locator-ring" />
          <circle r="11" className="roll-locator-dot" />
        </g>
      ) : null}
    </svg>
  );
}
const pad = (n: number) => String(n).padStart(2, "0");
const origin = (p: Person) => (p.from === "8th" ? `Met on the 8th edition${p.where ? `, ${p.where}` : ""}` : "Listed in the 2025 brochure");

/**
 * The roll of people delegates have met: a filterable list in large type and,
 * on wide screens, a sticky spotlight that follows the reader. The person in
 * the spotlight is whichever row is crossing the reading line, or the one
 * under the pointer or keyboard focus.
 */
export function PeopleRoll() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [active, setActive] = useState(0);
  const [all, setAll] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const matching = useMemo(() => people.filter((p) => filter === "all" || p.from === filter), [filter]);
  const shown = all ? matching : matching.slice(0, PREVIEW);
  const current = shown[Math.min(active, shown.length - 1)];

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-roll-row]", list);
        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        // Rows lean in from alternate sides as they arrive, scrubbed.
        rows.forEach((row, i) => {
          gsap.fromTo(
            row.querySelector("[data-roll-name]"),
            { x: i % 2 ? 48 : -48 },
            { x: 0, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "top 60%", scrub: 0.6 } },
          );
        });
      });
      // The list changed length: everything below it moved.
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { dependencies: [filter, all], revertOnUpdate: true },
  );

  return (
    <div className="roll">
      <div className="roll-filters" role="group" aria-label="Show people">
        {FILTERS.map((f) => {
          const count = people.filter((p) => f.id === "all" || p.from === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className="roll-filter"
              onClick={() => {
                setFilter(f.id);
                setActive(0);
                setAll(false);
              }}
            >
              {f.label}
              <span className="roll-filter-count num">{pad(count)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-[var(--gap)] lg:grid-cols-12">
        {/* The spotlight, wide screens only; the list carries every fact. */}
        <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
          <div className="roll-spot" key={current?.name}>
            <div className="roll-spot-head">
              <span className="caption">{current ? origin(current) : ""}</span>
              <span className="num text-[0.95rem] text-muted">
                {pad(Math.min(active, shown.length - 1) + 1)} / {pad(matching.length)}
              </span>
            </div>
            <div>
              <p className="roll-spot-name">{current?.name}</p>
              <p className="roll-spot-title">{current?.title}</p>
            </div>
            <div className="roll-spot-foot">
              <Locator where={current?.where} />
              <p className="caption max-w-[12rem]">{current?.where ? `${current.where}, where delegates of the 8th edition met them.` : "The brochure does not record where delegates met them."}</p>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="roll-list lg:col-span-7" aria-label="People delegates have met">
          {shown.map((p, i) => (
            <li
              key={p.name}
              className="roll-row"
              data-roll-row
              data-active={i === active ? "" : undefined}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
            >
              <span aria-hidden="true" className="roll-index num">
                {pad(i + 1)}
              </span>
              <span className="roll-text">
                <span className="roll-name" data-roll-name>
                  {p.name}
                </span>
                <span className="roll-title">
                  {p.title}
                  <span className="roll-origin"> · {origin(p)}</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      {matching.length > PREVIEW ? (
        <div className="mt-8 lg:ml-[calc(5/12*100%+var(--gap))]">
          <button type="button" className="atlas-chip" aria-expanded={all} onClick={() => setAll((v) => !v)}>
            {all ? `Show the first ${PREVIEW}` : `Show all ${matching.length}`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
