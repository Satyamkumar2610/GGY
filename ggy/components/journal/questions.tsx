"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { contact, faqs } from "@/content/ggy";
import { atlas, FOCUS_ISO, stateByIso } from "@/lib/atlas";
import { Star, Title } from "./head";

const [X0, Y0, X1, Y1] = atlas.outlineBounds;
const FOCUS = FOCUS_ISO.map((iso) => stateByIso(iso)?.d ?? "");

/**
 * Ten questions, answered only from the 2025 brochure and the confirmed
 * route. The left column holds still while the answers are read: the title,
 * a counter for the open question over the outline of India with the
 * upcoming edition's states filled, and a way to ask the team directly.
 */
export function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const shown = open ?? 0;
  return (
    <section id="questions" className="j-sec j-paper" data-nav="dark" data-j-station="questions" data-arch aria-labelledby="questions-title">
      <div className="j-wrap x-faq">
        <aside className="x-faq__side">
          <div className="j-plate" aria-hidden="true">
            <Star />
            <i className="j-rule" data-rule />
          </div>
          <Title id="questions-title" title="Questions," em="answered" />
          <p className="x-faq__note">Answers use only the 2025 brochure and the confirmed route.</p>

          <div className="x-faq__dial" aria-hidden="true">
            <svg viewBox={`${X0} ${Y0} ${X1 - X0} ${Y1 - Y0}`} className="x-faq__map">
              <path d={atlas.outline} className="x-faq__land" />
              {FOCUS.map((d, i) => (
                <path key={i} d={d} className="x-faq__focus" />
              ))}
            </svg>
            <p className="x-faq__count">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={shown} initial={{ y: "40%", opacity: 0, filter: "blur(6px)" }} animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }} exit={{ y: "-40%", opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  {String(shown + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <small>/ {String(faqs.length).padStart(2, "0")}</small>
            </p>
          </div>

          <a className="x-faq__ask" href={`mailto:${contact.email}`}>
            <span className="x-faq__ask-icon">
              <MessageCircleQuestion aria-hidden="true" strokeWidth={1.6} />
            </span>
            <span>
              <strong>Still curious?</strong>
              <span>Write to the GGY team at {contact.email}</span>
            </span>
            <ArrowUpRight className="x-faq__ask-go" aria-hidden="true" strokeWidth={1.6} />
          </a>
        </aside>

        <ul className="j-faq x-faq__list">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="j-faq__item" data-open={on ? "" : undefined}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`${id}-${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span className="x-faq__n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="x-faq__q">{f.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-${i}`} className="j-faq__a" inert={!on}>
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
