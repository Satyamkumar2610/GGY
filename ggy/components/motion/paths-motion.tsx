"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The alumni paths, owned by GSAP. Each path is ruled off as it comes up the
 * screen and its name slides in from alternate sides along the rule, both
 * scrubbed to the scroll.
 */
export function PathsMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-paths]");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      gsap.utils.toArray<HTMLElement>("[data-path]", root).forEach((row, i) => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: row, start: "top bottom", end: "top 62%", scrub: 0.6 } })
          .fromTo(row.querySelector("[data-path-rule]"), { scaleX: 0 }, { scaleX: 1 }, 0)
          .fromTo(row.querySelector("[data-path-name]"), { x: i % 2 ? 80 : -80, opacity: 0.25 }, { x: 0, opacity: 1 }, 0);
      });
    });
    return () => mm.revert();
  });
  return null;
}
