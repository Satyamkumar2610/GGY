"use client";

import { useRef, useState } from "react";
import { BROCHURE, careerPaths, CONCEPT_NOTE, saarthi, takeaways } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";

/**
 * Afterwards, on the crimson ground. The concept note's purpose for its
 * alumni is set as a statement; then one line comes in from the left and
 * forks into the ten paths the brochure lists, each branch ending level with
 * its row. What delegates took away follows as a ruled list.
 */
export function After() {
  const root = useRef<HTMLElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<number | null>(null);

  // The branches are measured from the rows they end at, so they stay level
  // with the list at any width.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem)", () => {
        const fork = root.current!.querySelector<HTMLElement>("[data-fork]")!;
        const rows = gsap.utils.toArray<HTMLElement>("[data-path-row]");
        const measure = () => {
          const w = fork.offsetWidth;
          const h = fork.offsetHeight;
          const y0 = h / 2;
          const top = fork.getBoundingClientRect().top;
          setBox({ w, h });
          setPaths(
            rows.map((r) => {
              const b = r.getBoundingClientRect();
              const y = b.top - top + b.height / 2;
              return `M0,${y0} C${(w * 0.62).toFixed(1)},${y0} ${(w * 0.42).toFixed(1)},${y.toFixed(1)} ${w},${y.toFixed(1)}`;
            }),
          );
        };
        measure();
        ScrollTrigger.addEventListener("refreshInit", measure);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", measure);
          setPaths([]);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Once the branches exist, they draw themselves at the pace of the scroll.
  useGSAP(
    () => {
      if (!paths.length) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-fork-wrap]", start: "top 70%", end: "bottom 75%", scrub: 0.6 } });
        tl.fromTo("[data-branch]", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", stagger: 0.12 }, 0).fromTo(
          "[data-path-row]",
          { opacity: 0.3 },
          { opacity: 1, ease: "none", stagger: 0.12, duration: 0.4 },
          0.45,
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paths.length], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="after" className="j-sec j-deep j-sheet on-dark" data-nav="light" data-j-station="after" aria-labelledby="after-title">
      <div className="j-wrap">
        <figure className="j-saarthi">
          <blockquote data-ink>{saarthi.text}</blockquote>
          <figcaption className="j-meta">From the {CONCEPT_NOTE}.</figcaption>
        </figure>

        <Head id="after-title" title="Where alumni" em="went next">
          <p>As listed in the {BROCHURE} under “Life after Good Governance Yatra”.</p>
        </Head>

        <div className="j-fork" data-fork-wrap>
          <div className="j-fork__art" data-fork aria-hidden="true">
            {paths.length ? (
              <svg viewBox={`0 0 ${box.w} ${box.h}`} width={box.w} height={box.h}>
                {paths.map((d, i) => (
                  <path key={i} d={d} data-branch className={hover === i ? "is-on" : hover === null ? undefined : "is-off"} />
                ))}
                <circle cx="5" cy={box.h / 2} r="5" />
              </svg>
            ) : null}
          </div>
          <ul className="j-paths" aria-label="Paths alumni have taken" onPointerLeave={() => setHover(null)}>
            {careerPaths.map((c, i) => (
              <li key={c} data-path-row data-on={hover === i ? "" : undefined} onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="j-took">
          <Title as="h3" sub title="What delegates" em="took away" />
          <ul className="j-took__list">
            {takeaways.map((t) => (
              <li key={t.name}>
                <i className="j-rule" data-rule aria-hidden="true" />
                <h4 className="j-h3">{t.name}</h4>
                <p className="j-body">
                  {t.text}
                  {t.note ? <NoteRef id={t.note} /> : null}
                </p>
              </li>
            ))}
          </ul>
          <p className="j-meta">As listed in the 2025 brochure, which also offered delegates a certificate of appreciation.</p>
        </div>
      </div>
    </section>
  );
}
