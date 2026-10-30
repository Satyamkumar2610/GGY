"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A hairline across the top of the window that fills as the page is read. */
export function ScrollProgress() {
  useGSAP(() => {
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (!bar) return;
    const set = gsap.quickSetter(bar, "scaleX");
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => set(self.progress) });
    return () => st.kill();
  });
  return <div aria-hidden="true" className="scroll-progress" data-scroll-progress />;
}
