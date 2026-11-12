"use client";

import Image from "next/image";
import { useRef } from "react";
import { atlas, fit, INDIA_BOX, lerpCamera, project, type Camera } from "@/lib/atlas";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ArrowDownToLine, ArrowRight } from "lucide-react";

/**
 * What plays inside the map: the three states of the 9th edition, one after
 * another, each drifting slowly (CSS only: lp-hero__reel). Stands in for the
 * combined tourism film the brief asks for; swap in a <video> here when it exists.
 */
const REEL = [
  { src: "/images/ggy27/hero/gujarat-dandi.jpg", state: "Gujarat" },
  { src: "/images/ggy27/hero/maharashtra-gateway.jpg", state: "Maharashtra" },
  { src: "/images/ggy27/hero/goa-bom-jesus.jpg", state: "Goa" },
];

/** The brochure, as printed for the 2025 edition. */
const BROCHURE_HREF = "/docs/ggy-brochure.pdf";

/** A paper sheet the size of the world with India cut out of it. */
const SHEET = `M-100000,-100000H100000V100000H-100000Z${atlas.outline}`;

/** Where the camera dives: the interior of Maharashtra, far from any coast. */
const DIVE = project(76.2, 20.6);

/** The centre of the title block: central India, well inside every border. */
const TITLE_AT = project(77.6, 21.3);

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

const tf = (c: Camera) => `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${c.k.toFixed(5)})`;

/** Where the nav reads its ground: the same point landing-nav.tsx probes. */
const NAV_PROBE_Y = 34;

/**
 * The opening. India is a window cut in a cream sheet; through it, the three
 * states of the upcoming edition in turn. Scrolling dives the camera into Maharashtra until the
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
      const lift = el.querySelectorAll<HTMLElement>("[data-lift]");
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
        // The map stops short of the foot of the screen, leaving a clear strip
        // for the invitation centred beneath it.
        A = fit(INDIA_BOX, [narrow ? 16 : 40, narrow ? 96 : 84, W - (narrow ? 16 : 40), H - (narrow ? 120 : 108)]);
        const k = (Math.hypot(W, H) / 2 / DIVE_CLEARANCE) * 1.08;
        B = { k, x: W / 2 - DIVE[0] * k, y: H / 2 - DIVE[1] * k };
        // The title sits on the heart of the peninsula, sized to the map so it
        // can never spill past the coast.
        const mapW = (INDIA_BOX[2] - INDIA_BOX[0]) * A.k;
        stage.style.setProperty("--tx", `${(TITLE_AT[0] * A.k + A.x).toFixed(1)}px`);
        stage.style.setProperty("--ty", `${(TITLE_AT[1] * A.k + A.y).toFixed(1)}px`);
        stage.style.setProperty("--tw", `${(mapW * 0.52).toFixed(1)}px`);
      };

      const render = () => {
        const e = gsap.parseEase("sine.in")(t);
        const cam = lerpCamera(A, B, e, W / 2, H / 2);
        const s = tf(cam);
        sheet.forEach((p) => p.setAttribute("transform", s));
        coast.setAttribute("transform", s);
        coast.style.opacity = String(gsap.utils.clamp(0, 1, 1 - t / 0.55));
        cue.style.opacity = String(gsap.utils.clamp(0, 1, 1 - t / 0.15));
        const lt = Math.min(t / 0.4, 1);
        lift.forEach((g) => {
          g.style.transform = `translateY(${(-lt * H * 0.22).toFixed(1)}px)`;
          g.style.opacity = String(1 - lt);
        });
        // The sheet is fully outside the screen by the end; fade the last of it for safety.
        el.style.setProperty("--sheet", String(gsap.utils.clamp(0, 1, (1 - t) / 0.12)));
        img.style.setProperty("--zoom", (1.18 - 0.13 * t).toFixed(4));
        // What is behind the nav? Map the probe point back into the sheet's
        // own coordinates and ask the outline whether it lies inside India.
        // Pure geometry: the old elementsFromPoint() call forced a full
        // layout on every scroll frame and was the main cause of stutter.
        const px = (W / 2 - cam.x) / cam.k;
        const py = (NAV_PROBE_Y - cam.y) / cam.k;
        const onPaper = !coast.isPointInFill(new DOMPoint(px, py));
        const next = onPaper ? "dark" : "light";
        if (next !== tone) {
          tone = next;
          stage.dataset.nav = tone;
          stage.toggleAttribute("data-nav-bare", onPaper);
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

  return (
    <section ref={root} id="top" className="lp-hero" aria-labelledby="lp-hero-title">
      <h1 id="lp-hero-title" className="sr-only">
        Good Governance Yatra’ 27: India’s Oldest Immersive Yatra into Governance and Leadership.
      </h1>
      <div className="lp-hero__stage" data-stage data-nav="dark" data-nav-bare>
        <div className="lp-hero__lens">
          <div ref={photo} className="lp-hero__photo">
            <div className="lp-hero__zoom lp-hero__reel">
              {REEL.map((r, i) => (
                <div key={r.src} className="lp-hero__frame" style={{ "--i": i } as React.CSSProperties}>
                  <Image src={r.src} alt="" fill sizes="100vw" quality={82} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="lp-hero__tint" />
        </div>

        <svg className="lp-hero__svg" aria-hidden="true">

          <path data-sheet d={SHEET} fillRule="evenodd" className="lp-hero__sheet" />

          <path data-coast d={atlas.outline} className="lp-hero__coast" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="lp-hero__title" data-lift>
          <p data-intro className="lp-hero__name" aria-hidden="true">
            <span>Good Governance</span>
            <em>Yatra’ 27</em>
          </p>
          <p data-intro className="lp-hero__sub">India’s Oldest Immersive Yatra into Governance and Leadership</p>
        </div>

        <div className="lp-hero__cue" data-cue>
          <div className="lp-hero__cue-row">
            <span data-intro className="lp-chip">
              9th Edition: Gujarat - Maharashtra - Goa
            </span>
            <a data-intro href="#yatra" className="lp-pill lp-pill--crimson">
              Explore
            </a>
          </div>
        </div>
      </div>

      <div className="lp-hero__over">
        <div className="lp-hero__spacer" />
        <div id="yatra" className="lp-hero__second" data-nav="light">
          <h2 className="lp-hero__statement">
            <span>Learn governance</span> <span className="is-mid">and public policy</span> <span className="is-end">
              while <em>travelling</em>
            </span>
          </h2>
          <div className="lp-hero__intro">
            <p className="lp-hero__lede">
              Good Governance Yatra (GGY) is a premier 7-day immersive travel program designed for aspiring public leaders, policymakers, changemakers, and social entrepreneurs. This unique journey offers selected delegates the opportunity to witness transformative governance projects firsthand and engage with visionary policymakers shaping India’s future.
            </p>
            <div className="lp-hero__actions">
              <a href="#connect" className="lp-pill lp-pill--solid">
                Apply Now
                <ArrowRight aria-hidden="true" strokeWidth={1.8} />
              </a>
              <a href={BROCHURE_HREF} className="lp-pill lp-pill--ghost" download="Good-Governance-Yatra-Brochure.pdf">
                Download Brochure
                <ArrowDownToLine aria-hidden="true" strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
