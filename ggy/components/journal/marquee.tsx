"use client";

import { Fragment, useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Star } from "./head";

/**
 * A line of names carried across the page. It drifts on its own, runs
 * faster and leans with the scroll, and rests under the pointer. The names
 * are read once; the repeat that makes the loop is hidden from assistive
 * tech. Still when the visitor prefers reduced motion.
 */
export function Marquee({ items, label, className = "" }: { items: ReactNode[]; label: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        const belt = root.current!.querySelector<HTMLElement>("[data-belt]")!;
        const run = gsap.to(belt, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
        const lean = gsap.quickTo(belt, "skewX", { duration: 0.5, ease: "power3" });
        // One ticker eases the belt's speed toward a target; scroll events
        // only set numbers. (It used to start two tweens per scroll event.)
        let boost = 0;
        let speed = 1;
        let resting = false;
        let active = false;
        const tick = () => {
          boost *= 0.94;
          const target = resting ? 0 : 1 + boost;
          speed += (target - speed) * 0.12;
          run.timeScale(speed);
        };
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            active = self.isActive;
            if (active) {
              run.play();
              gsap.ticker.add(tick);
            } else {
              run.pause();
              gsap.ticker.remove(tick);
            }
          },
          onUpdate: (self) => {
            const v = self.getVelocity();
            boost = Math.max(boost, Math.min(7, Math.abs(v) / 260));
            lean(gsap.utils.clamp(-9, 9, v / -260));
          },
        });
        const calm = () => lean(0);
        ScrollTrigger.addEventListener("scrollEnd", calm);
        const el = root.current!;
        const rest = () => (resting = true);
        const go = () => (resting = false);
        el.addEventListener("pointerenter", rest);
        el.addEventListener("pointerleave", go);
        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("scrollEnd", calm);
          el.removeEventListener("pointerenter", rest);
          el.removeEventListener("pointerleave", go);
          st.kill();
          run.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (hidden: boolean) => (
    <span className="j-marquee__row" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className="j-marquee__item">{it}</span>
          <Star />
        </Fragment>
      ))}
    </span>
  );

  return (
    <div ref={root} className={`j-marquee ${className}`} role="group" aria-label={label}>
      <div className="j-marquee__belt" data-belt>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
