"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/** The closing name rises from below the fold as the page ends. GSAP owns it. */
export function FooterMotion() {
  useGSAP(() => {
    const mark = document.querySelector<HTMLElement>("[data-footer-mark]");
    if (!mark) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      gsap.fromTo(mark.children, { yPercent: 100 }, { yPercent: 0, ease: "land", stagger: 0.08, scrollTrigger: { trigger: mark, start: "top bottom", end: "bottom bottom", scrub: 1.2 } });
    });
    return () => mm.revert();
  });
  return null;
}
