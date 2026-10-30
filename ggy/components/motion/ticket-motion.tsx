"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

/** The pass is dealt onto the page: it slides up, turns and settles with a small overshoot. The step line draws across. GSAP owns both. */
export function TicketMotion() {
  useGSAP(() => {
    const ticket = document.querySelector<HTMLElement>("[data-ticket]");
    const steps = document.querySelector<HTMLElement>(".steps");
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      if (ticket) {
        gsap.from(ticket, { y: 140, rotation: -5, autoAlpha: 0, duration: 1.4, ease: "back.out(1.3)", scrollTrigger: { trigger: ticket, start: "top 90%", once: true } });
      }
      if (steps) {
        gsap.fromTo(steps, { "--line": 0 }, { "--line": 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 80%", end: "bottom 60%", scrub: 1 } });
      }
    });
    return () => mm.revert();
  });
  return null;
}
