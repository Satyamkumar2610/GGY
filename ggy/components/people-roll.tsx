"use client";

import { useMemo, useRef, useState } from "react";
import { met8, roleModels } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";

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

const HONORIFICS = new Set(["late", "shri", "smt.", "smt", "dr", "dr.", "sh.", "ms.", "ias"]);
/** Two initials from a name, skipping honorifics. */
function initials(name: string) {
  const parts = name.split(/\s+/).filter((w) => !HONORIFICS.has(w.toLowerCase()));
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
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
  const listRef = useRef<HTMLOListElement>(null);
  const shown = useMemo(() => people.filter((p) => filter === "all" || p.from === filter), [filter]);
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
    { dependencies: [filter], revertOnUpdate: true },
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
          <div className="roll-spot on-crimson" key={current?.name}>
            <div className="roll-spot-head">
              <span className="caps">{current ? origin(current) : ""}</span>
              <span className="num">
                {pad(Math.min(active, shown.length - 1) + 1)} / {pad(shown.length)}
              </span>
            </div>
            <p className="roll-spot-mono">{current ? initials(current.name) : ""}</p>
            <div>
              <p className="roll-spot-name">{current?.name}</p>
              <p className="roll-spot-title">{current?.title}</p>
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
    </div>
  );
}
