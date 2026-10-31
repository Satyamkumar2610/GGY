"use client";

import Image from "next/image";
import { useRef } from "react";
import { photos, stateDossiers, upcoming, type PhotoKey } from "@/content/ggy";
import { atlas } from "@/lib/atlas";
import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { Script } from "../primitives";

type Composition = {
  iso: "IN-GJ" | "IN-GA" | "IN-MH";
  main: PhotoKey;
  second?: PhotoKey;
  place: string;
  coords: string;
  note: string;
  side: "left" | "right";
};

/* Reference notes about the places in the photographs, written for this page. */
const COMPOSITIONS: Composition[] = [
  {
    iso: "IN-GJ",
    main: "sabarmati",
    place: "Sabarmati Ashram, Ahmedabad",
    coords: "23.06° N  72.58° E",
    note: "Gandhi lived at the ashram on the Sabarmati from 1917 to 1930. The Salt March set out from here on 12 March 1930.",
    side: "left",
  },
  {
    iso: "IN-GA",
    main: "bomJesus",
    second: "oldSecretariat",
    place: "Old Goa and Panaji",
    coords: "15.50° N  73.91° E",
    note: "The Basilica of Bom Jesus is part of the Churches and Convents of Goa, a UNESCO World Heritage Site since 1986. Upriver in Panaji, the Old Secretariat was once the palace of Adil Shah.",
    side: "right",
  },
  {
    iso: "IN-MH",
    main: "highCourt",
    second: "municipalCorporation",
    place: "Fort, Mumbai",
    coords: "18.93° N  72.83° E",
    note: "The Bombay High Court has sat in its Gothic Revival building since 1878. A short walk north, the Municipal Corporation Building houses the city’s municipal headquarters.",
    side: "left",
  },
];

function Silhouette({ iso }: { iso: string }) {
  const s = atlas.states.find((x) => x.iso === iso)!;
  const [x0, y0, x1, y1] = s.bounds;
  const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
  return (
    <svg viewBox={`${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`} className="journey-sil" aria-hidden="true">
      <path d={s.d} pathLength={1} data-sil />
    </svg>
  );
}

/**
 * Section 03: the connecting journey. A single line runs down the page and
 * joins three compositions, one for each state; it draws itself as the
 * reader moves. It is an editorial graphic: it joins this page's chapters,
 * not confirmed stops, and follows the page's order, not the order of travel.
 */
