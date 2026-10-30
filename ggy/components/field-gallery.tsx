"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { photos, type PhotoKey } from "@/content/ggy";
import { lockScroll } from "@/lib/scroll";

const keys: PhotoKey[] = ["cohort", "openLandscape", "lectureHall", "fieldGroup", "legislatureSteps", "overhead", "flagOff", "address"];
// Varied frame heights and offsets so the strip reads as a hand-laid contact sheet.
const layout = ["h-[26rem] mt-0", "h-[19rem] mt-24", "h-[23rem] mt-10", "h-[17rem] mt-40", "h-[28rem] mt-4", "h-[18rem] mt-28", "h-[22rem] mt-8", "h-[16rem] mt-36"];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Field photographs from past editions. The strip can be dragged or scrolled
 * sideways; each photograph opens in a full-screen viewer with its caption.
 * Photographs are never shown larger than their original size.
 */
export function FieldGallery() {
  const strip = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0 });

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
    <section id="gallery" aria-labelledby="gallery-title" className="on-dark on-ember ground gloss py-[clamp(6rem,12vw,10rem)]">
      <div className="page grid gap-6 lg:grid-cols-12 lg:gap-[var(--gap)]">
        <h2 id="gallery-title" className="d-l lg:col-span-7" data-drift>
          Field photographs
        </h2>
        <p className="max-w-[24rem] text-dim lg:col-span-3 lg:col-start-10 lg:self-end">
          From past editions, as printed in the GGY brochure. Drag the strip, or open a photograph to see it full screen.
        </p>
      </div>

      <div
        ref={strip}
        className="gallery-strip mt-[clamp(3rem,6vw,5rem)] flex cursor-grab gap-[clamp(1rem,2vw,2rem)] overflow-x-auto px-[var(--gutter)] pb-8 active:cursor-grabbing"
        data-lenis-prevent-wheel
        data-cursor="Drag"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !strip.current) return;
          drag.current = { on: true, x: e.clientX, left: strip.current.scrollLeft, moved: 0 };
        }}
        onPointerMove={(e) => {
          if (!drag.current.on || !strip.current) return;
          const dx = e.clientX - drag.current.x;
          drag.current.moved = Math.abs(dx);
          strip.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current.on = false)}
        onPointerLeave={() => (drag.current.on = false)}
      >
        {keys.map((k, i) => {
          const p = photos[k];
          return (
            <figure key={k} className={`group relative shrink-0 ${layout[i]}`} style={{ aspectRatio: `${p.width} / ${p.height}` }}>
              <button
                type="button"
                onClick={(e) => {
                  if (drag.current.moved > 6) return;
                  lastFocus.current = e.currentTarget;
                  setOpen(i);
                }}
                className="relative block h-full w-full overflow-hidden rounded-[var(--radius-media)]"
                aria-label={`Open photograph: ${p.caption}`}
                data-cursor="Open"
              >
                <Image src={p.src} alt={p.alt} fill quality={80} sizes="40vw" draggable={false} className="object-cover transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-[1.06]" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-3 right-3 translate-y-[calc(100%+1rem)] rounded-[var(--radius-thumb)] bg-cream px-3.5 py-2.5 text-left text-[0.8rem] leading-snug text-ember transition-transform duration-500 ease-[var(--ease)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                >
                  {p.caption}
                </span>
              </button>
            </figure>
          );
        })}
      </div>

      <AnimatePresence>
        {current && open !== null ? (
          <motion.div
            data-viewer
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${open + 1} of ${keys.length}`}
            className="fixed inset-0 z-[80] flex flex-col bg-ember/95 text-ivory backdrop-blur-sm"
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
              <p className="max-w-[40rem] text-[0.9rem] text-ivory/85">{current.caption} Photograph from the GGY brochure.</p>
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
    </section>
  );
}
