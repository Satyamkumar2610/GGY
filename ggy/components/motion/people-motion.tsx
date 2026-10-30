"use client";

import { gsap, MOTION_QUERIES, SplitText, useGSAP } from "@/lib/gsap";

/**
 * The people chapter, owned by GSAP. The heading rises, the count runs up from
 * zero, and the ledger fills in a line at a time — a roll of names being read
 * out rather than a block appearing. Scoped to the section so it does not
 * re-scan the page.
 */
export function PeopleMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-people]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      const title = root.querySelector<HTMLElement>("#people-title");
      const split = title ? SplitText.create(title, { type: "lines", mask: "lines" }) : null;

      const tl = gsap.timeline({ defaults: { ease: "land" }, scrollTrigger: { trigger: root, start: "top 72%", once: true } });
      if (split) tl.from(split.lines, { yPercent: 112, duration: 1.25, stagger: 0.1 }, 0);

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
          0.5,
        );
      }

      // A long list: a small per-row delay keeps the whole roll brisk.
      const rows = q("[data-people-row]");
      gsap.from(rows, {
        autoAlpha: 0,
        y: 18,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.03,
        scrollTrigger: { trigger: rows[0]?.parentElement ?? root, start: "top 88%", once: true },
      });

      return () => split?.revert();
    });

    return () => mm.revert();
  });
  return null;
}
