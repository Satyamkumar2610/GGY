"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CalendarClock, Check, Mail, Sparkles, Timer, Wallet, type LucideIcon } from "lucide-react";
import { contact, readiness } from "@/content/ggy";

const ICONS: Record<string, LucideIcon> = { fit: Sparkles, time: CalendarClock, fee: Wallet, early: Timer, contact: Mail };

/**
 * A self-check for when applications open, built from the 2025 brochure.
 * It is not an eligibility test: criteria for the upcoming edition are to be
 * announced. Set as one compact band: a meter on the left, five tiles that
 * toggle on press.
 */
export function Readiness() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const n = Object.values(done).filter(Boolean).length;
  const total = readiness.length;
  const message = n === total ? "Ready for when applications open." : n >= 3 ? "Nearly ready." : n > 0 ? "A good start." : "Tick what applies to you.";

  return (
    <div className="x-ready">
      <div className="x-ready__head">
        <div>
          <h3 className="x-ready__title">Are you ready to apply?</h3>
          <p className="x-ready__sub">A self-check based on the 2025 brochure, not an eligibility test. Criteria for the upcoming edition are to be announced.</p>
        </div>
        <div className="x-ready__meter">
          <p className="x-ready__count" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={n} initial={{ y: "-60%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                {n}
              </motion.span>
            </AnimatePresence>
            <span>/{total}</span>
          </p>
          <div className="x-ready__bar" aria-hidden="true">
            {readiness.map((r, i) => (
              <i key={r.id} data-on={i < n ? "" : undefined} />
            ))}
          </div>
          <p className="x-ready__msg" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </div>
      <ul className="x-ready__tiles">
        {readiness.map((r, i) => {
          const Icon = ICONS[r.id] ?? Sparkles;
          const on = !!done[r.id];
          return (
            <li key={r.id}>
              <label className="x-tile" data-on={on ? "" : undefined}>
                <input type="checkbox" className="sr-only" checked={on} onChange={(e) => setDone((d) => ({ ...d, [r.id]: e.target.checked }))} />
                <span className="x-tile__top">
                  <span className="x-tile__icon">
                    <Icon aria-hidden="true" strokeWidth={1.6} />
                  </span>
                  <span className="x-tile__check" aria-hidden="true">
                    <motion.span initial={false} animate={{ scale: on ? 1 : 0, rotate: on ? 0 : -45 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}>
                      <Check strokeWidth={2.6} />
                    </motion.span>
                  </span>
                </span>
                <span className="x-tile__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="x-tile__label">{r.label}</span>
                <span className="x-tile__src">
                  {r.id === "contact" ? (
                    <a className="tlink tlink-static" href={`mailto:${contact.email}`}>
                      {r.source}
                    </a>
                  ) : (
                    r.source
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
