"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/**
 * The people chapter's opening, owned by GSAP: the count runs up from zero as
 * the chapter arrives. The heading drifts with the page (data-drift) and the
 * roll animates itself.
 */
export function PeopleMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-people]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 72%", once: true } });

      const count = q("[data-people-count]")[0] as HTMLElement | undefined;
      if (count) {
        const target = Number(count.textContent);
        const n = { v: 0 };
        tl.to(
          n,
          {
            v: target,
            duration: 1.8,
            ease: "expo.out",
            onUpdate: () => {
              count.textContent = String(Math.round(n.v));
            },
          },
          0.2,
        );
      }
    });

    return () => mm.revert();
  });
  return null;
}
