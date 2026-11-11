"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronsLeftRight, Landmark, Plus, Trees } from "lucide-react";
import { annotations, components, photos } from "@/content/ggy";
import { gsap, useGSAP } from "@/lib/gsap";

const field = components.find((c) => c.name === "Field Visit")!;
const policy = components.find((c) => c.name === "Interaction with Policy Architects")!;
const cases = components.find((c) => c.name === "Case Studies")!;

/**
 * The classroom and the field, one over the other. Drag the divider (or use
 * the arrow keys) to move from the lecture hall into open country; the side
 * being revealed lights its caption. Points of interest on the field
 * photograph open on press. On arrival the divider sweeps once, to show it
 * can be moved.
 */
export function FieldCompare() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [note, setNote] = useState<number | null>(null);
  const dragging = useRef(false);
  const hall = photos.lectureHall;
  const land = photos.openLandscape;
  const notes = annotations.openLandscape ?? [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const v = { p: 50 };
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 60%", once: true } })
          .to(v, { p: 78, duration: 0.9, ease: "power2.inOut", onUpdate: () => !dragging.current && setPos(v.p) })
          .to(v, { p: 24, duration: 1.2, ease: "power2.inOut", onUpdate: () => !dragging.current && setPos(v.p) })
          .to(v, { p: 50, duration: 0.9, ease: "power2.out", onUpdate: () => !dragging.current && setPos(v.p) });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const fromPointer = (e: ReactPointerEvent) => {
    const r = frame.current!.getBoundingClientRect();
    setPos(gsap.utils.clamp(2, 98, ((e.clientX - r.left) / r.width) * 100));
  };

  const side = pos > 55 ? "hall" : pos < 45 ? "land" : "both";

  return (
    <div ref={root} className="x-cmp">
      <div
        ref={frame}
        className="x-cmp__frame"
        style={{ "--pos": `${pos}%` } as CSSProperties}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-hotspot]")) return;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        data-cursor="Drag"
      >
        <div className="x-cmp__layer">
          <Image src={land.src} alt={land.alt} fill sizes="(min-width: 64rem) 90vw, 100vw" quality={80} className="object-cover" />
          {notes.map((n, i) => (
            <button
              key={n.title}
              type="button"
              data-hotspot
              className="x-cmp__spot"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              aria-expanded={note === i}
              aria-label={n.title}
              onClick={() => setNote(note === i ? null : i)}
              hidden={n.x < pos - 2}
            >
              <Plus aria-hidden="true" strokeWidth={2.2} />
            </button>
          ))}
          <AnimatePresence>
            {note !== null && notes[note] && notes[note].x >= pos - 2 ? (
              <motion.div
                key={note}
                className="x-cmp__note"
                style={{ left: `${Math.min(notes[note].x, 70)}%`, top: `${notes[note].y}%` }}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong>{notes[note].title}</strong>
                <span>{notes[note].text}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="x-cmp__layer x-cmp__layer--top" aria-hidden="true">
          <Image src={hall.src} alt="" fill sizes="(min-width: 64rem) 90vw, 100vw" quality={80} className="object-cover" />
        </div>
        <span className="x-cmp__tag x-cmp__tag--l">
          <Landmark aria-hidden="true" strokeWidth={1.8} /> The classroom
        </span>
        <span className="x-cmp__tag x-cmp__tag--r">
          <Trees aria-hidden="true" strokeWidth={1.8} /> The field
        </span>
        <div className="x-cmp__divider" aria-hidden="true">
          <span className="x-cmp__knob">
            <ChevronsLeftRight strokeWidth={1.8} />
          </span>
        </div>
        <input
          type="range"
          className="x-cmp__range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Move between the lecture hall and the field"
        />
      </div>

      <div className="x-cmp__caps">
        <div className="x-cmp__cap" data-on={side !== "land" ? "" : undefined}>
          <p className="x-cmp__k">01 · The institutions</p>
          <p className="x-cmp__t">{field.text}</p>
          <p className="x-cmp__src">{hall.caption} Photograph from the GGY brochure.</p>
        </div>
        <div className="x-cmp__cap" data-on={side !== "hall" ? "" : undefined}>
          <p className="x-cmp__k">02 · The people</p>
          <p className="x-cmp__t">
            {policy.text} {cases.text}
          </p>
          <p className="x-cmp__src">{land.caption} Photograph from the GGY brochure.</p>
        </div>
      </div>
    </div>
  );
}
