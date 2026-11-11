"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Motion for the server-rendered sections of the landing page, attached by
 * data attribute. Nothing here runs when the visitor prefers reduced motion:
 * the page is complete without it.
 */
export function LandingMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);

      // Headlines arrive line by line.
      q("[data-split]").forEach((h) => {
        gsap.from(h.children, {
          yPercent: 70,
          opacity: 0,
          rotate: 1.5,
          duration: 1.1,
          ease: "land",
          stagger: 0.09,
          scrollTrigger: { trigger: h, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      q("[data-rise]").forEach((n) => {
        gsap.from(n, { y: 34, opacity: 0, duration: 1, ease: "land", scrollTrigger: { trigger: n, start: "top 90%", toggleActions: "play none none none" } });
      });

      q("[data-pop]").forEach((n, i) => {
        gsap.from(n, {
          scale: 0.6,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
          ease: "back.out(2)",
          scrollTrigger: { trigger: n, start: "top 92%", toggleActions: "play none none none" },
        });
      });

      // The band: India's states draw themselves as the band crosses the screen.
      const band = document.querySelector(".lp-band");
      const draw = q<SVGPathElement>("[data-lp-draw]");
      if (band && draw.length) {
        gsap.set(draw, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.to(draw, {
          strokeDashoffset: 0,
          ease: "none",
          stagger: { each: 0.02, from: "random" },
          scrollTrigger: { trigger: band, start: "top 80%", end: "bottom 40%", scrub: 0.6 },
        });
      }

      q("[data-tile]").forEach((t, i) => {
        gsap.from(t, { y: 90, opacity: 0, duration: 1.2, delay: i * 0.12, ease: "land", scrollTrigger: { trigger: t, start: "top 92%", toggleActions: "play none none none" } });
      });
      q("[data-lp-parallax]").forEach((n) => {
        gsap.fromTo(n, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: n.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Come and see: the photograph opens from a rounded window to full bleed.
      const win = document.querySelector<HTMLElement>("[data-window]");
      if (win) {
        gsap.fromTo(
          win,
          { clipPath: "inset(9% 7% 9% 7% round 2.25rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: { trigger: ".lp-connect", start: "top 85%", end: "top 5%", scrub: true } },
        );
        gsap.fromTo("[data-window-img]", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".lp-connect", start: "top bottom", end: "bottom bottom", scrub: true } });
      }

      // Footer wordmark letters rise in a wave.
      const mark = document.querySelector(".lp-footer__mark");
      if (mark) {
        gsap.from(mark.children, {
          yPercent: 110,
          duration: 1.1,
          ease: "land",
          stagger: { each: 0.03 },
          scrollTrigger: { trigger: mark, start: "top 95%", toggleActions: "play none none none" },
        });
      }
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  });
  return null;
}
