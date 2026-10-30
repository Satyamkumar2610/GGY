"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The only page-wide motion, owned by GSAP. Everything is visible without it.
 * [data-reveal]   a photograph's frame opens upward once as it arrives, while the image settles from 1.2x.
 * [data-parallax] on large screens, a photograph drifts gently inside its fixed frame.
 * .gloss          the bar of reflected light crosses each glossed sheet as it passes through the window,
 *                 as if the page were moving beneath a fixed light.
 * Headings and text blocks never fade or rise in. The one heading that moves, the archive's,
 * changes width, as the band's letters do.
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

      document.querySelectorAll<HTMLElement>(".gloss").forEach((sheet) => {
        gsap.fromTo(
          sheet,
          { "--sheen": "-24%" },
          { "--sheen": "24%", ease: "none", scrollTrigger: { trigger: sheet, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
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
