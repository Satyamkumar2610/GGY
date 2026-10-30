"use client";

import { gsap, MOTION_QUERIES, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-wide motion, owned by GSAP. Everything is visible without it.
 * [data-reveal]   a photograph's frame opens upward once as it arrives, while the image settles from 1.2x.
 * [data-parallax] on large screens, a photograph drifts gently inside its fixed frame.
 * [data-drift]    a chapter title is set in sheared lines: alternate lines enter from opposite sides,
 *                 meet as the title reaches the upper part of the window, and part again, more
 *                 slowly, as it leaves. Scrubbed, so the type is always exactly where the scroll is.
 * .gloss          the bar of reflected light crosses each lit ground as it passes through the window,
 *                 as if the page were moving beneath a fixed light.
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

      document.querySelectorAll<HTMLElement>(".gloss").forEach((ground) => {
        gsap.fromTo(
          ground,
          { "--sheen": "-24%" },
          { "--sheen": "24%", ease: "none", scrollTrigger: { trigger: ground, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });

      document.querySelectorAll<HTMLElement>("[data-drift]").forEach((title) => {
        SplitText.create(title, {
          type: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // Wider screens shear further; the first line travels furthest.
            const reach = (i: number) => (i % 2 ? 1 : -1) * Math.min(window.innerWidth * 0.14, 220) * (1 - i * 0.18);
            const tl = gsap.timeline({
              scrollTrigger: { trigger: title, start: "top bottom", end: "bottom top", scrub: 0.9, invalidateOnRefresh: true },
            });
            self.lines.forEach((line, i) => {
              tl.fromTo(line, { x: () => reach(i) }, { x: 0, ease: "power2.out", duration: 0.55 }, 0).to(
                line,
                { x: () => -reach(i) * 0.35, ease: "power1.in", duration: 0.45 },
                0.55,
              );
            });
            return tl;
          },
        });
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
