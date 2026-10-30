"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";

const REST_WDTH = 112;
const MIN_WDTH = 75; // the narrowest Anek goes

/**
 * The band's motion, owned by GSAP. A slow endless loop sideways; scrolling
 * hands it the reader's speed. Fast scrolling compresses the letters toward
 * Anek's narrowest width, leans them into the direction of travel and
 * speeds the loop, which then settles back. Scrolling up runs it backwards.
 */
export function BandMotion() {
  useGSAP(() => {
    const band = document.querySelector<HTMLElement>("[data-band]");
    const track = band?.querySelector<HTMLElement>("[data-band-track]");
    if (!band || !track) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.any, () => {
      // Two identical groups: moving the track by half its width is seamless.
      const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
      // Start deep into the repeats so running backwards never reaches the start.
      loop.totalTime(loop.duration() * 200);

      let dir = 1;
      const now = { speed: 1, wdth: REST_WDTH, lean: 0 };
      const aim = { speed: 1, wdth: REST_WDTH, lean: 0 };
      let written = { wdth: REST_WDTH, lean: 0 };

      const st = ScrollTrigger.create({
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction;
          const k = gsap.utils.clamp(0, 1, Math.abs(self.getVelocity()) / 2800);
          aim.speed = dir * (1 + k * 6);
          aim.wdth = REST_WDTH - k * (REST_WDTH - MIN_WDTH);
          aim.lean = -dir * k * 9;
        },
      });

      const tick = () => {
        // Follow the aim, and let the aim drift back to cruising.
        aim.speed += (dir - aim.speed) * 0.035;
        aim.wdth += (REST_WDTH - aim.wdth) * 0.05;
        aim.lean += (0 - aim.lean) * 0.05;
        now.speed += (aim.speed - now.speed) * 0.1;
        now.wdth += (aim.wdth - now.wdth) * 0.14;
        now.lean += (aim.lean - now.lean) * 0.14;
        loop.timeScale(now.speed);
        if (!st.isActive) return;
        // A width change re-lays the text; only write when it is visible.
        if (Math.abs(now.wdth - written.wdth) > 0.25 || Math.abs(now.lean - written.lean) > 0.05) {
          written = { wdth: now.wdth, lean: now.lean };
          band.style.setProperty("--wdth", now.wdth.toFixed(1));
          band.style.setProperty("--lean", `${now.lean.toFixed(2)}deg`);
        }
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        band.style.removeProperty("--wdth");
        band.style.removeProperty("--lean");
      };
    });

    return () => mm.revert();
  });
  return null;
}
