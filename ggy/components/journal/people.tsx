"use client";

import { useMemo, useRef, useState } from "react";
import { BROCHURE, CONCEPT_NOTE, met8, previousEdition, roleModels } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";

type Person = { name: string; title: string; from: "8th" | "brochure"; where: string };

const people: Person[] = [
  ...met8.map((p) => ({ name: p.name, title: p.title, from: "8th" as const, where: `${p.where}, 8th edition` })),
  ...roleModels.map((p) => ({ name: p.name, title: p.title, from: "brochure" as const, where: "2025 brochure" })),
];

const FILTERS = [
  { id: "all", label: "Everyone" },
  { id: "8th", label: "Met on the 8th edition" },
  { id: "brochure", label: "Listed for earlier editions" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

/**
 * The people delegates have met, as a roll call on the page grid: name,
 * office, and where the name comes from. The row at the reading line is
 * inked; so is any row under the pointer or keyboard focus.
 */
export function People() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterId>("all");
  const shown = useMemo(() => people.filter((p) => filter === "all" || p.from === filter), [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-person]");
        const sts = rows.map((row) =>
          ScrollTrigger.create({
            trigger: row,
            start: "top 56%",
            end: "bottom 56%",
            onToggle: (self) => row.toggleAttribute("data-on", self.isActive),
          }),
        );
        return () => sts.forEach((s) => s.kill());
      });
      // The list changed length: everything below it moved.
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="people" className="j-sec j-paper" data-nav="dark" data-j-station="people" aria-labelledby="people-title">
      <div className="j-wrap">
        <Head id="people-title" title="The people" em="delegates met">
          <p>
            {people.length} leaders, officials and reformers named so far, from the {CONCEPT_NOTE} for the 8th edition and the {BROCHURE} for earlier ones. Names and titles are reproduced as printed.
            <NoteRef id="titles" />
          </p>
        </Head>

        <div className="j-filters" role="group" aria-label="Show people">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} className="j-filter" onClick={() => setFilter(f.id)}>
              {f.label}
              <span>{people.filter((p) => f.id === "all" || p.from === f.id).length}</span>
            </button>
          ))}
        </div>

        <ul className="j-roll" aria-label="People delegates have met">
          {shown.map((p) => (
            <li key={p.name} className="j-person" data-person tabIndex={0}>
              <p className="j-person__name">{p.name}</p>
              <p className="j-person__role">{p.title}</p>
              <p className="j-person__where">{p.where}</p>
            </li>
          ))}
        </ul>

        <div className="j-inst">
          <Title as="h3" sub title="The institutions behind" em="the 2025 edition" />
          <dl className="j-inst__cols">
            <div>
              <i className="j-rule" data-rule aria-hidden="true" />
              <dt>Organised by</dt>
              <dd>Rashtram School of Public Leadership</dd>
              <dd className="j-meta">Rishihood University, Sonipat</dd>
            </div>
            <div>
              <i className="j-rule" data-rule aria-hidden="true" />
              <dt>An initiative of</dt>
              <dd>{previousEdition.initiativeOf}</dd>
              <dd className="j-meta">As printed on the 2025 brochure cover</dd>
            </div>
            <div>
              <i className="j-rule" data-rule aria-hidden="true" />
              <dt>Yatra leader, 2025</dt>
              <dd>Shri Shantanu Gupta</dd>
              <dd className="j-meta">Professor of Practice, Rashtram School of Public Leadership, Rishihood University</dd>
            </div>
          </dl>
          <p className="j-meta j-inst__src">From the {BROCHURE}. The organiser and Yatra leader of the upcoming edition are to be confirmed.</p>
        </div>
      </div>
    </section>
  );
}
