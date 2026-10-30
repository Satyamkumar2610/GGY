"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const crops = [
  { s: 1, x: 0, y: 0 },
  { s: 1.6, x: -19, y: 8 },
  { s: 1.9, x: 45, y: 15 },
  { s: 2.2, x: -48, y: -39 },
];

/**
 * Journey motion, owned by GSAP. The photograph is sticky rather than pinned —
 * the hero and the archive already pin, and a third would fight the scroll.
 *
 * When a stage reaches the middle of the screen the camera moves to that
 * stage's crop, its milestone fills, its number fills from outline, the
 * readout counts over and its frame in the strip lights up. Works in both
 * directions. The heading arrives on its own; the cards move with the scroll.
 */
export function JourneyMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-format]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      const title = root.querySelector<HTMLElement>("#format-title");
      const split = title ? SplitText.create(title, { type: "lines", mask: "lines" }) : null;

      const tl = gsap.timeline({
        defaults: { ease: "land" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      if (split) tl.from(split.lines, { yPercent: 112, duration: 1.2, stagger: 0.1 }, 0);

      // The programme components and the takeaways move with the scroll, in
      // the same language as the people and paths lists: each item slides in
      // along its row from alternate sides and settles as it reaches reading
      // height, rather than fading up once on its own clock.
      // Components sit in a ruled grid, so their contents move, not the cells.
      [...q("[data-component]"), ...q("[data-takeaway]")].forEach((el, i) => {
        gsap.fromTo(
          el.hasAttribute("data-component") ? el.children : el,
          { x: i % 2 ? 56 : -56, opacity: 0.2 },
          { x: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 65%", scrub: 0.6 } },
        );
      });

      return () => split?.revert();
    });

    mm.add(MOTION_QUERIES.desktop, () => {
      const camera = q("[data-journey-camera]")[0];
      const thumbs = q("[data-journey-thumb]") as HTMLElement[];
      const stages = q("[data-journey-stage]") as HTMLElement[];
      const readout = q("[data-journey-readout]")[0] as HTMLElement | undefined;
      let current = -1;

      const go = (i: number) => {
        if (i === current) return;
        current = i;
        const c = crops[i];
        gsap.to(camera, { xPercent: c.x, yPercent: c.y, scale: c.s, duration: 1.6, ease: "swing", overwrite: true });
        thumbs.forEach((t, k) => t.classList.toggle("is-active", k === i));
        stages.forEach((s, k) => s.classList.toggle("is-active", k === i));
        if (readout) {
          // The number turns over rather than cutting.
          gsap.timeline()
            .to(readout, { yPercent: -60, autoAlpha: 0, duration: 0.18, ease: "power2.in" })
            .add(() => {
              readout.textContent = String(i + 1).padStart(2, "0");
            })
            .fromTo(readout, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.32, ease: "land" });
        }
      };

      stages.forEach((stage, i) => {
        ScrollTrigger.create({ trigger: stage, start: "top 55%", end: "bottom 55%", onEnter: () => go(i), onEnterBack: () => go(i) });
      });
      go(0);

      return () => {
        thumbs.forEach((t) => t.classList.remove("is-active"));
        stages.forEach((s) => s.classList.remove("is-active"));
      };
    });

    return () => mm.revert();
  });
  return null;
}
