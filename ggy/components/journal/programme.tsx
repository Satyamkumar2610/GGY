"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Hammer, Lightbulb, Mic2, Route, Scale, type LucideIcon } from "lucide-react";
import { BROCHURE, components, photos, type Photo } from "@/content/ggy";
import { NoteRef } from "../primitives";
import CardSwap, { Card, type CardSwapHandle } from "../CardSwap";
import { Head } from "./head";

/** One photograph and one mark for each part, in the brochure's order. */
const DRESS: { photo: Photo; Icon: LucideIcon }[] = [
  { photo: photos.fieldGroup, Icon: Route },
  { photo: photos.overhead, Icon: Hammer },
  { photo: photos.legislatureSteps, Icon: Scale },
  { photo: photos.address, Icon: Mic2 },
  { photo: photos.lectureHall, Icon: Lightbulb },
  { photo: photos.openLandscape, Icon: Building2 },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const N = components.length;

/**
 * The six parts of the programme, as run in 2025: a deck of photographs
 * that deals itself one card at a time (drag, click or use the arrows), and
 * beside it an index that follows the card in front and carries its text.
 */
export function Programme() {
  const deck = useRef<CardSwapHandle>(null);
  const [front, setFront] = useState(0);
  const busy = useRef(false);

  // The deck only moves one card at a time; walk it to the chosen part.
  const goTo = (i: number) => {
    if (busy.current || i === front) return;
    const steps = (i - front + N) % N;
    busy.current = true;
    for (let k = 0; k < steps; k++) window.setTimeout(() => deck.current?.next(), k * 140);
    window.setTimeout(() => (busy.current = false), steps * 140 + 60);
  };

  const active = components[front];

  return (
    <section id="programme" className="j-sec j-paper x-prog" data-arch data-nav="dark" aria-labelledby="programme-title">
      <div className="j-wrap">
        <Head id="programme-title" title="Six parts of the programme" em="as run in 2025">
          <p>As the {BROCHURE} describes them. The programme for the upcoming edition will be confirmed with its dates.</p>
        </Head>

        <div className="x-prog__grid">
          <div className="x-prog__index">
            <ol className="x-prog__list">
              {components.map((c, i) => {
                const on = i === front;
                const { Icon } = DRESS[i];
                return (
                  <li key={c.name}>
                    <button type="button" className="x-prog__item" aria-pressed={on} onClick={() => goTo(i)}>
                      {on ? <motion.span layoutId="prog-active" className="x-prog__hl" transition={{ duration: 0.5, ease: EASE }} /> : null}
                      <span className="x-prog__n">{String(i + 1).padStart(2, "0")}</span>
                      <Icon className="x-prog__icon" aria-hidden="true" strokeWidth={1.6} />
                      <span className="x-prog__name">{c.name}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="x-prog__detail" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={front} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
                  <h3 className="x-prog__title">{active.name}</h3>
                  <p className="x-prog__text">
                    {active.text ?? <span className="tba">Description awaiting confirmation</span>}
                    {active.note ? <NoteRef id={active.note} /> : null}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="x-prog__nav">
                <button type="button" aria-label="Previous part" onClick={() => deck.current?.prev()}>
                  <ArrowLeft aria-hidden="true" strokeWidth={1.6} />
                </button>
                <span className="x-prog__progress" aria-hidden="true">
                  <motion.i animate={{ scaleX: (front + 1) / N }} transition={{ duration: 0.5, ease: EASE }} />
                </span>
                <button type="button" aria-label="Next part" onClick={() => deck.current?.next()}>
                  <ArrowRight aria-hidden="true" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </div>

          <div className="x-prog__deck">
            <CardSwap
              ref={deck}
              theme="light"
              width={540}
              height={400}
              cardDistance={54}
              verticalDistance={58}
              delay={5200}
              skewAmount={4}
              visibleCards={4}
              cardRadius={22}
              onChange={setFront}
              ariaLabel="The six parts of the programme, as photographs"
            >
              {components.map((c, i) => {
                const { photo, Icon } = DRESS[i];
                return (
                  <Card key={c.name} className="x-prog__card">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 64rem) 540px, 90vw" quality={80} className="object-cover" draggable={false} />
                    <span className="x-prog__shade" aria-hidden="true" />
                    <span className="x-prog__chip">
                      <Icon aria-hidden="true" strokeWidth={1.8} />
                      {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                    </span>
                    <span className="x-prog__label">{c.name}</span>
                  </Card>
                );
              })}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}
