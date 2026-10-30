"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The only page-wide motion, owned by GSAP. Everything is visible without it.
 * [data-reveal]   a photograph's frame opens upward once as it arrives, while the image settles from 1.2x.
 * [data-parallax] on large screens, a photograph drifts gently inside its fixed frame.
 * Headings and text blocks are deliberately not animated.
 */
export function PageMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((frame) => {
        const img = frame.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 85%", once: true } });
        tl.fromTo(frame, { clipPath: "inset(100% 0% 0% 0% round 1rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1rem)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9, ease: "land" }, 0.1);
      });
    });

    mm.add(MOTION_QUERIES.desktop, () => {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame) => {
        const media = frame.querySelector<HTMLElement>("[data-parallax-media]");
        if (!media) return;
        gsap.fromTo(media, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      });
    });

    // ScrollRefresh already refreshes once the fonts have loaded.
    return () => mm.revert();
  });
  return null;
}
