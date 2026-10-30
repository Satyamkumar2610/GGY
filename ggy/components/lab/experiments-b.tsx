"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { photos, upcoming, type State } from "@/content/ggy";
import { Script } from "@/components/primitives";
import { clipFrom, LabSection, MOTION_EASE, useControls, Variants } from "./controls";
import { Strips } from "./strips";

const southToNorth = [...upcoming.states].sort((a, b) => a.capital.lat - b.capital.lat);

function LabPrint({ state, className }: { state: State; className: string }) {
  const p = state.photos[0] ? photos[state.photos[0]] : null;
  return (
    <figure data-print className={`absolute bg-light p-2 pb-1.5 shadow-[0_30px_60px_-32px_rgb(20_18_16/0.55)] ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {p ? (
          <Image src={p.src} alt={p.alt} fill sizes="18vw" className="object-cover" />
        ) : (
          <div className="plate absolute inset-0">
            <Script lang={state.lang} className="text-[2.4rem] text-crimson">
              {state.native}
            </Script>
          </div>
        )}
      </div>
      <figcaption className="pt-2 text-[0.72rem]">{state.name}</figcaption>
    </figure>
  );
}

/* 7. Hero scroll sequence (pinned) */
export function HeroSequence() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const s = q("[data-s]");
      const si = q("[data-si]");
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: q("[data-stage]")[0], start: "top top", end: "+=220%", pin: true, scrub: c.lag || true } });
      tl.to(q("[data-title]"), { y: -80, autoAlpha: 0, duration: 0.16, ease: "power2.in" }, 0);
      if (v === 0) {
        tl.to(s, { clipPath: "inset(0% 4% 0% 4%)", duration: 0.2, ease: "swing" }, 0.06)
          .to(s, { yPercent: (i) => (i % 2 ? 9 : -9) * (1 + i * 0.18), duration: 0.3, ease: "swing" }, 0.06)
          .to(si, { scale: 1.32, duration: 0.42, ease: "swing" }, 0.06)
          .to(s, { yPercent: (i) => (i % 2 ? 130 : -130), rotation: (i) => (i % 2 ? 2.5 : -2.5), duration: 0.24, ease: "power3.in", stagger: c.stagger / 3 }, 0.36);
      } else if (v === 1) {
        tl.to(s, { clipPath: "inset(6% 0% 6% 0%)", duration: 0.2, ease: "swing" }, 0.06)
          .to(s, { xPercent: (i) => (i % 2 ? 6 : -6) * (1 + i * 0.2), duration: 0.3, ease: "swing" }, 0.06)
          .to(si, { scale: 1.25, duration: 0.42, ease: "swing" }, 0.06)
          .to(s, { xPercent: (i) => (i % 2 ? 120 : -120), duration: 0.26, ease: "power3.in", stagger: c.stagger / 3 }, 0.36);
      } else {
        tl.to(s, { scaleY: 0.5, clipPath: "inset(0% 6% 0% 6%)", duration: 0.24, ease: "swing" }, 0.06)
          .to(si, { scale: 1.12, duration: 0.24, ease: "swing" }, 0.06)
          .to(s, { yPercent: 160, duration: 0.24, ease: "power3.in", stagger: { each: c.stagger / 3, from: "center" } }, 0.34);
      }
      tl.from(q("[data-paper-line]"), { yPercent: 115, autoAlpha: 0, duration: 0.2, ease: "land", stagger: 0.045 }, 0.36 + c.offset * 0.3)
        .from(q("[data-print]"), { y: () => -window.innerHeight * 1.1, rotation: (i) => [-24, 18, -14][i] ?? 0, duration: 0.26, ease: c.ease, stagger: 0.06 }, 0.46 + c.offset * 0.3)
        .to({}, { duration: 0.12 });
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  const [goa, maharashtra, gujarat] = southToNorth;
  return (
    <div ref={ref}>
      <LabSection id="x7" n={7} title="Hero scroll sequence" note="Pinned. A is the current site. B opens the photograph as horizontal bands that slide apart. C gathers the strips into a contact-sheet row that falls away. Easing sets how the prints land.">
        <Variants value={v} onChange={setV} labels={["Vertical strips (current)", "Horizontal shutter", "Contact sheet"]} />
      </LabSection>
      <div data-stage className="relative h-svh overflow-hidden bg-paper">
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-[clamp(3.5rem,1rem+6vw,8rem)] font-light leading-[0.98] tracking-[-0.04em]">
              {southToNorth.map((s) => (
                <span key={s.name} className="block overflow-hidden">
                  <span data-paper-line className="block">{s.name}</span>
                </span>
              ))}
            </p>
            <p data-paper-line className="mt-6 text-ink-soft">Dates, stops and the order of travel are still to be announced.</p>
          </div>
          <LabPrint state={goa} className="left-[7%] top-[16%] w-[15vw] -rotate-6" />
          <LabPrint state={maharashtra} className="right-[8%] top-[13%] w-[16vw] rotate-[5deg]" />
          <LabPrint state={gujarat} className="bottom-[8%] right-[18%] w-[12vw] -rotate-3" />
        </div>
        <Strips n={v === 1 ? 5 : 6} axis={v === 1 ? "h" : "v"} />
        <p data-title className="absolute bottom-10 left-10 font-display text-[clamp(3rem,1rem+5vw,7rem)] font-light leading-[0.9] text-ivory">Good Governance Yatra</p>
      </div>
    </div>
  );
}

/* 8. Route chapters (not pinned) */
function Chapter({ state }: { state: State }) {
  const p = state.photos[0] ? photos[state.photos[0]] : null;
  return (
    <article data-chapter className="relative grid gap-8 py-[10vh] lg:grid-cols-12">
      <div className="lg:col-span-2" aria-hidden="true">
        <span data-marker className="hidden h-3 w-3 rounded-full border border-crimson bg-paper lg:block" />
      </div>
      <div className="lg:col-span-7">
        <div data-img className="relative aspect-[3/2] overflow-hidden bg-sand">
          {p ? (
            <Image src={p.src} alt={p.alt} fill sizes="60vw" className="object-cover" />
          ) : (
            <div className="plate absolute inset-0">
              <Script lang={state.lang} className="text-[5rem] text-crimson">
                {state.native}
              </Script>
            </div>
          )}
        </div>
      </div>
      <aside data-notes className="lg:col-span-3 lg:pt-10">
        <h3 className="font-display text-[3rem] font-light leading-none">
          <span className="block overflow-hidden"><span data-name className="block">{state.name}</span></span>
        </h3>
        <Script lang={state.lang} className="mt-2 block text-[1.4rem] text-crimson">{state.native}</Script>
        <dl className="mt-8 space-y-4 text-[0.9rem]">
          <div data-note><dt className="text-muted">State capital, for reference</dt><dd>{state.capital.name}, {state.capital.lat.toFixed(1)}° N</dd></div>
          <div data-note><dt className="text-muted">Earlier editions</dt><dd>{state.visitedIn.join(" and ")}</dd></div>
          <div data-note><dt className="text-muted">Stops</dt><dd className="tba">To be announced</dd></div>
        </dl>
      </aside>
    </article>
  );
}

export function RouteVariants() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const chapters = q("[data-chapter]") as HTMLElement[];
      if (v === 0) {
        chapters.forEach((ch) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: "top 70%", toggleActions: "play none none reverse" } });
          tl.fromTo(ch.querySelector("[data-img]"), { clipPath: clipFrom(c.dir) }, { clipPath: "inset(0% 0% 0% 0%)", duration: c.duration, ease: c.ease })
            .fromTo(ch.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: c.duration * 1.3, ease: "expo.out" }, 0)
            .from(ch.querySelector("[data-name]"), { yPercent: 110, duration: c.duration * 0.8, ease: c.ease }, c.duration * c.offset)
            .from(ch.querySelectorAll("[data-note]"), { autoAlpha: 0, y: 12, duration: 0.6, stagger: c.stagger }, c.duration * c.offset + 0.2);
        });
      } else if (v === 1) {
        gsap.fromTo(q("[data-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-route]")[0], start: "top 60%", end: "bottom 60%", scrub: c.lag || true } });
        chapters.forEach((ch) => {
          gsap.fromTo(ch.querySelector("[data-marker]"), { backgroundColor: "#f3f0ea" }, { backgroundColor: "#8e2531", scrollTrigger: { trigger: ch, start: "top 60%", toggleActions: "play none none reverse" }, duration: 0.3 });
          gsap.from(ch.querySelectorAll("[data-note], [data-name]"), { autoAlpha: 0, x: -16, stagger: c.stagger, ease: "none", scrollTrigger: { trigger: ch, start: "top 65%", end: "top 35%", scrub: c.lag || true } });
        });
      } else {
        chapters.forEach((ch) => {
          gsap.fromTo(ch.querySelector("[data-img]"), { scale: 1.4, transformOrigin: "50% 0%" }, { scale: 1, ease: "none", scrollTrigger: { trigger: ch, start: "top bottom", end: "top 25%", scrub: c.lag || true } });
          gsap.from(ch.querySelector("[data-notes]"), { autoAlpha: 0, x: 60, ease: "none", scrollTrigger: { trigger: ch, start: "top 70%", end: "top 35%", scrub: c.lag || true } });
        });
      }
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <div ref={ref}>
      <LabSection id="x8" n={8} title="Route chapters" note="Not pinned. One chapter per state with margin notes; no numbering, because the order of travel is not confirmed. A reveals each photograph as it arrives. B draws a route line down the margin. C settles each photograph from oversize into its frame.">
        <Variants value={v} onChange={setV} labels={["Chapter reveal", "Route line", "Frame settle"]} />
        <div data-route className="relative mt-6 overflow-x-clip">
          <span data-line aria-hidden="true" className={`absolute left-[0.35rem] top-0 hidden h-full w-px origin-top bg-crimson lg:block ${v === 1 ? "" : "opacity-0"}`} />
          {southToNorth.map((s) => (
            <Chapter key={s.name} state={s} />
          ))}
        </div>
      </LabSection>
    </div>
  );
}

/* 9. Section transitions: paper into ink */
export function SectionTransitions() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const ink = q("[data-ink]")[0];
      const st = { trigger: ink, start: "top bottom", end: "top 20%", scrub: c.lag || true };
      if (v === 0) gsap.fromTo(ink, { clipPath: "inset(0% 5% 0% 5% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: st });
      if (v === 1) {
        gsap.fromTo(q("[data-paper]"), { scale: 1, opacity: 1 }, { scale: 0.94, opacity: 0.55, ease: "none", scrollTrigger: { ...st, trigger: ink } });
        gsap.fromTo(ink, { yPercent: 12 }, { yPercent: 0, ease: "none", scrollTrigger: st });
      }
      if (v === 2) gsap.fromTo(q("[data-whole]"), { backgroundColor: "#f3f0ea", color: "#141210" }, { backgroundColor: "#141210", color: "#f5f1ea", ease: "none", scrollTrigger: { trigger: ink, start: "top 75%", end: "top 25%", scrub: c.lag || true } });
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <div ref={ref}>
      <LabSection id="x9" n={9} title="Section transitions" note="Paper into the dark archive. A widens an inset sheet (current). B lets the ink page rise over a receding paper page. C turns the whole page from paper to ink as you cross.">
        <Variants value={v} onChange={setV} labels={["Sheet widens (current)", "Ink rises over paper", "Page turns dark"]} />
      </LabSection>
      <div data-whole className={v === 2 ? "bg-paper" : ""}>
        <div data-paper className="page grid h-[70svh] place-items-center">
          <p className="d-l">A paper chapter</p>
        </div>
        <div data-ink className={`${v === 2 ? "" : "bg-ink text-ivory"} grid h-[90svh] place-items-center`}>
          <p className="d-l">A decade on the road</p>
        </div>
      </div>
    </div>
  );
}

/* 10. Navigation interactions */
const items = ["The route", "The format", "Archive", "Admissions"];
export function NavInteractions() {
  const c = useControls();
  const [v, setV] = useState(0);
  const [active, setActive] = useState(0);
  const ease = MOTION_EASE[c.ease] ?? MOTION_EASE.land;
  return (
    <LabSection id="x10" n={10} title="Navigation interactions" note="Click or use Tab and Enter. A slides a hairline under the active item. B moves a small dot. C shifts the active item and marks it with a short crimson rule.">
      <Variants value={v} onChange={setV} labels={["Sliding hairline", "Moving dot", "Shift and mark"]} />
      <nav aria-label="Demo navigation" className="mt-8">
        <ul className="flex flex-wrap gap-8 text-[0.95rem]">
          {items.map((it, i) => (
            <li key={it} className="relative">
              <button type="button" aria-current={active === i ? "true" : undefined} onClick={() => setActive(i)} className={`relative flex min-h-11 items-center transition-colors ${active === i ? "text-ink" : "text-muted hover:text-ink"}`}>
                <motion.span animate={v === 2 && active === i ? { x: 14 } : { x: 0 }} transition={{ duration: c.duration * 0.4, ease }}>
                  {it}
                </motion.span>
                {active === i ? (
                  <motion.span
                    layoutId={`nav-${v}`}
                    aria-hidden="true"
                    transition={{ duration: c.duration * 0.45, ease }}
                    className={v === 0 ? "absolute inset-x-0 bottom-1.5 h-px bg-ink" : v === 1 ? "absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-crimson" : "absolute left-0 top-1/2 h-px w-2.5 bg-crimson"}
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </LabSection>
  );
}

/* 11. Buttons and links */
export function LinkHovers() {
  const [v, setV] = useState(0);
  return (
    <LabSection id="x11" n={11} title="Buttons and link hovers" note="Hover or focus each. A draws an underline in and out. B is the ring action (current). C rolls the label up to a second line in crimson.">
      <Variants value={v} onChange={setV} labels={["Drawn underline", "Ring fill", "Label roll"]} />
      <style>{`
        .lab-roll{display:inline-flex;overflow:hidden;height:1.4em;line-height:1.4em}
        .lab-roll span{display:block;transition:transform 520ms cubic-bezier(.22,1,.36,1)}
        .lab-roll:hover span,.lab-roll:focus-visible span{transform:translateY(-100%)}
      `}</style>
      <div className="mt-8 flex flex-wrap items-center gap-12 text-[1.1rem]">
        {v === 0 ? (
          <a href="#x11" className="tlink">Write to the GGY team</a>
        ) : v === 1 ? (
          <a href="#x11" className="cta">
            <span>Write to the GGY team</span>
            <span className="cta-ring" aria-hidden="true"><span className="cta-arrow">→</span></span>
          </a>
        ) : (
          <a href="#x11" className="lab-roll font-medium" aria-label="Write to the GGY team">
            <span aria-hidden="true" className="flex flex-col">
              <span>Write to the GGY team</span>
              <span className="text-crimson">Write to the GGY team</span>
            </span>
          </a>
        )}
      </div>
    </LabSection>
  );
}

/* 12. Page entrance and exit */
export function PageTransitions() {
  const c = useControls();
  const [v, setV] = useState(0);
  const [page, setPage] = useState(0);
  const ease = MOTION_EASE[c.ease] ?? MOTION_EASE.land;
  const d = c.duration * 0.6;
  const overlay =
    v === 0
      ? { initial: { scaleY: 0, originY: 1 }, animate: { scaleY: [0, 1, 1, 0], originY: [1, 1, 0, 0] }, className: "bg-ink" }
      : v === 1
        ? { initial: { x: "-100%" }, animate: { x: ["-100%", "0%", "0%", "100%"] }, className: "bg-crimson-deep" }
        : { initial: { opacity: 0 }, animate: { opacity: [0, 1, 1, 0] }, className: "bg-paper" };
  return (
    <LabSection id="x12" n={12} title="Page entrance and exit" note="For moving between future pages. A wipes ink up and away. B passes a crimson sheet across. C fades through paper.">
      <Variants value={v} onChange={setV} labels={["Ink wipe", "Crimson pass", "Fade through paper"]} />
      <div className="relative mt-8 h-[22rem] overflow-hidden border border-hair bg-light">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: d * 0.5, duration: d, ease } }} exit={{ opacity: 0, transition: { duration: d * 0.4 } }} className="absolute inset-0 grid place-items-center">
            <p className="d-m">{page ? "Admissions" : "The archive"}</p>
          </motion.div>
        </AnimatePresence>
        <motion.div key={`o-${page}-${v}`} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${overlay.className}`} initial={overlay.initial} animate={overlay.animate} transition={{ duration: d * 1.6, ease, times: [0, 0.45, 0.55, 1] }} />
      </div>
      <button type="button" onClick={() => setPage((p) => (p ? 0 : 1))} className="tlink mt-5 text-[1rem]">
        Change page
      </button>
    </LabSection>
  );
}
