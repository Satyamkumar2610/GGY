"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The page's transitions between grounds (see app/cinema.css).
 * (Acts own their motion: see components/journal/act.tsx.)
 *
 * [data-arch]  Stacked pages. As a section arrives, the one before it falls
 *              behind: it slows to half the scroll speed, so it seems to stay
 *              where it is, shrinks a little and dims, while the new section
 *              slides up over it with a shadow along its top edge, like a
 *              page laid on a pile.
 *
 * Transform and opacity only, on elements that already exist (plus one dim
 * layer per section); nothing is measured per frame. Without motion the
 * sections simply follow one another.
 */
export function CinemaMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      const made: HTMLElement[] = [];

      gsap.utils.toArray<HTMLElement>("[data-arch]").forEach((next) => {
        const prev = next.previousElementSibling as HTMLElement | null;
        // Only between two sections that sit side by side in the same flow.
        if (!prev || prev.tagName === "SCRIPT" || prev.offsetHeight < 200) return;

        const dim = document.createElement("i");
        dim.className = "stack-dim";
        dim.setAttribute("aria-hidden", "true");
        prev.append(dim);
        prev.classList.add("stack-prev");
        made.push(dim);

        // A transform on a section turns it into the containing block for
        // anything fixed inside it, which would break the pinned chapters
        // (the flight map, the stages, the photograph strip). So the page
        // below carries a transform only while it is actually being covered,
        // and none at all before that.
        const tl = gsap.timeline({
          defaults: { ease: "none", immediateRender: false },
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.4 },
          // The scrub eases in behind the scroll, so the reset waits for the
          // animation itself to come back to rest at its start.
          onUpdate: () => {
            if (tl.progress() === 0) gsap.set(prev, { clearProps: "transform" });
          },
        });
        tl
          .fromTo(prev, { y: 0, scale: 1 }, { y: () => window.innerHeight * 0.5, scale: 0.95, force3D: true }, 0)
          .fromTo(dim, { opacity: 0 }, { opacity: 1 }, 0);
      });

      return () => {
        made.forEach((d) => d.remove());
        document.querySelectorAll(".stack-prev").forEach((el) => el.classList.remove("stack-prev"));
      };
    });

    return () => mm.revert();
  });
  return null;
}
