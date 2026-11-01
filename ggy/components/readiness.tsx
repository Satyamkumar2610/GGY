"use client";

import { useState } from "react";
import { contact, readiness } from "@/content/ggy";


/**
 * A self-check for when applications open, built from the 2025 brochure.
 * It is not an eligibility test: criteria for the upcoming edition are to be announced.
 */
export function Readiness() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const n = Object.values(done).filter(Boolean).length;
  const total = readiness.length;

  const message = n === total ? "Ready for when applications open." : n >= 3 ? "Nearly ready." : n > 0 ? "A good start." : "Tick what applies to you.";

  return (
    <div className="readiness grid gap-10 bg-light p-[clamp(1.5rem,4vw,3rem)] text-ink md:grid-cols-[auto_1fr] md:gap-14">
      <div className="flex items-center gap-6 md:flex-col md:items-start">
        {/* A tally in the margin: one stroke per answer ticked. */}
        <span aria-hidden="true" className="tally">
          {readiness.map((r, i) => (
            <span key={r.id} className={i < n ? "is-on" : ""} />
          ))}
        </span>
        <div>
          <p className="num text-[2.6rem] leading-none" aria-hidden="true">
            {n}/{total}
          </p>
          <p className="mt-2 max-w-[12rem] text-[0.95rem]" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </div>
      <div>
        <h3 className="d-s">Are you ready to apply?</h3>
        <p className="mt-2 max-w-[34rem] text-[0.9rem] text-muted">A self-check based on the 2025 brochure. It is not an eligibility test; criteria for the upcoming edition are to be announced.</p>
        <ul className="mt-6">
          {readiness.map((r) => (
            <li key={r.id}>
              <label className="check-row">
                <input type="checkbox" checked={!!done[r.id]} onChange={(e) => setDone((d) => ({ ...d, [r.id]: e.target.checked }))} className="check-input" />
                <span aria-hidden="true" className="check-box" />
                <span>
                  <span className="block text-[1rem]">{r.label}</span>
                  <span className="mt-0.5 block text-[0.8rem] text-muted">
                    {r.id === "contact" ? (
                      <a className="tlink tlink-static" href={`mailto:${contact.email}`}>
                        {r.source}
                      </a>
                    ) : (
                      r.source
                    )}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
