"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * The page's three shared movements. Everything is in its final place
 * without them.
 * [data-settle]  a headline rises line by line out of a mask, once.
 * [data-rule]    a hairline draws from the left edge, once.
 * [data-ink]     a statement inks in word by word at the pace of the scroll.
 */
export function JournalMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      gsap.utils.toArray<HTMLElement>("[data-settle]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.9,
              ease: "land",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });

      ScrollTrigger.batch("[data-rule]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: 0.06, overwrite: true }),
      });
      gsap.set("[data-rule]", { scaleX: 0, transformOrigin: "left center" });

      gsap.utils.toArray<HTMLElement>("[data-ink]").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.22 },
              { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 55%", scrub: 0.5 } },
            ),
        });
      });
    });
    // The four words rise into place, one after another, as the band is crossed.
    // Transform and opacity only, so the scrub never re-lays-out the text.
    // They finish early: the next page starts to slide over the band once
    // its top passes the middle of the window (cinema-motion.tsx), so the
    // words must be in place while the band's foot is still in view.
    mm.add(MOTION_QUERIES.any, () => {
      gsap.fromTo(
        "[data-words] span",
        { yPercent: 45, opacity: 0.2 },
        { yPercent: 0, opacity: 1, ease: "none", stagger: 0.1, force3D: true, scrollTrigger: { trigger: "[data-words]", start: "top 100%", end: "top 78%", scrub: 0.4 } },
      );
    });

    // The Yatra at a glance: the five figures count up as the row arrives,
    // one after another, and count again under the pointer. The printed
    // figure ("1000+") is the target, so a figure is never left half-counted.
    mm.add(MOTION_QUERIES.any, () => {
      const row = document.querySelector<HTMLElement>(".j-stats");
      if (!row) return;
      const items = gsap.utils.toArray<HTMLElement>(".j-stats__item", row);
      const figs = items.map((item) => {
        const el = item.querySelector<HTMLElement>("[data-count]")!;
        const full = el.textContent ?? "";
        const to = parseInt(full, 10) || 0;
        const tail = full.replace(/^\d+/, "");
        const n = { v: to };
        const show = () => (el.textContent = `${Math.round(n.v)}${tail}`);
        const count = (duration: number, delay = 0) =>
          gsap.fromTo(n, { v: 0 }, { v: to, duration, delay, ease: "power3.out", onUpdate: show, overwrite: true });
        return { item, el, full, count };
      });
      gsap.set(figs.map((f) => f.el), { yPercent: 40, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: row,
        start: "top 85%",
        once: true,
        onEnter: () => {
          figs.forEach((f, i) => {
            gsap.to(f.el, { yPercent: 0, opacity: 1, duration: 0.9, delay: i * 0.12, ease: "land" });
            f.count(1.6, i * 0.12);
          });
        },
      });
      const hover = figs.map((f) => {
        const h = (e: PointerEvent) => e.pointerType === "mouse" && f.count(0.7);
        f.item.addEventListener("pointerenter", h);
        return h;
      });
      return () => {
        st.kill();
        figs.forEach((f, i) => {
          f.item.removeEventListener("pointerenter", hover[i]);
          f.el.textContent = f.full;
        });
      };
    });

    mm.add(MOTION_QUERIES.any, () => {
      // The field: the two photographs open outward from the gutter between them.
      const pair = document.querySelector("[data-pair]");
      if (pair) {
        const st = { trigger: pair, start: "top 82%", end: "top 30%", scrub: 0.5 };
        // The wipe ends outside the frame, so a print lifted under the
        // pointer is never cut off at its edge.
        gsap.fromTo("[data-pair-left]", { clipPath: "inset(-12% -12% -12% 100%)" }, { clipPath: "inset(-12% -12% -12% -12%)", ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-pair-right]", { clipPath: "inset(-12% 100% -12% -12%)" }, { clipPath: "inset(-12% -12% -12% -12%)", ease: "none", scrollTrigger: st });
      }

      // Nine days: the road fills and a bead walks it as the days are read.
      const ledger = document.querySelector<HTMLElement>("[data-ledger]");
      if (ledger) {
        const st = { trigger: ledger, start: "top 56%", end: "bottom 56%", scrub: 0.4, invalidateOnRefresh: true };
        gsap.fromTo("[data-ledger-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-ledger-bead]", { y: 0 }, { y: () => ledger.offsetHeight, ease: "none", scrollTrigger: st });
        gsap.utils.toArray<HTMLElement>("[data-day]", ledger).forEach((day) => {
          ScrollTrigger.create({ trigger: day, start: "top 56%", onEnter: () => day.setAttribute("data-passed", ""), onLeaveBack: () => day.removeAttribute("data-passed") });
        });
      }

      // The admission steps: the line draws across.
      const steps = document.querySelector("[data-steps-line]");
      if (steps) gsap.fromTo(steps, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 85%", end: "top 45%", scrub: 0.6 } });
    });

    // The proposed plan: its dashed line is laid out across the four days.
    mm.add(MOTION_QUERIES.desktop, () => {
      const dash = document.querySelector("[data-dash]");
      if (!dash) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-proposed]", start: "top 75%", end: "top 30%", scrub: 0.5 } });
      tl.fromTo(dash, { clipPath: "inset(-4px 100% -4px 0%)" }, { clipPath: "inset(-4px 0% -4px 0%)", ease: "none", duration: 1 }, 0).fromTo(
        "[data-proposed-day]",
        { opacity: 0.25 },
        { opacity: 1, ease: "none", stagger: 0.22, duration: 0.3 },
        0.05,
      );
    });
    return () => mm.revert();
  });
  return null;
}
