"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { pastEditions, photos } from "@/content/ggy";
import { clipFrom, LabSection, useControls, Variants } from "./controls";
import { Strips } from "./strips";

/* 1. Hero entrance */
export function HeroEntrance() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline();
      const lines = q("[data-line]");
      if (v === 0) {
        tl.fromTo(q("[data-si]"), { scale: 1.24 }, { scale: 1.06, duration: c.duration * 1.8, ease: "expo.out" }, 0)
          .from(q("[data-s]"), { yPercent: (i) => (i % 2 ? 8 : -8), duration: c.duration * 1.4, ease: "expo.out", stagger: c.stagger / 2 }, 0);
      } else if (v === 1) {
        tl.fromTo(q("[data-frame]"), { clipPath: clipFrom(c.dir) }, { clipPath: "inset(0% 0% 0% 0%)", duration: c.duration, ease: c.ease }, 0).fromTo(
          q("[data-si]"),
          { scale: 1.22 },
          { scale: 1.06, duration: c.duration * 1.6, ease: "expo.out" },
          0,
        );
      } else {
        tl.from(q("[data-s]"), { yPercent: -102, duration: c.duration, ease: c.ease, stagger: c.stagger }, 0).fromTo(
          q("[data-si]"),
          { scale: 1.15 },
          { scale: 1.06, duration: c.duration * 1.6, ease: "expo.out" },
          0,
        );
      }
      tl.from(lines, { yPercent: 110, duration: c.duration, ease: c.ease, stagger: c.stagger * 1.5 }, c.duration * c.offset);
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <LabSection id="x1" n={1} title="Hero entrance" note="On load. A is the current site (strips settle). B wipes the whole photograph in from the chosen direction. C drops the strips from above in sequence.">
      <Variants value={v} onChange={setV} labels={["Strips settle (current)", "Mask wipe", "Strips drop"]} />
      <div ref={ref} className="mt-6">
        <div data-frame className="relative aspect-[16/8] overflow-hidden bg-ink">
          <Strips n={6} axis="v" sizes="90vw" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_18_16/0.7),transparent_60%)]" />
          <p className="absolute bottom-8 left-8 font-display text-[clamp(2.5rem,1rem+5vw,6rem)] font-light leading-[0.9] tracking-[-0.04em] text-ivory">
            <span className="block overflow-hidden"><span data-line className="block">Good Governance</span></span>
            <span className="block overflow-hidden"><span data-line className="block">Yatra</span></span>
          </p>
        </div>
      </div>
    </LabSection>
  );
}

/* 2. Image-mask reveal */
export function MaskReveal() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (v === 0) gsap.fromTo(q("[data-frame]"), { clipPath: clipFrom(c.dir) }, { clipPath: "inset(0% 0% 0% 0%)", duration: c.duration, ease: c.ease });
      if (v === 1) gsap.fromTo(q("[data-frame]"), { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: c.duration, ease: c.ease });
      if (v === 2) gsap.fromTo(q("[data-s]"), { clipPath: clipFrom(c.dir) }, { clipPath: "inset(0% 0% 0% 0%)", duration: c.duration, ease: c.ease, stagger: c.stagger });
      gsap.fromTo(q("img"), { scale: 1.2 }, { scale: 1, duration: c.duration * 1.4, ease: "expo.out" });
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <LabSection id="x2" n={2} title="Image-mask reveal" note="Time-based. Direction comes from the control panel.">
      <Variants value={v} onChange={setV} labels={["Inset wipe", "Aperture", "Strip wipe"]} />
      <div ref={ref} className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
        <div data-frame className="relative aspect-[3/2] overflow-hidden bg-sand">
          {v === 2 ? <Strips n={5} axis="v" photo="oldSecretariat" sizes="60vw" /> : <Image src={photos.oldSecretariat.src} alt={photos.oldSecretariat.alt} fill sizes="60vw" className="object-cover" />}
        </div>
        <p className="caption self-end">{photos.oldSecretariat.caption}. {photos.oldSecretariat.credit}</p>
      </div>
    </LabSection>
  );
}

/* 3. Typography entrance */
export function TypeEntrance() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current?.querySelector<HTMLElement>("[data-head]");
      if (!el) return;
      const type = v === 0 ? "lines" : v === 1 ? "words" : "chars,words";
      const split = SplitText.create(el, { type, mask: v === 1 ? undefined : v === 0 ? "lines" : "chars" });
      if (v === 0) gsap.from(split.lines, { yPercent: 110, duration: c.duration, ease: c.ease, stagger: c.stagger });
      if (v === 1) gsap.from(split.words, { y: 24, autoAlpha: 0, duration: c.duration * 0.8, ease: c.ease, stagger: c.stagger / 2 });
      if (v === 2) gsap.from(split.chars, { yPercent: 105, duration: c.duration * 0.7, ease: c.ease, stagger: c.stagger / 6 });
      return () => split.revert();
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <LabSection id="x3" n={3} title="Typography entrance" note="One headline only. The site should use this once, not on every heading.">
      <Variants value={v} onChange={setV} labels={["Lines from mask", "Words settle", "Characters from mask"]} />
      <div ref={ref} className="mt-6">
        <p data-head className="d-l max-w-[18ch]">
          India’s oldest immersive yatra into <em className="italic">governance</em> and <em className="italic">leadership</em>
        </p>
      </div>
    </LabSection>
  );
}

