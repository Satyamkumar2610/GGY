"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { photos, type PhotoKey } from "@/content/ggy";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";

/** The prints, in the order they are laid down. */
const prints: { key: PhotoKey }[] = [
  { key: "cohort" },
  { key: "openLandscape" },
  { key: "lectureHall" },
  { key: "fieldGroup" },
  { key: "legislatureSteps" },
  { key: "overhead" },
  { key: "flagOff" },
  { key: "address" },
];

const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

/**
 * Field photographs from past editions, as a stack of prints. Each print
 * pins in turn as the page scrolls and the earlier ones shrink and dim
 * beneath it. Any print opens in a full-screen viewer.
 */
export function FieldGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="fs on-dark on-ember ground gloss" data-j-station="gallery" data-arch>
      <header className="fs-head">
        <h2 id="gallery-title" className="j-title fp-title">
          <span>Field</span>
          <em>photographs</em>
        </h2>
        <p className="fs-help">From past editions, as printed in the GGY brochure. Scroll to lay the prints down; select one to see it full screen.</p>
      </header>

      <ScrollStack useWindowScroll smoothScroll={false} stackPosition="18%" itemDistance={90} itemStackDistance={28} itemScale={0.04} baseScale={0.85} dimAmount={0.18} rotationAmount={1.2} holdDistance={160}>
        {prints.map((s, i) => {
          const p = photos[s.key];
          return (
            <ScrollStackItem key={s.key} itemClassName="fs-card">
              <button
                type="button"
                className="fs-card__btn"
                aria-label={`Open photograph ${i + 1} of ${prints.length}: ${p.caption}`}
                onClick={(e) => {
                  lastFocus.current = e.currentTarget;
                  setOpen(i);
                }}
              >
                <Image src={p.src} alt={p.alt} fill quality={82} sizes="(min-width: 64rem) 46rem, 92vw" draggable={false} className="object-cover" />
              </button>
              <p className="fs-card__cap">
                <span className="num">
                  {i + 1} <small>of {prints.length}</small>
                </span>
                {sentence(p.caption)}
              </p>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>

      {open !== null ? (
        <Viewer
          index={open}
          onStep={(d) => setOpen((i) => (i === null ? i : (i + d + prints.length) % prints.length))}
          onClose={() => {
            setOpen(null);
            lastFocus.current?.focus();
          }}
        />
      ) : null}
    </section>
  );
}

/** Full-screen viewer. Photographs are never shown larger than their original size. */
function Viewer({ index, onStep, onClose }: { index: number; onStep: (d: number) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const p = photos[prints[index].key];

  // Fade the viewer out before it unmounts.
  const close = useCallback(() => {
    if (!box.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    gsap.to(box.current, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    lockScroll(true);
    closeBtn.current?.focus();
    return () => lockScroll(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "Tab") {
        // Keep focus inside the viewer.
        const f = box.current!.querySelectorAll<HTMLElement>("button");
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
    return () => document.removeEventListener("keydown", onKey);
  }, [close, onStep]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        gsap.from(box.current, { opacity: 0, duration: 0.35, ease: "power2.out" });
      });
      return () => mm.revert();
    },
    { scope: box },
  );
  // Each photograph opens upward out of its own frame.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        gsap.fromTo("[data-shot]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.out" });
        gsap.fromTo("[data-shot] img", { scale: 1.12 }, { scale: 1, duration: 1.1, ease: "land" });
      });
      return () => mm.revert();
    },
    { scope: box, dependencies: [index] },
  );

  // Rendered on the body: the section is its own stacking context, so a
  // viewer left inside it would sit underneath the fixed navigation.
  return createPortal(
    <div ref={box} role="dialog" aria-modal="true" aria-label={`Photograph ${index + 1} of ${prints.length}`} className="fp-viewer" data-lenis-prevent>
      <div className="page flex h-[var(--header-h)] items-center justify-between">
        <span className="num text-[1.1rem]">
          {index + 1} of {prints.length}
        </span>
        <button ref={closeBtn} type="button" onClick={close} className="tlink text-[0.95rem]">
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)]">
        <div key={p.src} data-shot className="relative max-h-full w-full overflow-hidden" style={{ maxWidth: `min(${p.width}px, calc((100dvh - 12rem) * ${p.width / p.height}))`, aspectRatio: `${p.width} / ${p.height}` }}>
          <Image src={p.src} alt={p.alt} fill quality={82} sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div className="page flex flex-wrap items-center justify-between gap-4 py-5">
        <p className="max-w-[40rem] text-[0.9rem] text-ivory/85" aria-live="polite">
          {sentence(p.caption)} Photograph from the GGY brochure.
        </p>
        <div className="flex gap-6 text-[0.95rem]">
          <button type="button" onClick={() => onStep(-1)} className="tlink">
            Previous
          </button>
          <button type="button" onClick={() => onStep(1)} className="tlink">
            Next
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
