"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { PageSentinel, usePageRoot } from "./page-root";

/** The registration page is laid on the desk: it rises and settles. The step line draws across. GSAP owns both. */
export function TicketMotion() {
  const page = usePageRoot();
  useGSAP(() => {
    const ticket = page.root().querySelector<HTMLElement>("[data-register]");
    const steps = page.root().querySelector<HTMLElement>(".steps");
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      if (ticket) {
        gsap.from(ticket, { y: 70, rotation: -1.2, autoAlpha: 0, duration: 1.3, ease: "land", scrollTrigger: { trigger: ticket, start: "top 90%", once: true } });
      }
      if (steps) {
        gsap.fromTo(steps, { "--line": 0 }, { "--line": 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 80%", end: "bottom 60%", scrub: 1 } });
      }
    });
    return () => mm.revert();
  });
  return <PageSentinel innerRef={page.ref} />;
}
