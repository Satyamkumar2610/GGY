"use client";

import { useRef } from "react";
import { CONCEPT_NOTE, itinerary8 } from "@/content/ggy";
import { NoteRef } from "../primitives";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The 8th edition, day by day, as a strip of journal pages that runs
 * sideways. Field notes open in place. Historical: printed in the concept
 * note, whose dates differ from the brochure's (see the note).
 */
export function DayStrip() {
  const strip = useRef<HTMLOListElement>(null);
  const move = (dir: number) => {
    const el = strip.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const by = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: dir * by * 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div id="itinerary" className="days" aria-labelledby="days-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h3 id="days-title" className="d-m">
            The 2025 edition, day by day
          </h3>
          <p className="caption mt-3 max-w-[30rem]">
            The itinerary of the 8th edition, 23 to 31 March, as printed in the {CONCEPT_NOTE}.
            <NoteRef id="dates8" />
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="days-nav" onClick={() => move(-1)} aria-label="Earlier days">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" className="days-nav" onClick={() => move(1)} aria-label="Later days">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <ol ref={strip} className="days-strip mt-8" data-lenis-prevent-wheel tabIndex={0} aria-label="Days of the 2025 itinerary">
        {itinerary8.map((d) => (
          <li key={d.day} className="days-card">
            <div className="flex items-baseline justify-between gap-4">
              <span className="num days-num">{pad(d.day)}</span>
              <span className="caption">{d.date}</span>
            </div>
            <p className="days-city">{d.city}</p>
            <ul className="days-agenda">
              {d.agenda.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            {d.field ? (
              <details className="days-field">
                <summary>
                  <span className="caption">Field note</span>
                  <span className="days-field-title">{d.field.title}</span>
                </summary>
                <p>{d.field.text}</p>
              </details>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
