"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
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

/* How each print hangs on the strip: its height (share of the screen) and
   how far it drops from the top line. Every other print tucks under its
   neighbour's edge, so the strip reads as prints laid down by hand. */
const HANG = [
  { h: 64, y: 0 },
  { h: 46, y: 22 },
  { h: 56, y: 6 },
  { h: 42, y: 30 },
  { h: 60, y: 2 },
  { h: 48, y: 20 },
  { h: 58, y: 4 },
  { h: 44, y: 26 },
];

/**
 * Field photographs from past editions, as a strip of prints that travels
 * past as the page is scrolled: the section holds still and the strip moves
 * sideways under it, each photograph drifting a little inside its own frame,
 * with a counter and a hairline that follow. Any print opens in the
 * full-screen viewer. On phones, and without motion, the strip is a row to
 * swipe through.
 */
export function FieldGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const el = root.current!;
        const pin = el.querySelector<HTMLElement>("[data-film-pin]")!;
        const track = el.querySelector<HTMLElement>("[data-film-track]")!;
        const count = el.querySelector<HTMLElement>("[data-film-count]");
        const bar = el.querySelector<HTMLElement>("[data-film-bar]");
        const shots = gsap.utils.toArray<HTMLElement>("[data-film-print]", el);
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        let shown = 0;

        const run = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              bar?.style.setProperty("transform", `scaleX(${Math.max(0.02, self.progress)})`);
              const i = Math.min(prints.length - 1, Math.round(self.progress * (prints.length - 1)));
              if (i !== shown && count) {
                shown = i;
                count.textContent = String(i + 1).padStart(2, "0");
              }
            },
          },
        });

        // Each photograph drifts against the strip inside its frame.
        shots.forEach((shot) => {
          const img = shot.querySelector("[data-film-img]");
          if (!img) return;
          gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: shot, containerAnimation: run, start: "left right", end: "right left", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="fs x-film on-dark on-ember ground gloss" data-j-station="gallery" data-arch>
      <div className="x-film__pin" data-film-pin>
        <div className="x-film__track" data-film-track>
          <header className="x-film__intro">
            <h2 id="gallery-title" className="x-film__title">
              <span>Field</span>
              <em>photographs</em>
            </h2>
            <p className="x-film__help">From past editions, as printed in the GGY brochure. Keep scrolling to travel along the prints; select one to see it full screen.</p>
          </header>

          <ol className="x-film__row" aria-label="Field photographs">
            {prints.map((s, i) => {
              const p = photos[s.key];
              const hang = HANG[i % HANG.length];
              return (
                <li key={s.key} className="x-film__print" data-film-print style={{ "--h": hang.h, "--y": hang.y, "--ar": `${p.width} / ${p.height}`, zIndex: i % 2 ? 2 : 1 } as CSSProperties}>
                  <button
                    type="button"
                    className="x-film__frame"
                    aria-label={`Open photograph ${i + 1} of ${prints.length}: ${p.caption}`}
                    onClick={(e) => {
                      lastFocus.current = e.currentTarget;
                      setOpen(i);
                    }}
                  >
                    <span className="x-film__clip">
                      <span className="x-film__img" data-film-img>
                        <Image src={p.src} alt={p.alt} fill quality={82} sizes="(min-width: 64rem) 50vw, 80vw" draggable={false} className="object-cover" />
                      </span>
                    </span>
                  </button>
                  <p className="x-film__cap">
                    <span className="x-film__n">{String(i + 1).padStart(2, "0")}</span>
                    {sentence(p.caption)}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="x-film__meter" aria-hidden="true">
          <span className="x-film__count">
            <b data-film-count>01</b> / {String(prints.length).padStart(2, "0")}
          </span>
          <span className="x-film__line">
            <i data-film-bar />
          </span>
        </div>
      </div>

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
