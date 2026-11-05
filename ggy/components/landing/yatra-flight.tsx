"use client";

import Image from "next/image";
import { useRef } from "react";
import { atlas, atLeast, fit, formatCoords, invert, lerpCamera, project, stateByIso, unionBox, type Box, type Camera } from "@/lib/atlas";
import { gsap, useGSAP } from "@/lib/gsap";
import { photos, stateDossiers, upcoming, type PhotoKey } from "@/content/ggy";
import { STATE_TEXTURE } from "@/components/atlas/atlas-map";

type Pt = [number, number];

/** Editorial order, north to south. Not the confirmed order of travel. */
const ORDER = ["IN-GJ", "IN-MH", "IN-GA"] as const;
const CITY: Record<(typeof ORDER)[number], { name: string; pt: Pt }> = {
  "IN-GJ": { name: "Gandhinagar", pt: atlas.points.Gandhinagar as Pt },
  "IN-MH": { name: "Mumbai", pt: atlas.points.Mumbai as Pt },
  "IN-GA": { name: "Panaji", pt: atlas.points.Panaji as Pt },
};
const CARD_PHOTO: Record<(typeof ORDER)[number], PhotoKey> = { "IN-GJ": "sabarmati", "IN-MH": "highCourt", "IN-GA": "bomJesus" };

const STOPS = ORDER.map((iso, i) => {
  const d = stateDossiers.find((s) => s.iso === iso)!;
  const u = upcoming.states.find((s) => s.name === d.name)!;
  const geo = stateByIso(iso)!;
  return {
    iso,
    i,
    name: d.name,
    native: u.native,
    lang: u.lang,
    intro: d.intro,
    facts: d.facts.filter((f) => !f.term.startsWith("Capital")),
    editions: d.editions,
    photo: photos[CARD_PHOTO[iso]],
    city: CITY[iso],
    geo,
  };
});

