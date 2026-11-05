"use client";

import Image from "next/image";
import { useRef } from "react";
import { atlas, fit, INDIA_BOX, lerpCamera, project, type Camera } from "@/lib/atlas";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { photos } from "@/content/ggy";

/** A paper sheet the size of the world with India cut out of it. */
const SHEET = `M-100000,-100000H100000V100000H-100000Z${atlas.outline}`;

/** Where the camera dives: the interior of Maharashtra, far from any coast. */
const DIVE = project(76.2, 20.6);

/** Distance from the dive point to the nearest point on the national outline. */
const DIVE_CLEARANCE = (() => {
  let min = Infinity;
  const re = /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(atlas.outline))) {
    const d = Math.hypot(+m[1] - DIVE[0], +m[2] - DIVE[1]);
    if (d < min) min = d;
  }
  return min;
})();

const STAR = "M14.4 0l2 11.9 11.3-4.2.4.6-9.3 7.7 9.3 7.7-.4.6-11.3-4.2-2 11.9h-.8l-2-11.9-11.3 4.2L0 23.7 9.3 16 0 8.3l.4-.6 11.3 4.2L13.7 0z";

const tf = (c: Camera) => `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${c.k.toFixed(5)})`;

/** The hero title, laid out once in its own 600-unit box so it scales with the map. */
function Title({ tone }: { tone: "cream" | "crimson" }) {
  return (
    <svg className={`lp-hero__type is-${tone}`} x="0" y="0" width="100%" height="100%" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" overflow="visible">
      <text x="300" y="250" textAnchor="middle" className="lp-hero__t1">
        THE GOOD
      </text>
      <text x="300" y="296" textAnchor="middle" className="lp-hero__t1">
        GOVERNANCE
      </text>
      <text x="300" y="346" textAnchor="middle" className="lp-hero__t2">
        Yatra
      </text>
      <text x="300" y="380" textAnchor="middle" className="lp-hero__t3">
        An immersive journey through the institutions,
      </text>
      <text x="300" y="398" textAnchor="middle" className="lp-hero__t3">
        people and ideas shaping India’s future.
      </text>
    </svg>
  );
}

/**
 * The opening. India is a window cut in a paper sheet; through it, the
 * Gateway of India. Scrolling dives the camera into Maharashtra until the
 * window is larger than the screen and the photograph is all that is left.
 */
