"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { pastEditions, photos, proposedMaharashtra, stateDossiers, upcoming, CONCEPT_NOTE, type StateDossier } from "@/content/ggy";
import { lockScroll } from "@/lib/scroll";
import type { FocusIso } from "@/lib/atlas";
import { NoteRef, Script, Value } from "../primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The state dossier: a floating sheet of reference notes. Beside the map on
 * large screens, a bottom sheet on small ones. A modal dialog: focus moves
 * in, Tab stays inside, Escape closes and focus returns to what opened it.
 */
export function StateDossierPanel({ dossier, onClose, onNavigate }: { dossier: StateDossier | null; onClose: () => void; onNavigate: (iso: FocusIso) => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const isOpen = dossier !== null;
  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [isOpen, onClose]);

  const from = wide ? { opacity: 0, x: -28, clipPath: "inset(0% 100% 0% 0%)" } : { y: "100%" };
  const to = wide ? { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)" } : { y: 0 };

  return (
    <AnimatePresence>
      {dossier ? (
        <div className="dossier-layer" key="layer">
          <motion.div
            className="dossier-scrim"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-title"
            className="dossier"
            initial={reduce ? { opacity: 0 } : from}
            animate={reduce ? { opacity: 1 } : to}
            exit={reduce ? { opacity: 0 } : { ...from, transition: { duration: 0.35, ease } }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease }}
            data-lenis-prevent
          >
            <span aria-hidden="true" className="dossier-handle" />
            <div className="dossier-bar">
              <p className="dossier-kicker">
                <span className="num">{dossier.chapter}</span> State dossier
              </p>
              <button ref={close} type="button" className="dossier-close" onClick={onClose}>
                Close
                <span aria-hidden="true" className="dossier-x" />
              </button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={dossier.iso} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduce ? 0 : 0.4, ease }}>
                <DossierBody d={dossier} />
              </motion.div>
            </AnimatePresence>
            <nav className="dossier-nav" aria-label="Other states">
              {stateDossiers
                .filter((d) => d.iso !== dossier.iso)
                .map((d) => (
                  <button key={d.iso} type="button" onClick={() => onNavigate(d.iso)} className="atlas-chip">
                    {d.name}
                  </button>
                ))}
            </nav>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function DossierBody({ d }: { d: StateDossier }) {
  const [shown, setShown] = useState(0);
  const native = upcoming.states.find((s) => s.name === d.name)!;
  const photo = photos[d.photos[shown]];
  const routes = pastEditions.filter((e) => e.route.split(" – ").includes(d.name));
  return (
    <div>
      <h2 id="dossier-title" className="dossier-name">
        {d.name}
        <Script lang={native.lang} className="dossier-native">
          {native.native}
        </Script>
      </h2>

      <figure className="mt-6">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div key={photo.src} className="absolute inset-0" initial={{ clipPath: "inset(0% 0% 0% 100%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: 0.8, ease }}>
              <Image src={photo.src} alt={photo.alt} fill quality={80} sizes="(min-width: 1024px) 30rem, 100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <figcaption className="caption mt-2">
          {photo.caption}. {photo.credit}{" "}
          {photo.license ? (
            <a className="tlink tlink-static" href={photo.license.url} rel="license noopener" target="_blank">
              {photo.license.name}
            </a>
          ) : null}
          {photo.sourceUrl ? (
            <>
              {", "}
              <a className="tlink tlink-static" href={photo.sourceUrl} rel="noopener" target="_blank">
                source
              </a>
            </>
          ) : null}
        </figcaption>
        {d.photos.length > 1 ? (
          <ul className="dossier-gallery mt-3" aria-label="Photographs">
            {d.photos.map((k, i) => (
              <li key={k}>
                <button type="button" aria-pressed={i === shown} aria-label={`Show ${photos[k].caption}`} onClick={() => setShown(i)} className="dossier-thumb">
                  <Image src={photos[k].src} alt="" fill sizes="7rem" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </figure>

      <p className="mt-6 text-[0.98rem] text-ink-soft">{d.intro}</p>
      <p className="caption mt-2">Reference notes compiled for this page; not from GGY sources.</p>

      <dl className="dossier-facts mt-6">
        {d.facts.map((f) => (
          <div key={f.term}>
            <dt>{f.term}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
        <div>
          <dt>Coordinates of the capital</dt>
          <dd>{d.capital.coords}</dd>
        </div>
      </dl>

      <section className="dossier-section" aria-labelledby={`ggy-${d.iso}`}>
        <h3 id={`ggy-${d.iso}`} className="dossier-h">
          With the Yatra before
        </h3>
        <ul className="mt-3 space-y-2">
          {routes.map((r) => (
            <li key={r.year + r.route} className="flex gap-4 text-[0.92rem]">
              <span className="num w-[5.5rem] shrink-0 text-crimson">
                {r.year}
                {r.season && r.season !== "8th edition" ? ` ${r.season.toLowerCase()}` : ""}
              </span>
              <span>{r.route}</span>
            </li>
          ))}
        </ul>
        <p className="caption mt-2">Routes as printed in the 2025 brochure.</p>
        {d.people.length ? (
          <>
            <p className="mt-5 text-[0.85rem] font-medium">Named among the role models delegates have met</p>
            <ul className="mt-2 space-y-1.5">
              {d.people.map((p) => (
                <li key={p.name} className="text-[0.92rem]">
                  {p.name}, <span className="text-muted">{p.title}</span>
                </li>
              ))}
            </ul>
            <p className="caption mt-2">
              Titles as printed in the 2025 brochure, which does not say in which edition delegates met them.
              <NoteRef id="titles" />
            </p>
          </>
        ) : null}
      </section>

      {d.iso === "IN-MH" ? (
        <section className="dossier-section" aria-labelledby="mh-proposed">
          <h3 id="mh-proposed" className="dossier-h">
            Proposed in the {CONCEPT_NOTE}
            <span className="dossier-tag">Tentative</span>
          </h3>
          <ul className="mt-3 space-y-1.5 text-[0.9rem]">
            {proposedMaharashtra.flatMap((day) => day.items).map((it) => (
              <li key={it} className="dossier-tentative">
                {it}
              </li>
            ))}
          </ul>
          <p className="caption mt-2">A proposal, not a confirmed programme. None of these visits has been confirmed.</p>
        </section>
      ) : null}

      <section className="dossier-section" aria-labelledby={`status-${d.iso}`}>
        <h3 id={`status-${d.iso}`} className="dossier-h">
          Programme status
        </h3>
        <dl className="dossier-facts mt-3">
          {[
            ["Stops in this state", null],
            ["Dates", upcoming.dates],
            ["Order of travel", upcoming.orderOfTravel],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>
                <Value value={v} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
