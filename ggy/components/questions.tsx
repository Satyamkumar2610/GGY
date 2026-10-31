"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { faqs } from "@/content/ggy";
import { Contours } from "./contours";

const ease = [0.22, 1, 0.36, 1] as const;

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-crimson/15 text-inherit">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}

/** Searchable questions. Answers use only the 2025 brochure and the confirmed route. */
export function Questions() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const t = term.trim();
  const shown = useMemo(() => faqs.map((f, i) => ({ ...f, i })).filter((f) => !t || (f.q + " " + f.a).toLowerCase().includes(t.toLowerCase())), [t]);

  return (
    <section id="questions" aria-labelledby="questions-title" className="relative isolate bg-paper py-[clamp(6rem,12vw,10rem)]">
      <Contours variant="a" />
      <div className="page grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:self-start">
          <h2 id="questions-title" className="d-l" data-drift>
            Questions, <em>answered</em>
          </h2>
          <label htmlFor={`${id}-q`} className="mt-10 block text-[0.9rem] text-ink-soft">
            Search the answers
          </label>
          <div className="search-field mt-2">
            <input
              id={`${id}-q`}
              type="search"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setOpen(null);
              }}
              placeholder="dates, fee, apply…"
              className="w-full bg-transparent py-3 font-display text-[1.35rem] outline-none placeholder:text-ink/35"
              autoComplete="off"
            />
          </div>
          <p className="mt-3 text-[0.85rem] text-muted" role="status" aria-live="polite">
            {shown.length === faqs.length ? `${faqs.length} questions` : `${shown.length} of ${faqs.length} questions match`}
          </p>
        </div>

        <ul className="faq-list lg:col-span-7 lg:col-start-6">
          <AnimatePresence initial={false}>
            {shown.map((f) => {
              const on = open === f.i || (t.length > 1 && shown.length <= 3);
              return (
                <motion.li key={f.q} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="faq-item">
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`${id}-a${f.i}`} onClick={() => setOpen(on ? null : f.i)} className="faq-button">
                      <span className="faq-q">
                        <Highlight text={f.q} term={t} />
                      </span>
                      <span aria-hidden="true" className={`faq-sign ${on ? "is-open" : ""}`} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on ? (
                      <motion.div id={`${id}-a${f.i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                        <p className="faq-a">
                          <Highlight text={f.a} term={t} />
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {shown.length === 0 ? (
            <li className="py-8 text-ink-soft">
              No answer mentions “{t}”. Write to the team at{" "}
              <a className="tlink tlink-static" href="mailto:ggy@rashtram.org">
                ggy@rashtram.org
              </a>
              .
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
