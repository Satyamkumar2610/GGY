"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { takeaways27 } from "@/content/ggy27";
import { Head } from "./head";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Takeaways from the Yatra, laid out as the programme is: on wide screens a
 * photograph held beside the list, changing to the one for whichever takeaway
 * is being read (as it crosses the middle of the screen, or under the pointer).
 * On narrow screens each takeaway carries its own photograph.
 */
export function Takeaways() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-take]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.take));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const photo = takeaways27[active].photo;

  return (
    <section id="takeaways" className="j-sec j-cream x-take" data-nav="dark" data-j-station="takeaways" data-arch aria-labelledby="takeaways-title">
      <div className="j-wrap">
        <Head id="takeaways-title" title="Takeaways" em="from the Yatra">
          <p>What delegates carry home from seven days on the road.</p>
        </Head>

        <div className="x-take__grid">
          <div className="x-take__stage" aria-hidden="true">
            <div className="x-take__frame">
              <AnimatePresence initial={false}>
                <motion.div key={photo.src} className="x-take__img" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                  <Image src={photo.src} alt="" fill sizes="(min-width: 64rem) 44vw, 90vw" quality={80} className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="x-take__count">
                {String(active + 1).padStart(2, "0")} / {String(takeaways27.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <ol ref={list} className="x-take__list">
            {takeaways27.map((t, i) => (
              <li key={t.name} data-take={i} className="x-take__item" data-on={i === active ? "" : undefined} onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)} onFocus={() => setActive(i)} tabIndex={-1}>
                <div className="x-take__thumb">
                  <Image src={t.photo.src} alt={t.photo.alt} fill sizes="90vw" quality={75} className="object-cover" />
                </div>
                <span className="x-take__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="x-take__name">{t.name}</h3>
                <p className="x-take__text">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
