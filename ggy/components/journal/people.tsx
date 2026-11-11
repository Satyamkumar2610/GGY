"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, MapPin } from "lucide-react";
import { BROCHURE, CONCEPT_NOTE, met8, previousEdition, roleModels } from "@/content/ggy";
import { ScrollTrigger } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import SpotlightCard from "../SpotlightCard";
import { Head, Title } from "./head";

type Person = { name: string; title: string; from: "8th" | "brochure"; where: string };

const people: Person[] = [
  ...met8.map((p) => ({ name: p.name, title: p.title, from: "8th" as const, where: `${p.where}, 8th edition` })),
  ...roleModels.map((p) => ({ name: p.name, title: p.title, from: "brochure" as const, where: "2025 brochure" })),
];

/** Two initials from the name as printed, honorifics and post-nominals left out. */
const HONORIFIC = /^(late|shri|smt\.?|dr\.?|ias)$/i;
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => !HONORIFIC.test(w));
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const EASE = [0.22, 1, 0.36, 1] as const;

const FILTERS = [
  { id: "all", label: "Everyone" },
  { id: "8th", label: "Met on the 8th edition" },
  { id: "brochure", label: "Listed for earlier editions" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

/**
 * The people delegates have met, as a filterable wall of cards: a monogram,
 * the name and office as printed, and where the name comes from. Changing the
 * filter re-deals the cards in place.
 */
export function People() {
  const [filter, setFilter] = useState<FilterId>("all");
  const shown = useMemo(() => people.filter((p) => filter === "all" || p.from === filter), [filter]);

  // The wall changed height: everything below it moved. Refresh once the
  // cards have settled.
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => window.clearTimeout(t);
  }, [filter]);

  return (
    <section id="people" className="j-sec j-paper" data-nav="dark" data-j-station="people" data-arch aria-labelledby="people-title">
      <div className="j-wrap">
        <Head id="people-title" title="The people" em="delegates met">
          <p>
            {people.length} leaders, officials and reformers named so far, from the {CONCEPT_NOTE} for the 8th edition and the {BROCHURE} for earlier ones. Names and titles are reproduced as printed.
            <NoteRef id="titles" />
          </p>
        </Head>

        <LayoutGroup>
          <div className="x-seg" role="group" aria-label="Show people">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button key={f.id} type="button" aria-pressed={on} className="x-seg__btn" onClick={() => setFilter(f.id)}>
                  {on ? <motion.span layoutId="people-seg" className="x-seg__pill" transition={{ duration: 0.45, ease: EASE }} /> : null}
                  <span className="x-seg__label">{f.label}</span>
                  <span className="x-seg__n">{people.filter((p) => f.id === "all" || p.from === f.id).length}</span>
                </button>
              );
            })}
          </div>

          <motion.ul layout className="x-wall" aria-label="People delegates have met">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p) => (
                <motion.li
                  key={p.name}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="x-wall__cell"
                >
                  <SpotlightCard theme="light" className="x-person" spotlightColor="#871b38" intensity={0.5} spotlightSize={220} borderGlow={0.9} tabIndex={0}>
                    <span className={`x-person__mono${p.from === "8th" ? " is-8th" : ""}`} aria-hidden="true">
                      {initials(p.name)}
                    </span>
                    <p className="x-person__name">{p.name}</p>
                    <p className="x-person__role">{p.title}</p>
                    <p className="x-person__tag">
                      {p.from === "8th" ? <MapPin aria-hidden="true" strokeWidth={1.8} /> : <BookOpen aria-hidden="true" strokeWidth={1.8} />}
                      {p.where}
                    </p>
                  </SpotlightCard>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

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