/** Smooth curve through points (Catmull-Rom as cubic Béziers). */
function curve(p: Pt[]) {
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(i - 1, 0)];
    const b = p[i];
    const c = p[i + 1];
    const e = p[Math.min(i + 2, p.length - 1)];
    const c1: Pt = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2: Pt = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${c[0]},${c[1]}`;
  }
  return d;
}

// The line follows the main roads for its shape only: via Vadodara and Surat
// to Mumbai, then over the Ghats by Pune and Kolhapur to Panaji. None of
// these are announced stops.
const LEG1 = curve([CITY["IN-GJ"].pt, project(73.18, 22.31), project(72.83, 21.17), CITY["IN-MH"].pt]);
const LEG2 = curve([CITY["IN-MH"].pt, project(73.86, 18.52), project(74.24, 16.7), CITY["IN-GA"].pt]);

const grow = (b: Box | number[], f: number): Box => {
  const cx = (b[0] + b[2]) / 2;
  const cy = (b[1] + b[3]) / 2;
  const w = ((b[2] - b[0]) * f) / 2;
  const h = ((b[3] - b[1]) * f) / 2;
  return [cx - w, cy - h, cx + w, cy + h];
};

const OVERVIEW = grow(unionBox(ORDER), 1.12);
const STATE_BOX = {
  "IN-GJ": grow(stateByIso("IN-GJ")!.bounds, 1.1),
  "IN-MH": grow(stateByIso("IN-MH")!.bounds, 1.06),
  "IN-GA": atLeast(stateByIso("IN-GA")!.bounds as Box, 150),
};

const context = atlas.states.filter((s) => !ORDER.includes(s.iso as (typeof ORDER)[number]));

const LEGS = ["Gujarat", "Gujarat to Maharashtra", "Maharashtra", "Maharashtra to Goa", "Goa", "Gujarat · Maharashtra · Goa"];

/** Where each station sits in the scroll, for the rail's buttons. */
const STATION_AT = [0.14, 0.5, 0.83];

const clamp01 = gsap.utils.clamp(0, 1);
const swing = (x: number) => gsap.parseEase("power2.inOut")(clamp01(x));

/**
 * The journey, flown. A pinned map of western India: the camera settles on
 * Gujarat, follows a line south to Maharashtra, then on to Goa. Each state
 * fills with its photograph as the marker reaches it, and its card comes up.
 */
export function YatraFlight() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const svg = el.querySelector<SVGSVGElement>("[data-map]")!;
      const cam = el.querySelector<SVGGElement>("[data-cam]")!;
      const legs = [el.querySelector<SVGPathElement>("[data-leg='0']")!, el.querySelector<SVGPathElement>("[data-leg='1']")!];
      const cases = [el.querySelector<SVGPathElement>("[data-case='0']")!, el.querySelector<SVGPathElement>("[data-case='1']")!];
      const ghosts = el.querySelectorAll<SVGPathElement>("[data-ghost]");
      const lit = ORDER.map((iso) => el.querySelector<SVGGElement>(`[data-lit='${iso}']`)!);
      const pins = ORDER.map((iso) => el.querySelector<HTMLElement>(`[data-pin='${iso}']`)!);
      const names = ORDER.map((iso) => el.querySelector<HTMLElement>(`[data-name='${iso}']`)!);
      const marker = el.querySelector<HTMLElement>("[data-marker]")!;
      const coords = el.querySelector<HTMLElement>("[data-coords]")!;
      const leg = el.querySelector<HTMLElement>("[data-legname]")!;
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      const fill = el.querySelector<HTMLElement>("[data-fill]")!;
      const stations = Array.from(el.querySelectorAll<HTMLElement>("[data-station]"));

      svg.removeAttribute("viewBox");
      const L = legs.map((p) => p.getTotalLength());
      const Ltot = L[0] + L[1];
      stations.forEach((s, i) => s.style.setProperty("--at", String(i === 0 ? 0 : i === 1 ? L[0] / Ltot : 1)));

      let W = 0;
      let H = 0;
      let C0: Camera, CG: Camera, CM: Camera, CA: Camera;
      const layout = () => {
        W = svg.clientWidth;
        H = svg.clientHeight;
        let f: Box;
        if (el.classList.contains("is-static")) {
          f = [W * 0.06, H * 0.3, W * 0.94, H * 0.96];
        } else if (W < 768) {
          const head = el.querySelector<HTMLElement>(".lp-flight__head")!;
          const panel = el.querySelector<HTMLElement>(".lp-flight__panel")!;
          f = [52, head.offsetTop + head.offsetHeight + 18, W - 24, panel.offsetTop - 18];
        } else {
          // Fit between the heading's left edge and the card panel, below the heading.
          const head = el.querySelector<HTMLElement>(".lp-flight__head")!;
          const panel = el.querySelector<HTMLElement>(".lp-flight__panel")!;
          const top = head.offsetTop + head.offsetHeight + 28;
          f = [head.offsetLeft + 24, top, panel.offsetLeft - Math.max(40, W * 0.04), H - 96];
        }
        C0 = fit(OVERVIEW, f);
        CG = fit(STATE_BOX["IN-GJ"], f);
        CM = fit(STATE_BOX["IN-MH"], f);
        CA = fit(STATE_BOX["IN-GA"], f);
      };

      const toScreen = (c: Camera, p: DOMPoint | Pt) => {
        const x = "x" in p ? p.x : p[0];
        const y = "y" in p ? p.y : p[1];
        return [x * c.k + c.x, y * c.k + c.y] as const;
      };
      const place = (node: HTMLElement, x: number, y: number) => {
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      };

      /**
       * Travel between two framed cameras with the marker gliding on a straight
       * screen line from where it sat in the first frame to where it lands in
       * the second, zoom interpolated geometrically. The map moves under it.
       */
      const follow = (a: Camera, b: Camera, from: Pt, to: Pt, pt: DOMPoint, s: number): Camera => {
        const k = a.k * Math.pow(b.k / a.k, s);
        const sx = from[0] * a.k + a.x + (to[0] * b.k + b.x - (from[0] * a.k + a.x)) * s;
        const sy = from[1] * a.k + a.y + (to[1] * b.k + b.y - (from[1] * a.k + a.y)) * s;
        return { k, x: sx - pt.x * k, y: sy - pt.y * k };
      };

      let active = -1;
      let legIdx = -1;
      let lastCoords = "";
      let progress = 0;

      const render = () => {
        const p = progress;
        const cx = W / 2;
        const cy = H / 2;
        let c: Camera;
        let u1 = 0;
        let u2 = 0;
        let card = 0;
        let li = 0;
        if (p < 0.08) {
          c = lerpCamera(C0, CG, swing(p / 0.08), cx, cy);
        } else if (p < 0.2) {
          c = CG;
        } else if (p < 0.44) {
          const s = swing((p - 0.2) / 0.24);
          u1 = s;
          c = follow(CG, CM, CITY["IN-GJ"].pt, CITY["IN-MH"].pt, legs[0].getPointAtLength(L[0] * s), s);
          card = s > 0.94 ? 1 : 0;
          li = s > 0.94 ? 2 : 1;
        } else if (p < 0.56) {
          u1 = 1;
          c = CM;
          card = 1;
          li = 2;
        } else if (p < 0.78) {
          const s = swing((p - 0.56) / 0.22);
          u1 = 1;
          u2 = s;
          c = follow(CM, CA, CITY["IN-MH"].pt, CITY["IN-GA"].pt, legs[1].getPointAtLength(L[1] * s), s);
          card = s > 0.94 ? 2 : 1;
          li = s > 0.94 ? 4 : 3;
        } else if (p < 0.88) {
          u1 = u2 = 1;
          c = CA;
          card = 2;
          li = 4;
        } else {
          const s = swing((p - 0.88) / 0.12);
          u1 = u2 = 1;
          c = lerpCamera(CA, C0, s, cx, cy);
          card = s > 0.5 ? 3 : 2;
          li = s > 0.5 ? 5 : 4;
        }

        cam.setAttribute("transform", `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${c.k.toFixed(5)})`);
        // Strokes keep their screen width while the camera zooms.
        legs.forEach((path, i) => {
          const u = i === 0 ? u1 : u2;
          const dash = `${L[i]} ${L[i]}`;
          const off = String(L[i] * (1 - u));
          path.style.strokeWidth = String(4 / c.k);
          path.style.strokeDasharray = dash;
          path.style.strokeDashoffset = off;
          cases[i].style.strokeWidth = String(9 / c.k);
          cases[i].style.strokeDasharray = dash;
          cases[i].style.strokeDashoffset = off;
        });
        ghosts.forEach((g) => {
          g.style.strokeWidth = String(2 / c.k);
          g.style.strokeDasharray = `${1.5 / c.k} ${9 / c.k}`;
        });

        const reached = [p >= 0.04, u1 >= 0.985, u2 >= 0.985];
        reached.forEach((on, i) => {
          lit[i].classList.toggle("is-lit", on);
          pins[i].classList.toggle("is-reached", on);
          names[i].classList.toggle("is-on", on);
        });

        ORDER.forEach((iso, i) => {
          const [x, y] = toScreen(c, CITY[iso].pt);
          place(pins[i], x, y);
          const g = STOPS[i].geo;
          const [nx, ny] = toScreen(c, [g.cx, g.cy]);
          place(names[i], nx + (iso === "IN-GA" ? 30 : iso === "IN-GJ" ? -40 : 0), ny + (iso === "IN-GJ" ? -18 : 0));
        });

        // The marker rides the leg in progress.
        const onLeg2 = u2 > 0;
        const path = onLeg2 ? legs[1] : legs[0];
        const pt = path.getPointAtLength((onLeg2 ? L[1] * u2 : L[0] * u1) || 0);
        const [mx, my] = toScreen(c, pt);
        place(marker, mx, my);
        marker.classList.toggle("is-on", p > 0.03 && p < 0.9);
        const ll = invert(pt.x, pt.y);
        if (ll) {
          const s = formatCoords(ll[0], ll[1]);
          if (s !== lastCoords) {
            coords.textContent = s;
            lastCoords = s;
          }
        }

        fill.style.setProperty("--fill", ((u1 * L[0] + u2 * L[1]) / Ltot).toFixed(4));
        stations.forEach((s, i) => s.classList.toggle("is-reached", reached[i]));

        if (li !== legIdx) {
          legIdx = li;
          leg.textContent = LEGS[li];
        }
        if (card !== active) {
          active = card;
          el.classList.toggle("is-summary", card === 3);
          cards.forEach((k, i) => {
            k.dataset.state = i < card ? "past" : i === card ? "active" : "next";
            k.toggleAttribute("inert", i !== card);
          });
        }
      };

      layout();
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            el.classList.add("is-static");
            layout();
            progress = 0.999;
            render();
            cards.forEach((k) => {
              k.dataset.state = "active";
              k.removeAttribute("inert");
            });
            return () => el.classList.remove("is-static");
          }
          const proxy = { p: 0 };
          const tween = gsap.to(proxy, {
            p: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              invalidateOnRefresh: true,
              onRefresh: () => {
                layout();
                render();
              },
            },
            onUpdate: () => {
              progress = proxy.p;
              render();
            },
          });
          const go = (i: number) => {
            const st = tween.scrollTrigger!;
            const y = st.start + (st.end - st.start) * STATION_AT[i];
            const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
            if (lenis) lenis.scrollTo(y, { duration: 1.8 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };
          const handlers = stations.map((s, i) => {
            const h = () => go(i);
            s.addEventListener("click", h);
            return h;
          });
          render();
          return () => {
            stations.forEach((s, i) => s.removeEventListener("click", handlers[i]));
          };
        },
      );

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
    <section ref={root} id="journey" className="lp-flight" aria-labelledby="lp-flight-title">
      <div className="lp-flight__stage" data-stage data-nav="dark" data-nav-glass>
        <svg className="lp-flight__map" data-map viewBox={OVERVIEW.map((v, i) => (i < 2 ? v : v - OVERVIEW[i - 2])).join(" ")} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            {STOPS.map((s) => (
              <clipPath key={s.iso} id={`lp-clip-${s.iso}`} clipPathUnits="userSpaceOnUse">
                <path d={s.geo.d} />
              </clipPath>
            ))}
          </defs>
          <g data-cam>
            <g className="lp-map__grat">
              {atlas.graticule.map((g, i) => (
                <path key={i} d={g.d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <g className="lp-map__neighbours">
              {atlas.neighbours.map((n) => (
                <path key={n.id} d={n.d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <g className="lp-map__states">
              {context.map((s) => (
                <path key={s.iso} d={s.d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <path className="lp-map__nation" d={atlas.outline} vectorEffect="non-scaling-stroke" />
            {STOPS.map((s) => {
              const [x0, y0, x1, y1] = s.geo.bounds;
              return (
                <g key={s.iso} className="lp-map__focus">
                  <path className="lp-map__base" d={s.geo.d} vectorEffect="non-scaling-stroke" />
                  <g data-lit={s.iso} className="lp-map__lit" clipPath={`url(#lp-clip-${s.iso})`}>
                    <image href={STATE_TEXTURE[s.iso]} x={x0} y={y0} width={x1 - x0} height={y1 - y0} preserveAspectRatio="xMidYMid slice" />
                    <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} className="lp-map__tint" />
                  </g>
                  <path className="lp-map__edge" d={s.geo.d} vectorEffect="non-scaling-stroke" />
                </g>
              );
            })}
            <path data-ghost className="lp-map__ghost" d={LEG1} />
            <path data-ghost className="lp-map__ghost" d={LEG2} />
            <path data-case="0" className="lp-map__case" d={LEG1} />
            <path data-case="1" className="lp-map__case" d={LEG2} />
            <path data-leg="0" className="lp-map__leg" d={LEG1} />
            <path data-leg="1" className="lp-map__leg" d={LEG2} />
          </g>
        </svg>

        <div className="lp-flight__overlay" aria-hidden="true">
          {STOPS.map((s) => (
            <div key={s.iso} data-name={s.iso} className={`lp-flight__name${s.iso === "IN-GA" ? " is-outside" : ""}`}>
              <span>{s.name}</span>
            </div>
          ))}
          {STOPS.map((s) => (
            <div key={s.iso} data-pin={s.iso} className="lp-flight__pin">
              <i />
              <span>{s.city.name}</span>
            </div>
          ))}
          <div data-marker className="lp-flight__marker">
            <i className="lp-flight__ring" />
            <i className="lp-flight__dot" />
            <span data-coords className="lp-flight__coords">
              23.22° N 72.64° E
            </span>
          </div>
        </div>

        <header className="lp-flight__head">
          <h2 id="lp-flight-title" className="lp-h2">
            <span>Three states, </span>
            <span>
              <em>one</em> journey
            </span>
          </h2>
          <div className="lp-flight__head-row">
            <p className="lp-chip lp-flight__leg">
              <i />
              <span data-legname>Gujarat</span>
            </p>
            <p className="lp-flight__note">An editorial route, north to south. Stops, dates and the order of travel are still to be announced.</p>
          </div>
        </header>

        <div className="lp-flight__panel">
          {STOPS.map((s) => (
            <article key={s.iso} data-card data-state={s.i === 0 ? "active" : "next"} className="lp-card">
              <div className="lp-card__media">
                <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 768px) 28rem, 40vw" quality={80} className="object-cover" />
                <span className="lp-card__no">
                  {String(s.i + 1).padStart(2, "0")}
                  <small>/03</small>
                </span>
              </div>
              <div className="lp-card__body">
                <p className="lp-card__native" lang={s.lang}>
                  {s.native}
                </p>
                <h3 className="lp-card__title">{s.name}</h3>
                <p className="lp-card__intro">{s.intro}</p>
                <dl className="lp-card__facts">
                  {s.facts.map((f) => (
                    <div key={f.term}>
                      <dt>{f.term}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="lp-card__past">Visited by the Yatra in {s.editions.join(" and ")}</p>
              </div>
            </article>
          ))}
          <article data-card data-state="next" className="lp-card lp-card--end">
            <svg className="lp-card__route" viewBox={OVERVIEW.map((v, i) => (i < 2 ? v : v - OVERVIEW[i - 2])).join(" ")} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {STOPS.map((s) => (
                <path key={s.iso} d={s.geo.d} className="lp-card__route-state" />
              ))}
              <path d={LEG1} className="lp-card__route-line" pathLength={1} />
              <path d={LEG2} className="lp-card__route-line is-2" pathLength={1} />
              {STOPS.map((s) => (
                <circle key={s.iso} cx={s.city.pt[0]} cy={s.city.pt[1]} r="7" className="lp-card__route-stop" />
              ))}
            </svg>
            <div className="lp-card__body">
              <p className="lp-card__native">Gujarat · Maharashtra · Goa</p>
              <h3 className="lp-card__title">
                One coast, <em>three</em> states
              </h3>
              <p className="lp-card__intro">From the Gulf of Kutch to the Konkan. The GGY team will announce the stops, the dates and the order of travel.</p>
              <a href="#connect" className="lp-pill lp-pill--crimson">
                Connect with the team
              </a>
            </div>
          </article>
        </div>

        <nav className="lp-flight__rail" aria-label="Jump to a state">
          <span className="lp-flight__track" data-fill />
          {STOPS.map((s) => (
            <button key={s.iso} type="button" data-station className="lp-flight__station">
              <i />
              <span>{s.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
