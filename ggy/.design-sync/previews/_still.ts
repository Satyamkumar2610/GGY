// Preview cards are stills. The site designs a complete, motion-free state for
// every section (html:not(.js-motion) in the CSS, gsap.matchMedia gates in the
// components); reporting reduced motion here makes the cards render that state
// instead of the first frame of a scroll animation. Preview-only: designs built
// with the bundle keep the real motion.
type W = Window & { __ggyStill?: boolean };
if (typeof window !== "undefined" && !(window as W).__ggyStill) {
  (window as W).__ggyStill = true;
  const real = window.matchMedia.bind(window);
  window.matchMedia = ((q: string) => {
    if (!/prefers-reduced-motion/.test(q)) return real(q);
    const noop = () => {};
    return {
      matches: /:\s*reduce\b/.test(q),
      media: q,
      onchange: null,
      addListener: noop,
      removeListener: noop,
      addEventListener: noop,
      removeEventListener: noop,
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
}
export {};
