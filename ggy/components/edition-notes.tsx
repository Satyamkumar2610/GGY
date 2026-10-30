"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { photos, previousEdition, upcoming } from "@/content/ggy";
import { Value } from "./primitives";

/**
 * Edition notes as a comparison you can drag: the 2025 edition on one side
 * as a documentary photograph with its printed facts, the upcoming edition on
 * the other with only its route confirmed. The handle is a range input, so it
 * works with a keyboard.
 */
export function EditionNotes() {
  const photo = photos.cohort;
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const inView = useInView(box, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // On narrow screens the comparison stacks: 2025 above, the upcoming edition below.
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 39.99rem)");
    const on = () => setVertical(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // A short hint that the line can be moved, once.
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(50, 64, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: setPos });
    const t = setTimeout(() => animate(64, 50, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: setPos }), 950);
    return () => {
      c.stop();
      clearTimeout(t);
    };
  }, [inView, reduce]);

  const fromPointer = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const f = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
    setPos(Math.min(92, Math.max(8, f * 100)));
  };

  const pending: [string, string | null][] = [
    ["Dates", upcoming.dates],
    ["Duration", upcoming.duration],
    ["Stops", upcoming.itinerary],
    ["Order of travel", upcoming.orderOfTravel],
    ["Cohort", upcoming.cohortSize],
    ["Applications", upcoming.applyUrl],
  ];

  return (
    <section id="editions" aria-labelledby="editions-title" className="bg-paper pb-[clamp(5rem,10vw,8rem)] pt-[clamp(6rem,12vw,10rem)]">
      <div className="page">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <h2 id="editions-title" className="d-l lg:col-span-7">
            So far, only the route is confirmed.
          </h2>
          <p className="max-w-[24rem] text-ink-soft lg:col-span-3 lg:col-start-10 lg:self-end">
            Drag the line to compare the 2025 edition with the next one. Everything else will be announced with the programme.
          </p>
        </div>
      </div>

      <div className="mt-[clamp(3rem,6vw,5rem)] lg:pl-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))]">
        <div
          ref={box}
          className={`edition-box relative select-none overflow-hidden ${vertical ? "h-[46rem] touch-pan-x" : "h-[min(78svh,46rem)] touch-pan-y"}`}
          data-cursor="Drag"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          {/* The upcoming edition: a page whose fields are still blank */}
          <div className="edition-page absolute inset-0 text-ink">
            <div className={`absolute flex flex-col justify-end p-[clamp(1.5rem,4vw,3.5rem)] ${vertical ? "inset-x-0 bottom-0 h-[44%]" : "inset-y-0 right-0 w-[44%] pl-[2%]"}`}>
              <p className="caps text-saffron-ink">The upcoming edition</p>
              <p className="d-m mt-4">Maharashtra, Goa and Gujarat</p>
              <div aria-hidden="true" className="route-rule mt-6 text-ink" />
              <dl className="mt-7 grid grid-cols-2 gap-x-7 gap-y-5 md:grid-cols-3">
                {pending.map(([t, v]) => (
                  <div key={t} className="edition-field">
                    <dt className="caps text-muted">{t}</dt>
                    <dd className="mt-1.5 text-[1.05rem]">
                      <Value value={v} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* The 2025 edition (on top, clipped to the left of the line) */}
          <div className="absolute inset-0 text-ivory" style={{ clipPath: vertical ? `inset(0 0 ${100 - pos}% 0)` : `inset(0 ${100 - pos}% 0 0)` }}>
            <Image src={photo.src} alt={photo.alt} fill quality={82} sizes="100vw" className="object-cover" style={{ objectPosition: "50% 35%" }} />
            <div aria-hidden="true" className={`edition-grade absolute inset-0 ${vertical ? "is-vertical" : ""}`} />
            <div className={`absolute left-0 max-w-[34rem] p-[clamp(1.5rem,4vw,3.5rem)] ${vertical ? "top-[6%]" : "bottom-0"}`}>
              <p className="caps text-saffron-soft">The previous edition, {previousEdition.label}</p>
              <p className="d-m mt-4">{previousEdition.route}</p>
              <div aria-hidden="true" className="route-rule mt-6 text-cream" />
              <p className="mt-6 text-[0.92rem] text-ivory/85">
                {previousEdition.dates}; {previousEdition.delegates}; {previousEdition.distance}. Led by Shri Shantanu Gupta; organised by {previousEdition.organisedBy}.
              </p>
              <p className="mt-3 hidden text-[0.75rem] text-ivory/70 sm:block">{photo.caption}. Photograph from the GGY brochure.</p>
            </div>
          </div>

          {/* The handle */}
          <div aria-hidden="true" className={`edition-seam pointer-events-none absolute ${vertical ? "inset-x-0 h-px" : "inset-y-0 w-px"}`} style={vertical ? { top: `${pos}%` } : { left: `${pos}%` }}>
            <span className="edition-knob">{vertical ? "↕" : "↔"}</span>
          </div>
          <label className="sr-only" htmlFor="edition-compare">
            Compare the 2025 edition with the upcoming edition
          </label>
          <input
            id="edition-compare"
            type="range"
            min={8}
            max={92}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            className="compare-range absolute inset-x-0 bottom-0 h-11 w-full cursor-ew-resize opacity-0 focus-visible:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
