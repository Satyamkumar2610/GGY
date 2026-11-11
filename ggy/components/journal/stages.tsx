"use client";

import { useRef } from "react";
import { learningJourney } from "@/content/ggy";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { Head } from "./head";

const N = learningJourney.length;
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The learning journey: four stages, in order, on the crimson ground. On
 * wide screens the section holds and the four names turn past like a reel:
 * the stage being read opens to its full width and colour, its neighbours
 * wait condensed above and below, and its description comes up beside it.
 * Elsewhere it is a plain ordered list.
 */
export function Stages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const names = gsap.utils.toArray<HTMLElement>("[data-reel-name]");
        const texts = gsap.utils.toArray<HTMLElement>("[data-reel-text]");
        const ticks = gsap.utils.toArray<HTMLElement>("[data-reel-tick]");
        const pos = { a: 0 };
        const render = () => {
          // Each stage is held, then the reel turns to the next.
          const f = Math.min(N - 1, Math.floor(pos.a));
          const t = pos.a - f;
          const a = f + smooth(gsap.utils.clamp(0, 1, (t - 0.55) / 0.45));
          names.forEach((el, i) => {
            const near = 1 - Math.min(1, Math.abs(i - a));
            gsap.set(el, { yPercent: (1 - a) * 100, "--w": 75 + 50 * near, opacity: 0.16 + 0.84 * near });
          });
          texts.forEach((el, i) => {
            const d = i - a;
            gsap.set(el, { autoAlpha: 1 - Math.min(1, Math.abs(d) * 1.6), y: d * 56 });
          });
          ticks.forEach((el, i) => el.toggleAttribute("data-on", i <= Math.round(a)));
        };
        render();
        const tween = gsap.to(pos, {
          a: N - 1 + 0.5,
          ease: "none",
          onUpdate: render,
          scrollTrigger: { trigger: "[data-reel-track]", start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        return () => {
          tween.kill();
          gsap.set([...names, ...texts], { clearProps: "all" });
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="learning" className="j-sec j-deep j-sheet on-dark j-reel-sec" data-nav="light" data-j-station="learning" data-arch aria-labelledby="learning-title">
      <div className="j-reel__track" data-reel-track>
        <div className="j-reel__stage">
          <div className="j-wrap">
            <Head id="learning-title" title="Four stages of a" em="personal learning journey">
              <p>As described for the 2025 edition. The format of the upcoming edition will be confirmed with its programme.</p>
            </Head>
            <ol className="j-reel">
              {learningJourney.map((s, i) => (
                <li key={s.name} className="j-reel__item">
                  <h3 className="j-reel__name" data-reel-name>
                    {s.name}
                  </h3>
                  <div className="j-reel__text" data-reel-text>
                    <p className="j-reel__n" aria-hidden="true">
                      {i + 1}
                      <span>of {N}</span>
                    </p>
                    <p className="j-lede">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="j-reel__ticks" aria-hidden="true">
              {learningJourney.map((s) => (
                <i key={s.name} data-reel-tick />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