export function ConnectingJourney() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const svg = el.querySelector<SVGSVGElement>("[data-line-svg]")!;
      const line = el.querySelector<SVGPathElement>("[data-line]")!;
      const ghost = el.querySelector<SVGPathElement>("[data-line-ghost]")!;
      const pen = el.querySelector<SVGCircleElement>("[data-pen]")!;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
      let length = 1;

      // The line passes through each composition's node, curving between them.
      const build = () => {
        const r = el.getBoundingClientRect();
        const w = r.width;
        const h = el.scrollHeight;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.style.height = `${h}px`;
        // Each node is entered from above and left straight down the text
        // column's margin, so the line rules the text rather than crossing it.
        const pts = nodes.flatMap((n) => {
          const b = n.getBoundingClientRect();
          const x = b.left - r.left + b.width / 2;
          const y = b.top - r.top + b.height / 2;
          const text = n.closest("[data-text]")?.getBoundingClientRect();
          const exit = text ? text.bottom - r.top + 48 : y + 1;
          return [
            [x, y],
            [x, exit],
          ];
        });
        const start = [w < 1024 ? 10 : w * 0.5, 0];
        const end = [w < 1024 ? 10 : w * 0.5, h];
        const all = [start, ...pts, end];
        let d = `M${all[0][0].toFixed(1)},${all[0][1].toFixed(1)}`;
        for (let i = 1; i < all.length; i++) {
          const [ax, ay] = all[i - 1];
          const [bx, by] = all[i];
          if (Math.abs(ax - bx) < 0.5) {
            d += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
            continue;
          }
          const dy = (by - ay) * 0.55;
          d += ` C${ax.toFixed(1)},${(ay + dy).toFixed(1)} ${bx.toFixed(1)},${(by - dy).toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
        }
        line.setAttribute("d", d);
        ghost.setAttribute("d", d);
        length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
      };

      const mm = gsap.matchMedia();
      build();

      mm.add(MOTION_QUERIES.any, () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 60%",
          scrub: 0.8,
          onRefreshInit: build,
          onUpdate: (self) => {
            const p = self.progress;
            line.style.strokeDashoffset = `${length * (1 - p)}`;
            const pt = line.getPointAtLength(length * p);
            pen.setAttribute("cx", pt.x.toFixed(1));
            pen.setAttribute("cy", pt.y.toFixed(1));
            pen.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
          },
        });
        line.style.strokeDashoffset = `${length}`;

        // Each composition arrives in its own way: the photograph opens from
        // the side the line arrives on, the outline of the state draws itself,
        // the second photograph drifts against the scroll.
        el.querySelectorAll<HTMLElement>("[data-comp]").forEach((comp) => {
          const fromLeft = comp.dataset.side === "left";
          const main = comp.querySelector<HTMLElement>("[data-main]");
          const img = main?.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: comp, start: "top 72%", once: true }, defaults: { ease: "land" } });
          if (main)
            tl.fromTo(
              main,
              { clipPath: fromLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
              0,
            );
          if (img) tl.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 2.2 }, 0.1);
          const words = comp.querySelector<HTMLElement>("[data-words]");
          if (words) {
            const split = SplitText.create(words, { type: "lines", mask: "lines" });
            tl.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.08 }, 0.5);
          }
          tl.fromTo(comp.querySelectorAll("[data-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.8);

          const sil = comp.querySelector<SVGPathElement>("[data-sil]");
          if (sil)
            gsap.fromTo(sil, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: comp, start: "top 80%", end: "center 45%", scrub: 0.6 } });
          const num = comp.querySelector<HTMLElement>("[data-num]");
          if (num) gsap.fromTo(num, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: comp, start: "top bottom", end: "bottom top", scrub: 1 } });
        });

        el.querySelectorAll<HTMLElement>("[data-statement]").forEach((s) => {
          const split = SplitText.create(s, { type: "lines", mask: "lines" });
          gsap.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "land", scrollTrigger: { trigger: s, start: "top 78%", once: true } });
        });

        return () => st.kill();
      });

      mm.add(MOTION_QUERIES.desktop, () => {
        el.querySelectorAll<HTMLElement>("[data-second]").forEach((s) => {
          gsap.fromTo(s, { yPercent: 18 }, { yPercent: -18, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        });
      });

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(el);
      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" aria-labelledby="journey-title" className="journey">
      <svg className="journey-line" data-line-svg aria-hidden="true" preserveAspectRatio="none">
        <path className="journey-line-ghost" data-line-ghost />
        <path className="journey-line-ink" data-line />
        <circle r="4.5" className="journey-pen" data-pen />
      </svg>

      <div className="page relative">
        <div className="journey-intro">
          <p className="kicker">
            <span className="num">03</span> The connecting journey
          </p>
          <h2 id="journey-title" className="journey-statement mt-6" data-statement>
            A journey is a line drawn between places. This one is still being drawn.
          </h2>
          <p className="journey-caveat mt-8 max-w-[26rem]">
            The line on this page is an editorial graphic. It joins the chapters of this page, not confirmed stops, and it does not show the order of travel.
          </p>
        </div>

        {COMPOSITIONS.map((c, i) => {
          const d = stateDossiers.find((x) => x.iso === c.iso)!;
          const st = upcoming.states.find((s) => s.name === d.name)!;
          const main = photos[c.main];
          const second = c.second ? photos[c.second] : null;
          return (
            <article key={c.iso} className={`journey-comp is-${c.side}`} data-comp data-side={c.side} aria-labelledby={`jc-${c.iso}`}>
              <div className="journey-media">
                <div className="journey-main" data-main>
                  <Image src={main.src} alt={main.alt} fill quality={82} sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </div>
                {second ? (
                  <figure className="journey-second" data-second>
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                      <Image src={second.src} alt={second.alt} fill quality={80} sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
                    </div>
                    <figcaption className="caption mt-2">{second.caption}</figcaption>
                  </figure>
                ) : null}
                <p className="journey-credit caption">
                  {main.caption}. {main.credit}
                  {second ? ` ${second.caption}: ${second.credit}` : ""}
                </p>
              </div>

              <div className="journey-text" data-text>
                <span aria-hidden="true" className="journey-num" data-num>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="journey-node" data-node />
                <Silhouette iso={c.iso} />
                <h3 id={`jc-${c.iso}`} className="journey-name" data-words>
                  {d.name}
                </h3>
                <Script lang={st.lang} className="journey-native">
                  {st.native}
                </Script>
                <dl className="journey-annot" data-fade>
                  <div>
                    <dt>In the photograph</dt>
                    <dd>{c.place}</dd>
                  </div>
                  <div>
                    <dt>Position</dt>
                    <dd className="tabular-nums">{c.coords}</dd>
                  </div>
                </dl>
                <p className="journey-note" data-fade>
                  {c.note}
                </p>
              </div>
            </article>
          );
        })}

        <div className="journey-outro">
          <p className="journey-statement" data-statement>
            Three states. One coastline. The order of travel will be announced with the programme.
          </p>
        </div>
      </div>
    </section>
  );
}