/* 4. Image scaling within a fixed frame (scroll) */
export function ImageScaling() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const st = { trigger: q("[data-frame]")[0], start: "top bottom", end: v === 1 ? "bottom top" : "center center", scrub: c.lag || true };
      if (v === 0) gsap.fromTo(q("img"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: st });
      if (v === 1) gsap.fromTo(q("img"), { scale: 1 }, { scale: 1.15, ease: "none", scrollTrigger: st });
      if (v === 2) {
        gsap.fromTo(q("[data-frame]"), { scale: 0.82 }, { scale: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("img"), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: st });
      }
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <LabSection id="x4" n={4} title="Image scaling" note="Scroll-linked. Scroll lag sets how far the image trails the scroll position.">
      <Variants value={v} onChange={setV} labels={["Settle into frame", "Slow push-in", "Frame and image counter-scale"]} />
      <div ref={ref} className="mt-10 pb-[30vh]">
        <div data-frame className="relative mx-auto aspect-[16/9] w-[80%] overflow-hidden bg-sand">
          <Image src={photos.lectureHall.src} alt={photos.lectureHall.alt} fill sizes="80vw" className="object-cover" />
        </div>
      </div>
    </LabSection>
  );
}

/* 5. Full-screen image transition (pinned inside the lab) */
export function FullScreen() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-stage]")[0], start: "top top", end: "+=120%", pin: true, scrub: c.lag || true } });
      if (v === 0) tl.fromTo(q("[data-frame]"), { clipPath: "inset(18% 26% 18% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: c.ease });
      if (v === 1) tl.fromTo(q("[data-frame]"), { clipPath: "inset(45% 52% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: c.ease });
      if (v === 2) tl.fromTo(q("[data-frame]"), { scale: 0.55 }, { scale: 1, ease: c.ease });
      tl.fromTo(q("img"), { scale: 1.3 }, { scale: 1, ease: "none" }, 0).fromTo(q("[data-cap]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0 }, 1 - c.offset * 0.5);
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <div ref={ref}>
      <LabSection id="x5" n={5} title="Full-screen image transition" note="Pinned here for testing only. A opens from a centred frame, B from the lower left, C scales the whole frame.">
        <Variants value={v} onChange={setV} labels={["Centred aperture", "Corner opening", "Frame scale"]} />
      </LabSection>
      <div data-stage className="relative h-svh overflow-hidden bg-paper">
        <div data-frame className="absolute inset-0 overflow-hidden">
          <Image src={photos.municipalCorporation.src} alt={photos.municipalCorporation.alt} fill sizes="100vw" className="object-cover" />
          <p data-cap className="absolute bottom-10 left-10 font-display text-[clamp(2.5rem,1rem+4vw,5rem)] font-light text-ivory drop-shadow">Maharashtra</p>
        </div>
      </div>
    </div>
  );
}

/* 6. Horizontal storytelling (pinned track inside the lab) */
export function Horizontal() {
  const c = useControls();
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const track = q("[data-track]")[0] as HTMLElement;
      const dist = () => track.scrollWidth - window.innerWidth;
      const travel = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: q("[data-road]")[0], start: "top top", end: () => `+=${dist()}`, pin: true, scrub: c.lag || true, invalidateOnRefresh: true } });
      if (v === 1)
        q("[data-card]").forEach((el) =>
          gsap.from(el, { yPercent: 40, autoAlpha: 0, duration: c.duration, ease: c.ease, scrollTrigger: { trigger: el, containerAnimation: travel, start: "left 90%", toggleActions: "play none none reverse" } }),
        );
      if (v === 2)
        q("[data-pimg]").forEach((el) =>
          gsap.fromTo(el, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: el.parentElement, containerAnimation: travel, start: "left right", end: "right left", scrub: true } }),
        );
    },
    { scope: ref, dependencies: [c, v], revertOnUpdate: true },
  );
  return (
    <div ref={ref}>
      <LabSection id="x6" n={6} title="Horizontal storytelling" note="The archive road. A travels only; B lifts each year in as it arrives; C adds depth by moving photographs inside their frames.">
        <Variants value={v} onChange={setV} labels={["Travel only", "Years rise in", "Depth in photographs"]} />
      </LabSection>
      <div data-road className="on-dark flex h-svh items-center overflow-hidden bg-ink text-ivory">
        <ol data-track className="flex w-max items-center gap-16 px-[var(--gutter)]">
          {pastEditions.map((e, i) => (
            <li key={e.year + e.route} className="flex items-center gap-16">
              <div data-card className="w-[20rem]">
                <p className="num text-[7rem] leading-none">{e.year}</p>
                <p className="mt-3 font-display text-[1.3rem] leading-snug text-dim">{e.route}</p>
              </div>
              {i === 1 || i === 4 ? (
                <div className="relative aspect-[3/2] w-[26rem] overflow-hidden">
                  <div data-pimg className="absolute inset-[0_-14%]">
                    <Image src={i === 1 ? photos.flagOff.src : photos.address.src} alt="" fill sizes="30vw" className="object-cover" />
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
