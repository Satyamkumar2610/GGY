"use client";

import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { createHeroGL, type HeroGL } from "./hero-gl";

/** Waits for the hero photograph to decode, but never holds the opening long. */
function whenReady(img: HTMLImageElement | null, limit = 1100) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return Promise.race([
    new Promise<void>((done) => {
      img.addEventListener("load", () => done(), { once: true });
      img.addEventListener("error", () => done(), { once: true });
    }),
    new Promise<void>((done) => setTimeout(done, limit)),
  ]);
}

/**
 * Hero motion, owned by GSAP.
 *
 * Intro: the photograph resolves rather than fades. Where WebGL is available a
 * canvas draws it dark, grey and warped by flowing noise and lets it come up
 * like a print in the tray; otherwise the strips wipe open from below. Either
 * way the type arrives against that, in counterpoint — the title starting while
 * the image is still unresolved and landing as it settles.
 *
 * At rest the photograph tracks the pointer with a soft lens while the type
 * moves a little against it, which separates them in depth.
 *
 * Scroll (large screens): pinned and scrubbed. The words leave in order, the
 * title last; the photograph is gathered into a row of film frames, like a
 * contact sheet laid on a light table, which then tumbles away from the centre;
 * the three states rise on the page beneath and their prints drop in.
 */
