"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

// Where each word leaves for, as fractions of the window: two to the left,
// two to the right, none at the same speed or angle.
const EXITS = [
  { x: -0.55, y: -0.14 },
  { x: 0.6, y: -0.04 },
  { x: -0.62, y: 0.08 },
  { x: 0.5, y: 0.16 },
];

/**
 * The idea stage, owned by GSAP.
 * - Arriving: the window grows a little and the words close in on it from
 *   both sides, scrubbed to the scroll.
 * - Pinned: the window opens to the full screen while the photograph inside
 *   settles from a close crop, so the view seems to fall into the picture;
 *   the words are carried off to the edges, each at its own pace. Last, the
 *   photograph darkens just enough for its caption.
 */
export function ImmersionMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-immersion]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add({ motion: MOTION_QUERIES.any, narrow: "(max-width: 47.99rem)" }, (ctx) => {
      if (!ctx.conditions?.motion) return;
      const narrow = Boolean(ctx.conditions.narrow);
      const stage = q("[data-immersion-stage]")[0] as HTMLElement;
      const frame = q("[data-frame]")[0];
      const media = q(".immersion-media")[0];
      const words = q("[data-word]");
      const small = narrow ? "inset(30% 10% 30% 10%)" : "inset(26% 33% 26% 33%)";
      const smaller = narrow ? "inset(36% 18% 36% 18%)" : "inset(34% 41% 34% 41%)";
      // The brochure photograph is not large: crop into it less on phones,
      // where the window is narrow and the enlargement would show.
      const zoom = narrow ? { far: 1.25, near: 1.12 } : { far: 1.6, near: 1.4 };
      const vw = () => window.innerWidth;
      const vh = () => window.innerHeight;

      gsap
        .timeline({ scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: 0.8 } })
        .fromTo(frame, { clipPath: smaller }, { clipPath: small, ease: "none" }, 0)
        .fromTo(media, { scale: zoom.far }, { scale: zoom.near, ease: "none" }, 0)
        .from(words, { x: (i) => (i % 2 ? 1 : -1) * vw() * 0.22, ease: "power2.out", stagger: 0.06 }, 0);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=230%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // The second pin on the page: after the hero's, before the archive's.
            refreshPriority: 2,
          },
        })
        .to(q("[data-immersion-note]"), { autoAlpha: 0, duration: 0.15 }, 0)
        // Explicit starts, rendered lazily: the arrival above owns these
        // properties until the pin begins.
        .fromTo(frame, { clipPath: small }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut", immediateRender: false }, 0.05)
        .fromTo(media, { scale: zoom.near }, { scale: 1, duration: 1.1, ease: "power2.inOut", immediateRender: false }, 0.05)
        .fromTo(
          words,
          { x: 0, y: 0 },
          {
            immediateRender: false,
            x: (i) => EXITS[i % 4].x * vw(),
            y: (i) => EXITS[i % 4].y * vh(),
            duration: (i) => 0.75 + i * 0.07,
            ease: "power2.in",
          },
          0.12,
        )
        .to(words, { autoAlpha: 0, duration: 0.25, stagger: 0.05 }, 0.75)
        .fromTo(q("[data-scrim]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.05)
        .fromTo(q("[data-caption]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.15)
        .to({}, { duration: 0.25 });
    });

    return () => mm.revert();
  });
  return null;
}
