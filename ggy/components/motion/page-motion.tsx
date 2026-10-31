"use client";

import { gsap, MOTION_QUERIES, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Page-wide motion, owned by GSAP. Everything is visible without it.
 * [data-reveal]   a photograph's frame opens upward once as it arrives, while the image settles from 1.2x.
 * [data-parallax] on large screens, a photograph drifts gently inside its fixed frame.
 * [data-drift]    a chapter title is set in sheared lines: alternate lines enter from opposite sides,
 *                 meet as the title reaches the upper part of the window, and part again, more
 *                 slowly, as it leaves. Scrubbed, so the type is always exactly where the scroll is.
 * [data-draw]     an SVG path with pathLength=1 draws itself with the scroll.
 * [data-ground-reveal] a coloured ground opens from inset to full bleed as it arrives.
 * [data-row]      a ruled row rises into place once as its list reaches the reader.
 */
export function PageMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((frame) => {
        const img = frame.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 85%", once: true } });
        tl.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9, ease: "land" }, 0.1);
      });

      // Linework that draws itself with the scroll.
      document.querySelectorAll<SVGPathElement>("[data-draw]").forEach((path, i) => {
        const svg = path.ownerSVGElement ?? path;
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: svg, start: `top ${85 - i * 6}%`, end: "center 45%", scrub: 0.8 } },
        );
      });

      // Coloured grounds open out of the paper rather than cutting in: the
      // ground starts inset from the page edges and widens to full bleed.
      document.querySelectorAll<HTMLElement>("[data-ground-reveal]").forEach((ground) => {
        gsap.fromTo(
          ground,
          { clipPath: "inset(0% 5% 0% 5%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ground, start: "top bottom", end: "top 25%", scrub: 0.6 } },
        );
      });

      // Ruled rows arrive one after another as their list reaches the reader.
      document.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        gsap.from(row, { opacity: 0, y: 28, duration: 1, ease: "land", scrollTrigger: { trigger: row, start: "top 88%", once: true } });
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

      // The terrain under each chapter turns and slides slowly against the
      // scroll, so the glass above it seems to float.
      document.querySelectorAll<SVGGElement>("[data-contours]").forEach((g, i) => {
        const svg = g.ownerSVGElement;
        if (!svg) return;
        const dir = i % 2 ? 1 : -1;
        gsap.fromTo(
          g,
          { y: -70, rotation: -4 * dir, svgOrigin: "800 500" },
          { y: 70, rotation: 4 * dir, ease: "none", scrollTrigger: { trigger: svg.parentElement, start: "top bottom", end: "bottom top", scrub: 1.5 } },
        );
      });
    });

    // ScrollRefresh already refreshes once the fonts have loaded.
    return () => mm.revert();
  });
  return null;
}
