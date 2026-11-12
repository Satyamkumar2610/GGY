"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { keyVisits } from "@/content/ggy27";
import { Head } from "./head";

const N = keyVisits.length;
const SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as const;
/** How long each visit holds before the deck deals the next (ms). */
const HOLD = 5200;

/**
 * Key Visits and Interactions: "Beyond the map lies real learning".
 *
 * A deck of photographs that moves on its own: the visit in front is shown
 * full, the next ones wait stacked behind it to the right, and every few
 * seconds the front card slides away and the next comes forward. It can be
 * dragged or swiped, and the index beside it names every visit, with a bar
 * that fills while the current one is held. The deck pauses under the pointer.
 * Transform and opacity only.
 */
export function KeyVisits() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useReducedMotion();
  const go = (d: number) => setActive((a) => (a + d + N) % N);

  return (
    <section id="visits" className="j-sec j-paper x-kv" data-nav="dark" data-j-station="visits" data-arch aria-labelledby="visits-title">
      <div className="j-wrap">
        <Head id="visits-title" title="Beyond the map lies" em="real learning">
          <p className="x-kv__kicker">Key visits and interactions</p>
          <p>Where delegates go and whom they meet. The visits for the 9th edition will be announced with its itinerary.</p>
        </Head>

        <div className="x-kv__grid" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <ol className="x-kv__index" aria-label="Key visits">
            {keyVisits.map((v, i) => (
              <li key={v.name}>
                <button type="button" className="x-kv__item" aria-current={i === active ? "true" : undefined} onClick={() => setActive(i)}>
                  <span className="x-kv__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="x-kv__name">{v.name}</span>
                  {i === active ? (
                    <span className="x-kv__bar" aria-hidden="true">
                      <i
                        key={active}
                        style={{ animationDuration: `${HOLD}ms`, animationPlayState: paused || still ? "paused" : "running" }}
                        onAnimationEnd={() => go(1)}
                      />
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ol>

          <div className="x-kv__deck" aria-live="polite">
            {keyVisits.map((v, i) => {
              // Where this card sits relative to the front: 0 front, 1..3 waiting behind, -1 just dealt away.
              let o = (i - active + N) % N;
              if (o === N - 1) o = -1;
              const front = o === 0;
              return (
                <motion.article
                  key={v.name}
                  className="x-kv__card"
                  data-fit={v.fit}
                  aria-hidden={!front}
                  initial={false}
                  animate={{
                    x: o < 0 ? "-18%" : `${Math.min(o, 3) * 7}%`,
                    y: o < 0 ? 0 : Math.min(o, 3) * -14,
                    scale: o < 0 ? 0.94 : 1 - Math.min(o, 3) * 0.07,
                    rotate: o < 0 ? -4 : 0,
                    opacity: o < 0 || o > 3 ? 0 : 1 - o * 0.12,
                  }}
                  transition={still ? { duration: 0 } : SPRING}
                  style={{ zIndex: N - (o < 0 ? N : o) }}
                  drag={front ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
                    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
                  }}
                >
                  <div className="x-kv__img">
                    <Image src={v.photo.src} alt={front ? v.photo.alt : ""} fill sizes="(min-width: 64rem) 52vw, 92vw" quality={80} draggable={false} className={v.fit === "contain" ? "object-contain" : "object-cover"} />
                  </div>
                  <div className="x-kv__body">
                    <span className="x-kv__count">
                      {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                    </span>
                    <h3 className="x-kv__title">{v.name}</h3>
                    {v.text ? <p className="x-kv__text">{v.text}</p> : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
