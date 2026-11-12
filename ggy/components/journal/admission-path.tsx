"use client";

import { useRef, useState, type CSSProperties } from "react";
import { BadgeCheck, CreditCard, FileSearch, Send, TrainFront, type LucideIcon } from "lucide-react";
import { admissionSteps } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";

const ICONS: LucideIcon[] = [Send, FileSearch, CreditCard, BadgeCheck, TrainFront];

/** A smooth curve through every point (Catmull-Rom, written as cubic Béziers). */
function curveThrough(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * The admission process as a climb: five stations rising from the
 * application to the Yatra itself. A track is laid through their badges as
 * the section is read, and a small train rides it to the last stop.
 */
export function AdmissionPath() {
  const root = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ w: 0, h: 0, d: "" });

  // The track is measured from the badges, so it meets them at any width.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem)", () => {
        const el = root.current!;
        const measure = () => {
          const box = el.getBoundingClientRect();
          const pts = gsap.utils.toArray<HTMLElement>("[data-badge]", el).map((b) => {
            const r = b.getBoundingClientRect();
            return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2] as [number, number];
          });
          setGeo({ w: box.width, h: box.height, d: curveThrough(pts) });
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => {
          ro.disconnect();
          setGeo({ w: 0, h: 0, d: "" });
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!geo.d) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const el = root.current!;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
        tl.fromTo("[data-track]", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 1 }, 0).to(
          "[data-train]",
          { motionPath: { path: "[data-track-path]", align: "[data-track-path]", alignOrigin: [0.5, 0.5], autoRotate: true }, ease: "none", duration: 1 },
          0,
        );
        // Each station lights as the train reaches it.
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 75%",
          end: "bottom 60%",
          onUpdate: (self) => {
            const reached = Math.round(self.progress * (steps.length - 1) + 0.15);
            steps.forEach((s, i) => s.toggleAttribute("data-lit", i <= reached && self.progress > 0.02));
          },
        });
        return () => {
          st.kill();
          steps.forEach((s) => s.setAttribute("data-lit", ""));
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [geo.d], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="x-climb">
      {geo.d ? (
        <svg className="x-climb__art" viewBox={`0 0 ${geo.w} ${geo.h}`} width={geo.w} height={geo.h} aria-hidden="true">
          <path d={geo.d} className="x-climb__bed" />
          <path d={geo.d} className="x-climb__sleepers" data-track />
          <path d={geo.d} className="x-climb__rail" data-track data-track-path />
          <g data-train className="x-climb__train">
            <rect x="-17" y="-8" width="34" height="16" rx="5" />
            <rect x="9" y="-5" width="6" height="10" rx="2" className="x-climb__lamp" />
            <rect x="-11" y="-4" width="5" height="8" rx="1.5" className="x-climb__win" />
            <rect x="-3" y="-4" width="5" height="8" rx="1.5" className="x-climb__win" />
          </g>
        </svg>
      ) : null}
      <ol className="x-climb__list">
        {admissionSteps.map((step, i) => {
          const Icon = ICONS[i] ?? Send;
          return (
            <li key={step.name} className="x-climb__step" data-step data-lit="" style={{ "--i": i } as CSSProperties}>
              <div className="x-card x-climb__card">
                <div className="x-climb__head">
                  <span className="x-climb__badge" data-badge>
                    <Icon aria-hidden="true" strokeWidth={1.6} />
                  </span>
                  <span className="x-climb__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="x-climb__name">{step.name}</h4>
                <p className="x-climb__text">
                  {step.text}
                  {step.note ? <NoteRef id={step.note} /> : null}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
