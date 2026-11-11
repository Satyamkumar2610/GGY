"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** The stations of the page, in order: a section's id and the name shown beside the bead. */
const STATIONS: [string, string][] = [
  ["band", "Departure"],
  ["field", "The field"],
  ["journey", "The route"],
  ["editions", "What is confirmed"],
  ["learning", "How it runs"],
  ["archive", "A decade"],
  ["itinerary", "Nine days"],
  ["gallery", "Photographs"],
  ["people", "People"],
  ["after", "Afterwards"],
  ["questions", "Questions"],
  ["connect", "Joining"],
];

/**
 * The thread: a fine line in the left margin that the whole page is strung
 * on. A bead travels it as the page is read, stretching a little with the
 * speed of the scroll, and names the stretch of the journey in view. Wide
 * screens only; it carries no information the page does not.
 */
export function Thread() {
  const root = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem)", () => {
        const el = root.current!;
        const bead = el.querySelector<HTMLElement>("[data-bead]")!;
        const track = el.querySelector<HTMLElement>("[data-track]")!;
        const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", el);
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stretch = gsap.quickTo(bead, "scaleY", { duration: 0.35, ease: "power3" });
        const sections = STATIONS.map(([id]) => document.querySelector<HTMLElement>(`[data-j-station="${id}"]`));

        // Each tick sits where its section starts, as a share of the page.
        const place = () => {
          const max = ScrollTrigger.maxScroll(window) || 1;
          ticks.forEach((t, i) => {
            const s = sections[i];
            if (s) t.style.top = `${Math.min(1, (s.getBoundingClientRect().top + window.scrollY) / max) * 100}%`;
          });
        };
        place();
        ScrollTrigger.addEventListener("refresh", place);

        const whole = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            gsap.set(bead, { y: self.progress * track.offsetHeight });
            if (!calm) stretch(1 + Math.min(2.2, Math.abs(self.getVelocity()) / 1400));
          },
        });
        const settle = () => stretch(1);
        ScrollTrigger.addEventListener("scrollEnd", settle);

        // The station in view, and whether the ground under the thread is dark.
        const sts = sections.map((s, i) =>
          s
            ? ScrollTrigger.create({
                trigger: s,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => {
                  if (!self.isActive) return;
                  setAt(i);
                  el.dataset.tone = s.matches(".on-dark, .on-dark *") || s.classList.contains("on-dark") ? "light" : "dark";
                },
              })
            : null,
        );
        // The thread appears once the opening is behind the reader.
        const show = ScrollTrigger.create({
          trigger: sections[0] ?? document.body,
          start: "top 60%",
          onToggle: (self) => el.toggleAttribute("data-on", self.isActive || self.progress === 1),
          end: "max",
        });
        return () => {
          ScrollTrigger.removeEventListener("refresh", place);
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          whole.kill();
          show.kill();
          sts.forEach((s) => s?.kill());
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="j-thread" aria-hidden="true" data-tone="light">
      <div className="j-thread__track" data-track>
        {STATIONS.map(([id]) => (
          <i key={id} className="j-thread__tick" data-tick />
        ))}
        <i className="j-thread__bead" data-bead />
      </div>
      <p className="j-thread__name" key={at}>
        {STATIONS[at][1]}
      </p>
    </div>
  );
}
