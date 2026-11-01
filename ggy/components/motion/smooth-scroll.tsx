"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth, inertial scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger
 * scrubs stay in step with it. Off when the visitor prefers reduced motion;
 * native scrolling is untouched on touch screens.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  // A new page starts at its top, whatever Lenis was doing on the last one.
  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (window.location.hash) return;
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.85,
      smoothWheel: true,
      autoRaf: false,
      anchors: { offset: -64 },
    });
    lenis.on("scroll", ScrollTrigger.update);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
  return null;
}
