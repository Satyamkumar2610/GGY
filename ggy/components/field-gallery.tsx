"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { photos, type PhotoKey } from "@/content/ggy";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

/**
 * Where each print comes to rest on the table: centre (x, y) as a percentage
 * of the stage, width in table units (see --u in globals.css), and the angle
 * it lands at. Widths keep every photograph below its original pixel size.
 */
const prints: { key: PhotoKey; x: number; y: number; w: number; r: number }[] = [
  { key: "cohort", x: 65, y: 27, w: 40, r: -2 },
  { key: "openLandscape", x: 44, y: 55, w: 24, r: 3 },
  { key: "lectureHall", x: 84, y: 54, w: 26, r: -3 },
  { key: "fieldGroup", x: 63, y: 69, w: 20, r: 5 },
  { key: "legislatureSteps", x: 29, y: 63, w: 13, r: -4 },
  { key: "overhead", x: 46, y: 85, w: 18, r: -6 },
  { key: "flagOff", x: 86, y: 83, w: 21, r: 4 },
  { key: "address", x: 40, y: 27, w: 19, r: 6 },
];
// The pile the prints are dealt from, and how each one lies in it.
const PILE = { x: 0.6, y: 0.56 };
const pileTilt = [-3, 5, -6, 2, 8, -4, 6, -2];
const STEP = 0.8;
const LEAD = 0.35;

const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

/**
 * Field photographs from past editions, laid out like prints on a table.
 * On large screens the section holds while the reader scrolls: the prints
 * start as a pile and are dealt out one at a time, each with its caption.
 * Once they are down they can be dragged around, and any print opens in a
 * full-screen viewer. Small screens and reduced motion get the same prints
 * in a plain column or the finished layout.
 */
export function FieldGallery() {
  const root = useRef<HTMLElement>(null);
  const [dealt, setDealt] = useState(prints.length - 1);
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dragged = useRef(false);

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>("[data-fp-stage]")!;
      const slots = gsap.utils.toArray<HTMLElement>("[data-slot]");
      const deals = gsap.utils.toArray<HTMLElement>("[data-deal]");
      const mm = gsap.matchMedia();

      // Large screens: the pile is dealt out across the pinned stage.
      mm.add(MOTION_QUERIES.desktop, () => {
        setDealt(-1);
        gsap.set(slots, { zIndex: (i) => 10 - i });
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 1 },
          scrollTrigger: {
            trigger: "[data-fp-track]",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        // Count from the timeline itself, so the caption keeps step with the
        // smoothed scrub rather than the raw scroll position.
        tl.eventCallback("onUpdate", () => {
          const n = Math.min(prints.length, Math.max(0, Math.ceil((tl.time() - LEAD) / STEP)));
          setDealt(n - 1);
        });
        deals.forEach((d, i) => {
          const slot = slots[i];
          const at = LEAD + i * STEP;
          tl.set(slot, { zIndex: 20 + i }, at).fromTo(
            d,
            {
              x: () => stage.offsetWidth * PILE.x - slot.offsetLeft,
              y: () => stage.offsetHeight * PILE.y - slot.offsetTop,
              rotation: pileTilt[i],
            },
            { x: 0, y: 0, rotation: prints[i].r, immediateRender: true },
            at,
          );
        });
        // Hold on the finished table for a beat before the page moves on.
        tl.to({}, { duration: 0.6 });
        return () => setDealt(prints.length - 1);
      });

      // Small screens: each print straightens as it comes up the page.
      mm.add("(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)", () => {
        deals.forEach((d, i) => {
          gsap.fromTo(
            d,
            { rotation: prints[i].r * 3, x: i % 2 ? 48 : -48, opacity: 0.4 },
            { rotation: prints[i].r, x: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: slots[i], start: "top 96%", end: "top 62%", scrub: 0.6 } },
          );
        });
      });

      // A mouse can pick the prints up and move them about the table.
      mm.add("(min-width: 64rem) and (pointer: fine)", () => {
        let top = 40;
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const drags = Draggable.create("[data-print]", {
          type: "x,y",
          bounds: stage,
          inertia: !calm,
          throwResistance: 4000,
          maxDuration: 0.9,
          dragClickables: true,
          dragResistance: 0.05,
          edgeResistance: 0.8,
          zIndexBoost: false,
          onPress() {
            gsap.set(this.target.closest("[data-slot]"), { zIndex: ++top });
            if (!calm) gsap.to(this.target, { scale: 1.05, rotation: -prints[Number(this.target.dataset.i)].r * 0.5, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          },
          onDragStart() {
            dragged.current = true;
          },
          onRelease() {
            if (!calm) gsap.to(this.target, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", overwrite: "auto" });
            // The click that ends a drag arrives after release: let it pass first.
            setTimeout(() => (dragged.current = false), 0);
          },
        });
        return () => drags.forEach((d) => d.kill());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const shown = hover ?? dealt;
  const caption = shown >= 0 ? photos[prints[shown].key].caption : null;

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="fp on-dark on-ember ground gloss" data-j-station="gallery">
      <div className="fp-track" data-fp-track>
        <div className="fp-stage" data-fp-stage>
          <h2 id="gallery-title" className="j-title fp-title">
            <span>Field</span>
            <em>photographs</em>
          </h2>

          <div className="fp-note">
            <p className="fp-count num" aria-hidden="true">
              {Math.max(0, shown + 1)}
              <span>of {prints.length}</span>
            </p>
            <p className="fp-caption" aria-hidden="true">
              {caption ? sentence(caption) : "Keep scrolling to lay the prints out."}
            </p>
            <p className="fp-help">
              From past editions, as printed in the GGY brochure. <span className="fp-help-drag">Drag a print to move it. </span>Select one to see it full screen.
            </p>
          </div>

          <ul className="fp-table">
            {prints.map((s, i) => {
              const p = photos[s.key];
              return (
                <li key={s.key} className="fp-slot" data-slot data-tall={p.height > p.width ? "" : undefined} style={{ "--x": `${s.x}%`, "--y": `${s.y}%`, "--w": s.w, "--r": `${s.r}deg`, aspectRatio: `${p.width} / ${p.height}` } as CSSProperties}>
                  <div className="fp-deal" data-deal>
                    <button
                      type="button"
                      className="fp-print"
                      data-print
                      data-i={i}
                      data-cursor="Drag"
                      aria-label={`Open photograph ${i + 1} of ${prints.length}: ${p.caption}`}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                      onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                      onClick={(e) => {
                        if (dragged.current) return;
                        lastFocus.current = e.currentTarget;
                        setOpen(i);
                      }}
                    >
                      <Image src={p.src} alt={p.alt} fill quality={82} sizes="(min-width: 64rem) 42vw, 90vw" draggable={false} className="object-cover" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
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
