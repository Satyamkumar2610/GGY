"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
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
      <NotifyLine ready={n === total} />
    </div>
  );
}

/**
 * The one thing a visitor can do before applications open: ask to be told.
 * There is no form service behind the page, so this is set as a sentence to
 * fill in, and sending it opens the visitor's own email with the note
 * already written to the GGY team. Nothing is stored here.
 */
function NotifyLine({ ready }: { ready: boolean }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const who = name.trim() || "A prospective delegate";
    const subject = "Please tell me when GGY'27 applications open";
    const body = `Hello GGY team,\n\nI am ${who}${from.trim() ? ` from ${from.trim()}` : ""}. Please let me know when applications for Good Governance Yatra'27 open.\n\nThank you.`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="x-notify" data-ready={ready ? "" : undefined} onSubmit={send} aria-label="Ask to be told when applications open">
      <p className="x-notify__line">
        <span>I’m</span>
        <label className="x-notify__field">
          <span className="sr-only">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" autoComplete="name" size={Math.max(9, name.length + 1)} />
        </label>
        <span>from</span>
        <label className="x-notify__field">
          <span className="sr-only">Your college, organisation or city</span>
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="college or city" autoComplete="organization" size={Math.max(12, from.length + 1)} />
        </label>
        <span>— tell me when applications open.</span>
      </p>
      <div className="x-notify__act">
        <button type="submit" className="x-notify__btn">
          <Mail aria-hidden="true" strokeWidth={1.8} />
          Send to the GGY team
        </button>
        <small>Opens your email app with the note written to {contact.email}.</small>
      </div>
    </form>
  );
}
