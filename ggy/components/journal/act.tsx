"use client";

import Image from "next/image";
import { useRef } from "react";
import { photos, type PhotoKey } from "@/content/ggy";
import { gsap, useGSAP } from "@/lib/gsap";

type ActProps = {
  id: string;
  /** Roman numeral shown on the act's label. */
  n: string;
  title: string;
  dek: string;
  /** The first photograph becomes the full-bleed one; the other four ring it. */
  photos: [PhotoKey, PhotoKey, PhotoKey, PhotoKey, PhotoKey];
};

/* Where each print rests around the centre (in vw/vh from it), its size,
   and the scale it runs between. The centre print is laid out full screen
   and starts at a quarter, so it is never enlarged past its own pixels and
   stays sharp when it fills the screen. */
const FRAMES = [
  { x: 0, y: 0, w: 100, h: 100, from: 0.25, to: 1 },
  { x: 5, y: -30, w: 30, h: 26, from: 1, to: 5.2 },
  { x: -25, y: -15, w: 18, h: 32, from: 1, to: 6 },
  { x: 28, y: 2, w: 22, h: 26, from: 1, to: 5.4 },
  { x: 8, y: 29, w: 18, h: 22, from: 1, to: 6.4 },
];

/**
 * A chapter opening. Five photographs from the act are laid out loosely
 * around the title like prints on a table; scrolling pushes the camera in,
 * every print grows at its own rate, the outer ones fly past the edges and
 * the centre one fills the screen, where the title returns in white over it.
 * The prints lean a little toward the pointer, so the table has depth.
 *
 * Without motion it is a still: the centre photograph at full bleed with
 * the title on it.
 */
export function Act({ id, n, title, dek, photos: keys }: ActProps) {
  const root = useRef<HTMLElement>(null);
  const headingId = `${id}-title`;
  const main = photos[keys[0]];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        const q = gsap.utils.selector(el);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.5 },
        });
        q("[data-zoom]").forEach((frame, i) => {
          tl.fromTo(frame, { scale: FRAMES[i].from }, { scale: FRAMES[i].to, ease: "power2.in", duration: 1, force3D: true }, 0);
        });
        tl.fromTo(q("[data-zoom-img]"), { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
          .fromTo(q(".is-main .act__print"), { borderRadius: "1.6rem" }, { borderRadius: "0rem", duration: 0.9, ease: "power2.in" }, 0)
          .to(q("[data-act-intro]"), { autoAlpha: 0, y: -40, filter: "blur(8px)", duration: 0.28 }, 0.02)
          .fromTo(q("[data-act-scrim]"), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.68)
          .fromTo(q("[data-act-outro] > *"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.2 }, 0.74);

        // Depth under a fine pointer: outer prints drift more than the centre.
        const fine = window.matchMedia("(pointer: fine)").matches;
        if (!fine) return;
        const movers = q("[data-zoom-inner]").map((inner, i) => ({
          x: gsap.quickTo(inner, "x", { duration: 1, ease: "power3" }),
          y: gsap.quickTo(inner, "y", { duration: 1, ease: "power3" }),
          k: i === 0 ? 28 : 14 + i * 4,
        }));
        const stage = q("[data-act-stage]")[0] as HTMLElement;
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * m.k);
            m.y(-ny * m.k);
          });
        };
        stage.addEventListener("pointermove", onMove);
        return () => stage.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} className="act" data-act data-j-station={id} data-nav="dark" aria-labelledby={headingId}>
      <div className="act__stage" data-act-stage>
        {FRAMES.map((f, i) => {
          const p = photos[keys[i]];
          return (
            <div key={keys[i] + i} className={`act__zoom${i === 0 ? " is-main" : ""}`} data-zoom>
              <div
                className="act__print"
                data-zoom-inner
                style={{ width: `${f.w}vw`, height: `${f.h}vh`, translate: `${f.x}vw ${f.y}vh` }}
              >
                <div className="act__img" data-zoom-img>
                  <Image src={p.src} alt={i === 0 ? p.alt : ""} fill quality={80} sizes={i === 0 ? "100vw" : "40vw"} className="object-cover" />
                </div>
              </div>
            </div>
          );
        })}
        <div className="act__scrim" data-act-scrim />

        <div className="act__intro" data-act-intro>
          <p className="act__label">
            <span>Act {n}</span>
          </p>
          <h2 id={headingId} className="act__title">
            {title}
          </h2>
          <p className="act__dek">{dek}</p>
          <p className="act__cue" aria-hidden="true">
            Scroll to step in
          </p>
        </div>

        <div className="act__outro" data-act-outro aria-hidden="true">
          <p className="act__label is-light">
            <span>Act {n}</span>
          </p>
          <p className="act__title">{title}</p>
          <p className="act__dek">{dek}</p>
          <p className="act__credit">
            {main.caption.replace(/\.$/, "")}. {main.credit}
          </p>
        </div>
      </div>
    </section>
  );
}
