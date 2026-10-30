"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * The idea chapter, owned by GSAP. One timeline carries the whole arrival:
 * the statement rises line by line, and each brush mark sweeps
 * in behind the word it belongs to, so the marks read as written rather than
 * faded in. Separately, the photograph comes back
 * from two inks to colour as it reaches the reader.
 */
export function IdeaMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-idea]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      const claim = q("[data-idea-claim]")[0] as HTMLElement;
      const marks = q("[data-mark]");

      const claimLines = SplitText.create(claim, { type: "lines", mask: "lines" });

      gsap.set(marks, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "land" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      tl.from(claimLines.lines, { yPercent: 112, duration: 1.3, stagger: 0.11 }, 0)
        // Each mark is swept once its own line has settled.
        .to(marks, { scaleX: 1, duration: 0.72, ease: "power2.out", stagger: 0.16 }, 0.7);

      return () => {
        claimLines.revert();
      };
    });

    // The plate holds its two inks until the reader is with it.
    mm.add(MOTION_QUERIES.any, () => {
      const plate = q(".duotone")[0] as HTMLElement | undefined;
      if (!plate) return;
      const st = ScrollTrigger.create({
        trigger: plate,
        start: "top 62%",
        once: true,
        onEnter: () => plate.classList.add("is-colour"),
      });
      return () => {
        st.kill();
        plate.classList.remove("is-colour");
      };
    });

    return () => mm.revert();
  });
  return null;
}
