"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The page's transitions between acts and grounds (see app/cinema.css).
 * (Acts own their motion: see components/journal/act.tsx.)
 * [data-arch]  the next ground rises over the last as a dome and flattens.
 * Everything is complete and still without it.
 */
export function CinemaMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      // The dome is a real element animated by transform alone. It used to be
      // a ::after driven by a custom property on the section, which made the
      // browser restyle every node in the section on every scroll frame.
      const domes = gsap.utils.toArray<HTMLElement>("[data-arch]").map((ground) => {
        const dome = document.createElement("i");
        dome.className = "arch-dome";
        dome.setAttribute("aria-hidden", "true");
        ground.prepend(dome);
        gsap.fromTo(
          dome,
          { scaleY: 1 },
          { scaleY: 0, ease: "power1.in", force3D: true, scrollTrigger: { trigger: ground, start: "top bottom", end: "top 30%", scrub: 0.5 } },
        );
        return dome;
      });
      return () => domes.forEach((d) => d.remove());
    });

    return () => mm.revert();
  });
  return null;
}