export function LandingHero() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const stage = el.querySelector<HTMLElement>("[data-stage]")!;
      const sheet = el.querySelectorAll<SVGPathElement>("[data-sheet]");
      const coast = el.querySelector<SVGPathElement>("[data-coast]")!;
      const lift = el.querySelectorAll<SVGGElement>("[data-lift]");
      const deco = el.querySelector<SVGGElement>("[data-deco]")!;
      const cue = el.querySelector<HTMLElement>("[data-cue]")!;
      const img = photo.current!;

      let A: Camera = { k: 1, x: 0, y: 0 };
      let B: Camera = { k: 1, x: 0, y: 0 };
      let W = 0;
      let H = 0;
      let t = 0;
      let tone = "dark";

      const layout = () => {
        W = stage.clientWidth;
        H = stage.clientHeight;
        const narrow = W < 768;
        A = fit(INDIA_BOX, [narrow ? 16 : 40, narrow ? 96 : 84, W - (narrow ? 16 : 40), H - (narrow ? 120 : 36)]);
        const k = (Math.hypot(W, H) / 2 / DIVE_CLEARANCE) * 1.08;
        B = { k, x: W / 2 - DIVE[0] * k, y: H / 2 - DIVE[1] * k };
      };

      const render = () => {
        const e = gsap.parseEase("sine.in")(t);
        const cam = lerpCamera(A, B, e, W / 2, H / 2);
        const s = tf(cam);
        sheet.forEach((p) => p.setAttribute("transform", s));
        coast.setAttribute("transform", s);
        coast.style.opacity = String(gsap.utils.clamp(0, 1, 1 - t / 0.55));
        deco.style.opacity = String(gsap.utils.clamp(0, 1, 1 - t / 0.45));
        cue.style.opacity = String(gsap.utils.clamp(0, 1, 1 - t / 0.15));
        const lt = Math.min(t / 0.4, 1);
        lift.forEach((g) => {
          g.style.transform = `translateY(${(-lt * H * 0.22).toFixed(1)}px)`;
          g.style.opacity = String(1 - lt);
        });
        // The sheet is fully outside the screen by the end; fade the last of it for safety.
        el.style.setProperty("--sheet", String(gsap.utils.clamp(0, 1, (1 - t) / 0.12)));
        img.style.setProperty("--zoom", (1.18 - 0.13 * t).toFixed(4));
        const next = t > 0.8 ? "light" : "dark";
        if (next !== tone) {
          tone = next;
          stage.dataset.nav = tone;
          window.dispatchEvent(new Event("lp:tone"));
        }
      };

      layout();
      render();

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro: the coast draws itself, the photograph arrives, the title rises.
        const len = coast.getTotalLength();
        const intro = gsap.timeline({ defaults: { ease: "land" } });
        intro
          .fromTo(coast, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" })
          .fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.5)
          .fromTo(el.querySelectorAll(".lp-hero__type text"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.75)
          .fromTo(el.querySelectorAll("[data-intro]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.25);

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.65}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            layout();
            render();
          },
          onUpdate: (self) => {
            t = self.progress;
            render();
          },
        });

        // The photograph leans toward the pointer.
        const fine = window.matchMedia("(pointer: fine)").matches;
        const rx = gsap.quickTo(img, "rotationX", { duration: 1.2, ease: "power3" });
        const ry = gsap.quickTo(img, "rotationY", { duration: 1.2, ease: "power3" });
        const onMove = (ev: PointerEvent) => {
          rx(((ev.clientY / H) - 0.5) * -3);
          ry(((ev.clientX / W) - 0.5) * 4);
        };
        if (fine) stage.addEventListener("pointermove", onMove);
        return () => {
          st.kill();
          stage.removeEventListener("pointermove", onMove);
        };
      });

      const onResize = () => {
        layout();
        render();
      };
      window.addEventListener("resize", onResize);
      return () => {
        mm.revert();
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root },
  );

  const p = photos.gateway;
  return (
    <section ref={root} id="top" className="lp-hero" aria-labelledby="lp-hero-title">
      <h1 id="lp-hero-title" className="sr-only">
        The Good Governance Yatra. An immersive journey through the institutions, people and ideas shaping India’s future.
      </h1>
      <div className="lp-hero__stage" data-stage data-nav="dark">
        <div className="lp-hero__lens">
          <div ref={photo} className="lp-hero__photo">
            <div className="lp-hero__zoom">
              <Image src={p.src} alt="" fill sizes="100vw" quality={82} loading="eager" fetchPriority="high" className="object-cover" />
            </div>
          </div>
          <div className="lp-hero__tint" />
        </div>

        <svg className="lp-hero__svg" aria-hidden="true">
          <defs>
            <clipPath id="lp-sheet-clip" clipPathUnits="userSpaceOnUse">
              <path data-sheet d={SHEET} clipRule="evenodd" />
            </clipPath>
          </defs>

          {/* Seen through the window, over the photograph */}
          <g data-lift>
            <Title tone="cream" />
          </g>

          <path data-sheet d={SHEET} fillRule="evenodd" className="lp-hero__sheet" />

          {/* Drawn on the paper only */}
          <g clipPath="url(#lp-sheet-clip)">
            <g data-deco className="lp-hero__deco">
              <line x1="4%" y1="11%" x2="96%" y2="11%" />
              <line x1="4%" y1="94%" x2="96%" y2="94%" />
              <line x1="27%" y1="11%" x2="27%" y2="94%" />
              <line x1="50%" y1="11%" x2="50%" y2="94%" />
              <line x1="73%" y1="11%" x2="73%" y2="94%" />
              <line x1="4%" y1="52%" x2="96%" y2="52%" />
              <line x1="4%" y1="11%" x2="96%" y2="94%" className="is-faint" />
              <line x1="96%" y1="11%" x2="4%" y2="94%" className="is-faint" />
              <svg x="11%" y="52%" overflow="visible">
                <path d={STAR} transform="translate(-14 -16)" className="lp-hero__star" />
              </svg>
              <svg x="89%" y="52%" overflow="visible">
                <path d={STAR} transform="translate(-14 -16)" className="lp-hero__star" />
              </svg>
            </g>
            <g data-lift>
              <Title tone="crimson" />
            </g>
          </g>

          <path data-coast d={atlas.outline} className="lp-hero__coast" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="lp-hero__cue" data-cue>
          <span data-intro className="lp-chip">
            Upcoming edition · Gujarat, Maharashtra, Goa
          </span>
          <a data-intro href="#yatra" className="lp-pill lp-pill--crimson">
            Explore
          </a>
        </div>
      </div>

      <div className="lp-hero__over">
        <div className="lp-hero__spacer" />
        <div id="yatra" className="lp-hero__second" data-nav="light">
          <h2 className="lp-hero__statement">
            <span>We learn</span> <span className="is-mid">governance</span> <span className="is-end">
              where it <em>happens</em>
            </span>
          </h2>
          <div className="lp-hero__body">
            <p>The Good Governance Yatra is an immersive programme for aspiring public leaders, policymakers, changemakers and impact creators.</p>
            <p>Delegates travel to see governance projects first-hand and to meet the people who run them, state by state.</p>
            <p>The upcoming edition moves through Gujarat, Maharashtra and Goa. Dates and stops are still to be announced.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
