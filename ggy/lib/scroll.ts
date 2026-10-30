"use client";

type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: number | HTMLElement, o?: { offset?: number; duration?: number; immediate?: boolean }) => void };
const lenis = () => (typeof window === "undefined" ? undefined : (window as unknown as { __lenis?: LenisLike }).__lenis);

/** Pause and resume page scrolling (for dialogs). */
export function lockScroll(on: boolean) {
  const l = lenis();
  if (on) l?.stop();
  else l?.start();
  document.documentElement.style.overflow = on ? "hidden" : "";
}

/** Scroll smoothly to a position, through Lenis when it is running. */
export function scrollToY(y: number) {
  const l = lenis();
  if (l) l.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