export function HeroMotion() {
  useGSAP(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const q = gsap.utils.selector(hero);
    const mm = gsap.matchMedia();
    const announce = (opened: boolean) => window.dispatchEvent(new CustomEvent("ggy:hero", { detail: { opened } }));

    mm.add(MOTION_QUERIES.any, () => {
      const slatsEl = q("[data-hero-slats]")[0] as HTMLElement;
      const canvas = q("[data-hero-gl]")[0] as HTMLCanvasElement;
      const photo = slatsEl.querySelector("img");
      const title = q("[data-hero-title]")[0] as HTMLElement;
      const lede = q("[data-hero-lede]")[0] as HTMLElement;
      const typeEl = q("[data-hero-type]")[0] as HTMLElement;
      const intro = q("[data-intro]");
      const inners = q("[data-slat-inner]");
      const slats = q("[data-slat]");

      // Hidden before first paint: the opening starts from darkness, not from
      // the finished photograph.
      gsap.set(intro, { visibility: "visible" });
      gsap.set(slatsEl, { autoAlpha: 0 });
      gsap.set(q("[data-hero-bloom]"), { autoAlpha: 0 });
      gsap.set(q("[data-hero-grain]"), { opacity: 0 });

      // Everything in the type is split, so the intro animates lines while the
      // scrubbed sequence animates the blocks that hold them. Nothing is driven
      // by two timelines at once.
      const splits: SplitText[] = [];
      const lines = (el: Element | undefined) => {
        if (!(el instanceof HTMLElement) || !el.offsetParent) return [];
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        splits.push(split);
        return split.lines;
      };
      const labelLines = lines(q("[data-hero-label]")[0]);
      const titleLines = lines(title);
      const ledeLines = lines(lede);
      const captionLines = lines(q("[data-hero-caption]")[0]);

      let gl: HeroGL | null = null;
      let disposed = false;
      let tl: gsap.core.Timeline | null = null;

      // If the canvas ever gives up, the strips are already underneath it.
      const fallBackToSlats = () => {
        gsap.set(canvas, { opacity: 0 });
        gsap.set(slatsEl, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(inners, { scale: 1.06 });
      };

      whenReady(photo).then(() => {
        if (disposed) return;
        gl = photo ? createHeroGL(canvas, photo, hero, fallBackToSlats) : null;

        tl = gsap.timeline({ defaults: { ease: "land" } });

        if (gl) {
          gl.start();
          gsap.set(canvas, { opacity: 1 });
          tl.to(gl.u, { reveal: 1, duration: 2.7, ease: "swing" }, 0).to(gl.u, { scale: 1.06, duration: 3.1, ease: "expo.out" }, 0);
        } else {
          // Without a canvas the strips still open rather than fade.
          gsap.set(slatsEl, { autoAlpha: 1 });
          tl.fromTo(slats, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "swing", stagger: { each: 0.09, from: "center" } }, 0).fromTo(
            inners,
            { scale: 1.18 },
            { scale: 1.06, duration: 3.1, ease: "expo.out" },
            0,
          );
        }

        // The frame gathers its atmosphere as the image resolves.
        tl.fromTo(q("[data-hero-shade]"), { opacity: 0.3 }, { opacity: 1, duration: 2.4, ease: "swing" }, 0)
          .to(q("[data-hero-bloom]"), { autoAlpha: 1, duration: 2.6 }, 0.2)
          .to(q("[data-hero-grain]"), { opacity: 0.4, duration: 2 }, 0.4)
          // The type arrives against the resolving photograph, not after it.
          .from(labelLines, { yPercent: 110, duration: 1.1 }, 0.5)
          .from(titleLines, { yPercent: 112, duration: 1.55, stagger: 0.14 }, 0.55)
          .from(ledeLines, { yPercent: 112, duration: 1.3, stagger: 0.1 }, 1.2)
          .fromTo(q("[data-hero-links] a"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09 }, 1.5)
          .fromTo(q("[data-hero-cue]"), { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: 0.9 }, 1.95);
        if (captionLines.length) tl.from(captionLines, { autoAlpha: 0, duration: 1.4, stagger: 0.08 }, 1.6);

        // Hand the photograph back to the strips the moment scrolling starts;
        // the canvas draws the same framing, so the exchange is not visible.
        if (gl) {
          const layer = gl;
          let onCanvas = true;
          const swap = (toCanvas: boolean) => {
            if (toCanvas === onCanvas) return;
            onCanvas = toCanvas;
            if (toCanvas) layer.start();
            gsap.to(canvas, { opacity: toCanvas ? 1 : 0, duration: 0.3, ease: "none", onComplete: () => !toCanvas && layer.stop() });
            gsap.to(slatsEl, { autoAlpha: toCanvas ? 0 : 1, duration: 0.3, ease: "none" });
            gsap.to(layer.u, { light: toCanvas ? 1 : 0, duration: 0.3, ease: "none" });
          };
          ScrollTrigger.create({
            trigger: hero,
            start: "top top-=6",
            onEnter: () => swap(false),
            onLeaveBack: () => swap(true),
          });
        }
      });

      // The type drifts against the photograph, a little, the other way.
      let parallax: ((e: PointerEvent) => void) | null = null;
      if (window.matchMedia("(pointer: fine)").matches) {
        const xTo = gsap.quickTo(typeEl, "x", { duration: 1, ease: "power3" });
        const yTo = gsap.quickTo(typeEl, "y", { duration: 1, ease: "power3" });
        parallax = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * -16);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -9);
        };
        hero.addEventListener("pointermove", parallax, { passive: true });
      }

      return () => {
        disposed = true;
        if (parallax) hero.removeEventListener("pointermove", parallax);
        // revert, not kill: a killed `from` would leave its start values behind
        // for the next mount to read as the finished state.
        tl?.revert();
        gl?.destroy();
        splits.forEach((split) => split.revert());
      };
    });

    mm.add(MOTION_QUERIES.desktop, () => {
      hero.classList.add("is-sequenced");
      let opened = false;
      const slats = q("[data-slat]");
      const inners = q("[data-slat-inner]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Pins change the page height, so they must refresh before anything
          // positioned below them. Declaring a priority anywhere also switches
          // ScrollTrigger from creation order to page order for every trigger,
          // which matters here because the canvas hand-off below and the
          // page-wide reveals are both created after this one.
          refreshPriority: 2,
          onUpdate: (self) => {
            const next = self.progress > 0.5;
            if (next !== opened) {
              opened = next;
              announce(opened);
            }
          },
        },
      });

      tl
        // The words leave in reading order; the title goes last and furthest.
        .to(q("[data-hero-caption]"), { autoAlpha: 0, duration: 0.07 }, 0)
        .to(q("[data-hero-cue]"), { autoAlpha: 0, duration: 0.06 }, 0)
        .to(q("[data-hero-label]"), { y: -40, autoAlpha: 0, duration: 0.1, ease: "power2.in" }, 0)
        .to(q("[data-hero-lede]"), { y: -56, autoAlpha: 0, duration: 0.11, ease: "power2.in" }, 0.02)
        .to(q("[data-hero-links]"), { y: -48, autoAlpha: 0, duration: 0.11, ease: "power2.in" }, 0.035)
        .to(q("[data-hero-title]"), { y: -130, autoAlpha: 0, duration: 0.16, ease: "power2.in" }, 0.03)
        .to(q("[data-hero-shade]"), { autoAlpha: 0, duration: 0.16 }, 0.05)
        .to(q("[data-hero-bloom]"), { autoAlpha: 0, duration: 0.14 }, 0.05)
        .to(q("[data-hero-grain]"), { opacity: 0.15, duration: 0.3 }, 0.28)
        // Contact sheet: the photograph is gathered into a row of film frames,
        // which sit at slightly different heights, like loose frames on a table.
        .to(
          slats,
          {
            scaleY: (i: number) => 0.52 * (i % 2 ? 0.955 : 1),
            yPercent: (i: number) => (i % 2 ? 2.4 : -2.4),
            clipPath: "inset(0% 5.5% 0% 5.5%)",
            filter: (i: number) => (i % 2 ? "brightness(0.93)" : "brightness(1)"),
            duration: 0.26,
            ease: "swing",
          },
          0.08,
        )
        .to(inners, { scale: 1.15, duration: 0.26, ease: "swing" }, 0.08)
        // ...which then tumbles away from the centre outwards, and blurs with
        // the speed of the fall.
        .to(
          slats,
          {
            yPercent: 175,
            xPercent: (i: number) => (i - 2.5) * 5,
            rotation: (i: number) => (i - 2.5) * 2,
            duration: 0.26,
            ease: "power3.in",
            stagger: { each: 0.028, from: "center" },
          },
          0.38,
        )
        .to(inners, { filter: "blur(3px)", duration: 0.12, ease: "power2.in" }, 0.45)
        // The route is set on the page beneath.
        .from(q("[data-paper-line]"), { yPercent: 118, autoAlpha: 0, duration: 0.22, ease: "land", stagger: 0.05 }, 0.52)
        // Prints drop in from above and land with a small physical overshoot,
        // their shadows spreading as they settle.
        .from(
          q("[data-print]"),
          {
            y: () => -window.innerHeight * 1.15,
            rotation: (i: number) => [-26, 20, -16][i] ?? 0,
            duration: 0.28,
            ease: "back.out(1.4)",
            stagger: 0.055,
          },
          0.6,
        )
        .from(
          q("[data-print]"),
          {
            boxShadow: "0 6px 14px -10px rgb(20 18 16 / 0.4), 0 1px 2px rgb(20 18 16 / 0.05)",
            duration: 0.2,
            ease: "land",
            stagger: 0.055,
          },
          0.68,
        )
        .to({}, { duration: 0.1 });

      return () => {
        announce(false);
        hero.classList.remove("is-sequenced");
      };
    });

    return () => mm.revert();
  });
  return null;
}
