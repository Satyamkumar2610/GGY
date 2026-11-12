"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Building2, MapPin, Sparkles, UserRound } from "lucide-react";
import { BROCHURE, CONCEPT_NOTE, met8, previousEdition, roleModels } from "@/content/ggy";
import { portraits, type Pic } from "@/content/ggy27";
import { ScrollTrigger } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";

type Person = { name: string; title: string; from: "8th" | "brochure"; where: string; city?: string; photo?: Pic };

/* Role models with a photograph lead; the 8th edition's names follow as
   typeset plates, so the reel opens on faces. */
const people: Person[] = [
  ...roleModels.map((p) => ({ name: p.name, title: p.title, from: "brochure" as const, where: "2025 brochure", photo: portraits[p.name] })),
  ...met8.map((p) => ({ name: p.name, title: p.title, from: "8th" as const, where: `${p.where}, 8th edition`, city: p.where })),
];

/** Two initials from the name as printed, honorifics and post-nominals left out. */
const HONORIFIC = /^(late|shri|smt\.?|dr\.?|ias)$/i;
function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => !HONORIFIC.test(w));
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const EASE = [0.22, 1, 0.36, 1] as const;

const FILTERS = [
  { id: "all", label: "Everyone" },
  { id: "brochure", label: "Listed for earlier editions" },
  { id: "8th", label: "Met on the 8th edition" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

/**
 * The people delegates have met, as a reel of portraits that runs off the
 * right edge of the page: photographs held in the crimson duotone until one
 * is pointed at or focused, when it comes into full colour; names without a
 * photograph are set as plates with their initials and the city they were
 * met in. The reel scrolls sideways (drag, swipe, trackpad or the arrows),
 * and a hairline below it fills as it is read. The filter re-deals it.
 */
export function People() {
  const [filter, setFilter] = useState<FilterId>("all");
  const shown = useMemo(() => people.filter((p) => filter === "all" || p.from === filter), [filter]);
  const still = useReducedMotion();
  const reel = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  /* The reel drifts on its own. The list is printed twice, and when the
     drift has travelled one full copy it steps back by exactly that much,
     so the loop has no seam. `loop` is measured on layout changes only. */
  const auto = useRef({ pos: 0, loop: 0, over: false, seen: false, holdUntil: 0, writing: false });

  const measure = useCallback(() => {
    const el = reel.current;
    if (!el) return;
    const a = el.querySelector<HTMLElement>('[data-copy="0"]');
    const b = el.querySelector<HTMLElement>('[data-copy="1"]');
    auto.current.loop = a && b ? b.offsetLeft - a.offsetLeft : 0;
  }, []);

  // The hairline shows how far through one copy the reel has travelled.
  const sync = useCallback(() => {
    const el = reel.current;
    const st = auto.current;
    if (!el) return;
    if (st.loop > 0 && el.scrollLeft >= st.loop) {
      st.writing = true;
      el.scrollLeft -= st.loop;
    }
    if (!st.writing) st.pos = el.scrollLeft;
    st.writing = false;
    const p = st.loop > 0 ? (el.scrollLeft % st.loop) / st.loop : 0;
    bar.current?.style.setProperty("transform", `scaleX(${Math.max(0.04, p)})`);
  }, []);

  // Back to the start when the filter re-deals the reel; measure once the
  // cards have settled.
  useEffect(() => {
    const el = reel.current;
    if (!el) return;
    el.scrollLeft = 0;
    auto.current.pos = 0;
    const t = window.setTimeout(() => {
      measure();
      sync();
    }, 650);
    return () => window.clearTimeout(t);
  }, [filter, measure, sync]);

  useEffect(() => {
    const onResize = () => {
      measure();
      sync();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, sync]);

  // The drift: about 40px a second while the reel is on screen and nobody is
  // pointing at, focusing, dragging or stepping it.
  useEffect(() => {
    if (still) return;
    const el = reel.current;
    if (!el) return;
    const st = auto.current;
    const io = new IntersectionObserver(([e]) => (st.seen = e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (st.seen && !st.over && !drag.current && now > st.holdUntil && st.loop > 0 && !document.hidden) {
        st.pos += 40 * dt;
        if (st.pos >= st.loop) st.pos -= st.loop;
        st.writing = true;
        el.scrollLeft = st.pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [still]);

  const hold = (ms = 2600) => (auto.current.holdUntil = performance.now() + ms);

  // The section's height can change with the filter on narrow screens.
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 650);
    return () => window.clearTimeout(t);
  }, [filter]);

  const step = (dir: 1 | -1) => {
    const el = reel.current;
    if (!el) return;
    hold();
    const st = auto.current;
    // Stepping back from the very start goes back into the second copy.
    if (dir < 0 && st.loop > 0 && el.scrollLeft < el.clientWidth) {
      st.writing = true;
      el.scrollLeft += st.loop;
    }
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: still ? "auto" : "smooth" });
  };

  // Drag to scroll, for a mouse only: touch and trackpads scroll natively.
  const onDown = (e: PointerEvent<HTMLUListElement>) => {
    hold();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: reel.current!.scrollLeft, moved: false };
  };
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      reel.current!.setPointerCapture(e.pointerId);
      reel.current!.dataset.dragging = "";
    }
    if (d.moved) reel.current!.scrollLeft = d.left - dx;
  };
  const onUp = (e: PointerEvent<HTMLUListElement>) => {
    if (drag.current?.moved) reel.current!.releasePointerCapture(e.pointerId);
    delete reel.current?.dataset.dragging;
    drag.current = null;
    hold();
  };

  return (
    <section id="people" className="j-sec j-paper" data-nav="dark" data-j-station="people" data-arch aria-labelledby="people-title">
      <div className="j-wrap">
        <Head id="people-title" title="The people" em="delegates met">
          <p>
            {people.length} leaders, officials and reformers named so far, from the {CONCEPT_NOTE} for the 8th edition and the {BROCHURE} for earlier ones. Names and titles are reproduced as printed.
            <NoteRef id="titles" />
          </p>
        </Head>

        <div className="x-faces__bar">
          <LayoutGroup>
            <div className="x-seg" role="group" aria-label="Show people">
              {FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button key={f.id} type="button" aria-pressed={on} className="x-seg__btn" onClick={() => setFilter(f.id)}>
                    {on ? <motion.span layoutId="people-seg" className="x-seg__pill" transition={{ duration: 0.45, ease: EASE }} /> : null}
                    <span className="x-seg__label">{f.label}</span>
                    <span className="x-seg__n">{people.filter((p) => f.id === "all" || p.from === f.id).length}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <div className="x-faces__nav">
            <button type="button" className="x-faces__arrow" aria-label="Previous people" onClick={() => step(-1)}>
              <ArrowLeft aria-hidden="true" strokeWidth={1.6} />
            </button>
            <button type="button" className="x-faces__arrow" aria-label="More people" onClick={() => step(1)}>
              <ArrowRight aria-hidden="true" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={reel}
        className="x-faces"
        aria-label="People delegates have met"
        onScroll={sync}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => (auto.current.over = true)}
        onPointerLeave={() => (auto.current.over = false)}
        onFocus={() => (auto.current.over = true)}
        onBlur={() => (auto.current.over = false)}
        onWheel={() => hold()}
        onTouchStart={() => hold()}
        onClickCapture={(e) => {
          if (reel.current?.dataset.dragging !== undefined) e.preventDefault();
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {[0, 1].flatMap((copy) =>
            shown.map((p, i) => (
            <motion.li
              key={`${copy}-${p.name}`}
              data-copy={i === 0 ? copy : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              layout={!still}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55, ease: EASE, delay: still ? 0 : Math.min(i, 6) * 0.04 }}
              className="x-face"
            >
              <figure className="x-face__fig" tabIndex={copy === 1 ? -1 : 0}>
                <div className={`x-face__frame${p.photo ? "" : " is-plate"}`}>
                  {p.photo ? (
                    <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 64rem) 16rem, 60vw" quality={80} draggable={false} className="x-face__img" />
                  ) : (
                    <span className="x-face__plate" aria-hidden="true">
                      <small>{p.city}</small>
                      <b>{initials(p.name)}</b>
                    </span>
                  )}
                </div>
                <figcaption>
                  <span className="x-face__name">{p.name}</span>
                  <span className="x-face__role">{p.title}</span>
                  <span className="x-face__tag">
                    {p.from === "8th" ? <MapPin aria-hidden="true" strokeWidth={1.8} /> : <BookOpen aria-hidden="true" strokeWidth={1.8} />}
                    {p.where}
                  </span>
                </figcaption>
              </figure>
            </motion.li>
            )),
          )}
        </AnimatePresence>
      </ul>

      <div className="j-wrap">
        <p className="x-faces__progress" aria-hidden="true">
          <span ref={bar} />
        </p>

        <div className="j-inst">
          <Title as="h3" sub title="The institutions behind" em="the 2025 edition" />
          <dl className="x-inst">
            {[
              { Icon: Building2, k: "Organised by", v: "Rashtram School of Public Leadership", m: "Rishihood University, Sonipat" },
              { Icon: Sparkles, k: "An initiative of", v: previousEdition.initiativeOf, m: "As printed on the 2025 brochure cover" },
              { Icon: UserRound, k: "Yatra leader, 2025", v: "Shri Shantanu Gupta", m: "Professor of Practice, Rashtram School of Public Leadership, Rishihood University" },
            ].map(({ Icon, k, v, m }) => (
              <div key={k} className="x-inst__card" data-row>
                <span className="x-inst__icon" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <dt>{k}</dt>
                <dd>{v}</dd>
                <dd className="x-inst__meta">{m}</dd>
              </div>
            ))}
          </dl>
          <p className="j-meta j-inst__src">From the {BROCHURE}. The organiser and Yatra leader of the upcoming edition are to be confirmed.</p>
        </div>
      </div>
    </section>
  );
}
