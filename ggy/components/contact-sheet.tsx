"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { photos, type PhotoKey } from "@/content/ggy";
import { lockScroll } from "@/lib/scroll";
import { NoteRef } from "./primitives";

const keys: PhotoKey[] = ["flagOff", "cohort", "address", "fieldGroup", "openLandscape", "legislatureSteps", "lectureHall", "overhead"];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The archive's photographs, printed as a contact sheet: frames on a strip of
 * film, edge-numbered, with one frame ringed in grease pencil. The brochure
 * does not say which editions they belong to, so they are not placed on the
 * timeline. Each frame opens in a full-screen viewer with its caption;
 * photographs are never shown larger than their original size.
 */
export function ContactSheet() {
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + keys.length) % keys.length)), []);

  useEffect(() => {
    if (open === null) return;
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        // Keep focus inside the viewer.
        const f = document.querySelectorAll<HTMLElement>("[data-viewer] button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      lastFocus.current?.focus();
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[keys[open]];

  return (
    <div className="sheet" aria-labelledby="sheet-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 id="sheet-title" className="d-m">
          From the archive
        </h3>
        <p className="caption max-w-[26rem]">Photographs printed in the GGY brochure. It does not say which editions they belong to, so they are not placed on the timeline. Open a frame to see it full screen.</p>
      </div>
      <div className="sheet-film mt-8">
        <ol className="sheet-grid">
          {keys.map((k, i) => {
            const p = photos[k];
            return (
              <li key={k} className="sheet-frame">
                <button
                  type="button"
                  onClick={(e) => {
                    lastFocus.current = e.currentTarget;
                    setOpen(i);
                  }}
                  className="sheet-button"
                  aria-label={`Open photograph: ${p.caption}`}
                >
                  <span className="sheet-image">
                    <Image src={p.src} alt={p.alt} fill quality={80} sizes="(min-width: 1024px) 24vw, 46vw" className="object-cover" />
                  </span>
                  <span aria-hidden="true" className="sheet-edge">
                    <span>GGY</span>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{String(i + 1).padStart(2, "0")}A</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <AnimatePresence>
        {current && open !== null ? (
          <motion.div
            data-viewer
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${open + 1} of ${keys.length}`}
            className="on-dark fixed inset-0 z-[80] flex flex-col bg-ink/[0.97] text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-lenis-prevent
          >
            <div className="page flex h-[var(--header-h)] items-center justify-between">
              <span className="num text-[1.1rem]">
                {open + 1} / {keys.length}
              </span>
              <button ref={closeBtn} type="button" onClick={close} className="tlink text-[0.95rem]">
                Close
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="relative h-full max-h-full w-full"
                  style={{ maxWidth: current.width, maxHeight: current.height }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.5, ease }}
                >
                  <Image src={current.src} alt={current.alt} fill quality={85} sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="page flex flex-wrap items-center justify-between gap-4 py-5">
              <p className="max-w-[40rem] text-[0.9rem] text-ivory/85">
                {current.caption}
                {keys[open] === "flagOff" ? <NoteRef id="flagoff" /> : null} Photograph from the GGY brochure.
              </p>
              <div className="flex gap-6 text-[0.95rem]">
                <button type="button" onClick={() => step(-1)} className="tlink">
                  Previous
                </button>
                <button type="button" onClick={() => step(1)} className="tlink">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
