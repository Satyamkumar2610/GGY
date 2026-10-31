"use client";

import { itinerary8 } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The itinerary, owned by GSAP. On wide screens, as each day crosses the
 * reading line the plate turns to it: the day number and date roll over and
 * the stop lights up, while the route line fills with the scroll.
 */
export function ItineraryMotion() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-itinerary]");
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.desktop, () => {
      const dayEl = q("[data-itin-day]")[0] as HTMLElement;
      const dateEl = q("[data-itin-date]")[0] as HTMLElement;
      const stops = q("[data-itin-stop]") as HTMLElement[];
      const entries = q("[data-itin-entry]") as HTMLElement[];
      let current = -1;

      const show = (i: number) => {
        if (i === current) return;
        const dir = i > current ? 1 : -1;
        current = i;
        const d = itinerary8[i];
        stops.forEach((s, k) => s.setAttribute("data-state", k < i ? "past" : k === i ? "now" : "next"));
        entries.forEach((e, k) => e.toggleAttribute("data-now", k === i));
        gsap
          .timeline()
          .to([dayEl, dateEl], { yPercent: -60 * dir, autoAlpha: 0, duration: 0.18, ease: "power2.in" })
          .add(() => {
            dayEl.textContent = String(d.day).padStart(2, "0");
            dateEl.textContent = d.date;
          })
          .fromTo([dayEl, dateEl], { yPercent: 60 * dir }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out", stagger: 0.04 });
      };

      entries.forEach((entry, i) => {
        ScrollTrigger.create({ trigger: entry, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && show(i) });
      });
      show(0);

      // The route fills and the bead travels it, scrubbed to the days.
      const route = { trigger: q(".itin-days")[0], start: "top 55%", end: "bottom 55%", scrub: 0.4 };
      gsap.fromTo(q("[data-itin-progress]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: route });
      gsap.fromTo(q("[data-itin-stops]"), { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { ...route } });

      // Each day card glides up into its place as it arrives.
      entries.forEach((entry) => {
        gsap.fromTo(entry, { y: 70, rotate: 0.6 }, { y: 0, rotate: 0, ease: "none", scrollTrigger: { trigger: entry, start: "top bottom", end: "top 62%", scrub: 0.6 } });
      });
    });

    return () => mm.revert();
  });
  return null;
}
