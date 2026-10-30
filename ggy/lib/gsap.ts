"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);
  // House eases. "land": a long, soft deceleration for reveals.
  // "swing": symmetric, for scrubbed camera moves. Drops use back.out for a
  // small physical overshoot.
  CustomEase.create("land", "M0,0 C0.12,0.82 0.24,1 1,1");
  CustomEase.create("swing", "M0,0 C0.7,0 0.2,1 1,1");
}

export const MOTION_QUERIES = {
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  any: "(prefers-reduced-motion: no-preference)",
} as const;

export function headerOffset(): number {
  const h = document.querySelector<HTMLElement>("[data-site-header]");
  return h ? h.offsetHeight : 0;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
