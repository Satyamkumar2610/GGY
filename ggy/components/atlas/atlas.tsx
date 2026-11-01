"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photos, stateDossiers, upcoming, type StateDossier } from "@/content/ggy";
import { gsap, MOTION_QUERIES, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { formatCoords, invert, type FocusIso } from "@/lib/atlas";
import { Button, Script, Value } from "../primitives";
import { stamp } from "@/lib/journal";
import { AtlasMap } from "./atlas-map";
import {
  cameraFor,
  centreCoords,
  clamp01,
  frameFor,
  LABELS,
  labelOpacity,
  lerpCamera,
  lookAt,
  scaleBar,
  smooth,
  STAGES,
  type Layout,
} from "./atlas-engine";
import { StateDossierPanel } from "./state-dossier";

const nativeOf = (name: string) => upcoming.states.find((s) => s.name === name)!;

/**
 * Sections 01 and 02: the opening and the three states, on one map.
 *
 * A sticky stage holds the atlas while the text flows over it. The camera
 * begins on all of India, its silhouette printed with a photograph of
 * delegates, the three states of the upcoming edition in colour; it then
 * travels west and visits Gujarat, Goa and Maharashtra in turn, an editorial
 * sequence, not the order of travel. Any of the three opens its dossier.
 */
export function Atlas() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ iso: FocusIso; from: HTMLElement | null } | null>(null);
  // Becomes true once a mouse is over the map, which is when the other lights are fetched.
  const [lit, setLit] = useState(false);
  const litRef = useRef(false);
  // While a dossier is open the camera flies to its state; scrolling is paused.
  const forced = useRef<number | null>(null);
  useEffect(() => {
    forced.current = open ? STAGES.indexOf(open.iso) : null;
  }, [open]);

  const openDossier = useCallback((iso: FocusIso, from?: HTMLElement | null) => {
    setOpen({ iso, from: from ?? (document.activeElement as HTMLElement | null) });
    // Opening a state's dossier stamps it into the visitor's own journal.
    stamp(iso);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const svg = el.querySelector<SVGSVGElement>("[data-atlas-svg]")!;
      const camera = el.querySelector<SVGGElement>("[data-camera]")!;
      const indiaPhoto = el.querySelector<SVGGElement>('[data-layer="india-photo"]')!;
      const reliefLayer = el.querySelector<SVGGElement>('[data-layer="relief"]')!;
      const veil = el.querySelector<HTMLElement>("[data-veil]");
      const loupeClip = el.querySelector<SVGCircleElement>("[data-loupe-clip]")!;
      const cursorEl = el.querySelector<HTMLElement>("[data-cursor-el]");
      const cursorRead = el.querySelector<HTMLElement>("[data-cursor-read]");
      const cursorNote = el.querySelector<HTMLElement>("[data-cursor-note]");
      let lastCam = { k: 1, x: 0, y: 0 };
      let indiaLook = 1;
      // Pointer state for the cartographer's cursor (set up below).
      let px = -1;
      let py = -1;
      let pending = 0;
      let cursorOn = false;
      const statePhotos = Object.fromEntries(Array.from(el.querySelectorAll<SVGGElement>("[data-state-photo]")).map((g) => [g.dataset.statePhoto, g])) as Record<FocusIso, SVGGElement>;
      const labelEls = LABELS.map((l) => el.querySelector<HTMLElement>(`[data-label="${l.id}"]`));
      const readout = q("[data-readout]")[0] as HTMLElement;
      const scaleEl = q("[data-scale]")[0] as HTMLElement;
      const scaleText = q("[data-scale-text]")[0] as HTMLElement;
      const blocks = q("[data-stage]") as HTMLElement[];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let layout: Layout = { w: 1440, h: 900, header: 68, wide: true };
      let cams = STAGES.map((s) => cameraFor(s, layout));
      let anchors: number[] = [];
      let target = 0;
      let current = 0;
      let lastDrawn = -1;
      let lastActive = "";

      const measure = () => {
        const header = document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 68;
        layout = { w: svg.clientWidth || window.innerWidth, h: svg.clientHeight || window.innerHeight, header, wide: window.innerWidth >= 1024 };
        svg.setAttribute("viewBox", `0 0 ${layout.w} ${layout.h}`);
        cams = STAGES.map((s) => cameraFor(s, layout));
        const top = el.getBoundingClientRect().top + window.scrollY;
        anchors = blocks.map((b, i) => {
          if (i === 0) return top;
          const r = b.getBoundingClientRect();
          return r.top + window.scrollY + r.height / 2 - layout.h / 2;
        });
        for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
        lastDrawn = -1;
      };

      const stageAt = (y: number) => {
        if (y <= anchors[0]) return 0;
        for (let i = 0; i < anchors.length - 1; i++) {
          if (y < anchors[i + 1]) {
            const t = (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
            return i + smooth(clamp01((t - 0.12) / 0.76));
          }
        }
        return anchors.length - 1;
      };

      const draw = (s: number) => {
        if (Math.abs(s - lastDrawn) < 0.0005) return;
        lastDrawn = s;
        const i = Math.min(Math.floor(s), STAGES.length - 1);
        const j = Math.min(i + 1, STAGES.length - 1);
        const fA = frameFor(STAGES[i], layout);
        const fB = frameFor(STAGES[j], layout);
        const t = s - i;
        const cx = (fA[0] + fA[2]) / 2 + (((fB[0] + fB[2]) / 2 - (fA[0] + fA[2]) / 2) * t);
        const cy = (fA[1] + fA[3]) / 2 + (((fB[1] + fB[3]) / 2 - (fA[1] + fA[3]) / 2) * t);
        // Interpolate about the moving frame centre so the zoom feels anchored.
        const a = { ...cams[i], x: cams[i].x + 0, y: cams[i].y };
        const cam = t === 0 ? a : lerpCamera(a, cams[j], t, cx, cy);
        camera.setAttribute("transform", `translate(${cam.x.toFixed(2)} ${cam.y.toFixed(2)}) scale(${cam.k.toFixed(4)})`);

        lastCam = cam;
        if (cursorOn && !pending) pending = requestAnimationFrame(placeCursor);
        const look = lookAt(s);
        indiaLook = look.india;
        indiaPhoto.style.opacity = look.india.toFixed(3);
        reliefLayer.style.opacity = (1 - look.india).toFixed(3);
        if (veil) veil.style.opacity = layout.wide ? clamp01((1 - look.india) * 1.4).toFixed(3) : "0";
        indiaPhoto.style.display = look.india < 0.005 ? "none" : "";
        statePhotos["IN-GJ"].style.opacity = look.GJ.toFixed(3);
        statePhotos["IN-GA"].style.opacity = look.GA.toFixed(3);
        statePhotos["IN-MH"].style.opacity = look.MH.toFixed(3);

        LABELS.forEach((l, n) => {
          const node = labelEls[n];
          if (!node) return;
          const o = labelOpacity(l, s);
          node.style.opacity = o.toFixed(3);
          node.style.visibility = o < 0.01 ? "hidden" : "visible";
          if (o >= 0.01) node.style.transform = `translate3d(${(l.x * cam.k + cam.x).toFixed(1)}px, ${(l.y * cam.k + cam.y).toFixed(1)}px, 0)`;
        });

        const ll = centreCoords(cam, [cx - 1, cy - 1, cx + 1, cy + 1]);
        if (ll && readout) readout.textContent = formatCoords(ll[0], ll[1]);
        const sb = scaleBar(cam.k);
        if (scaleEl) scaleEl.style.width = `${sb.px.toFixed(1)}px`;
        if (scaleText) scaleText.textContent = `${sb.km} km`;

        const active = STAGES[Math.round(s)];
        if (active !== lastActive) {
          lastActive = active;
          el.dataset.active = active;
        }
      };

      measure();
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onRefresh: () => {
          measure();
          target = stageAt(window.scrollY);
          current = target;
          draw(current);
        },
        onUpdate: () => {
          target = stageAt(window.scrollY);
          if (reduce) {
            current = Math.round(target);
            draw(current);
          }
        },
      });
      target = stageAt(window.scrollY);
      current = target;
      draw(current);

      const tick = (_t: number, dt: number) => {
        const goal = forced.current ?? target;
        if (reduce) {
          if (forced.current !== null && current !== goal) {
            current = goal;
            draw(current);
          }
          return;
        }
        const d = goal - current;
        if (Math.abs(d) < 0.0004) {
          if (current !== goal) {
            current = goal;
            draw(current);
          }
          return;
        }
        current += d * (1 - Math.pow(1 - (forced.current !== null ? 0.06 : 0.14), dt / 16.67));
        draw(current);
      };
      gsap.ticker.add(tick);

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(svg);

      /* ---- The cartographer's cursor and the loupe (fine pointers) ---- */
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      /* ---- The light follows the pointer: eight baked hillshades, two blended ---- */
      let lightTarget = 315;
      let lightCur = 315;
      const applyLight = () => {
        const lower = Math.floor(lightCur / 45) * 45;
        const frac = (lightCur - lower) / 45;
        const a = lower % 360;
        const b = (lower + 45) % 360;
        el.querySelectorAll<SVGImageElement>("[data-relief-az]").forEach((img) => {
          const az = Number(img.dataset.reliefAz);
          img.style.opacity = az === a ? (frac < 0.001 ? "1" : (1 - frac).toFixed(3)) : az === b ? frac.toFixed(3) : "0";
        });
      };
      const lightTick = (_t: number, dt: number) => {
        const delta = ((lightTarget - lightCur + 540) % 360) - 180;
        if (Math.abs(delta) < 0.05) return;
        lightCur = (lightCur + delta * (1 - Math.pow(1 - 0.1, dt / 16.67)) + 360) % 360;
        applyLight();
      };
      if (fine && !reduce) gsap.ticker.add(lightTick);
      const placeCursor = () => {
        pending = 0;
        if (!cursorEl || px < 0 || !cursorOn) return;
        // What is under the pointer changes as the map moves beneath it.
        const under = document.elementFromPoint(px, py);
        const hit = under?.closest?.("[data-hit]") as SVGElement | null;
        if (cursorNote) cursorNote.textContent = hit ? (hit.getAttribute("aria-label") ?? "") : "";
        cursorEl.classList.toggle("is-over-state", !!hit);
        const r = svg.getBoundingClientRect();
        const ax = (px - r.left - lastCam.x) / lastCam.k;
        const ay = (py - r.top - lastCam.y) / lastCam.k;
        cursorEl.style.transform = `translate3d(${px - r.left}px, ${py - r.top}px, 0)`;
        const ll = invert(ax, ay);
        if (cursorRead && ll) cursorRead.textContent = formatCoords(ll[0], ll[1]);
        // The loupe opens only over the photograph of India, in the opening.
        const lens = indiaLook > 0.5;
        loupeClip.setAttribute("cx", ax.toFixed(1));
        loupeClip.setAttribute("cy", ay.toFixed(1));
        loupeClip.setAttribute("r", lens ? (68 / lastCam.k).toFixed(2) : "0");
        cursorEl.classList.toggle("is-lens", lens);
      };
      /* Touch: press and hold on the opening map to lift the loupe above the finger. */
      const LIFT = 104;
      let pressTimer = 0;
      let pressAt: { x: number; y: number } | null = null;
      let touchLens = false;
      const endTouch = () => {
        window.clearTimeout(pressTimer);
        pressAt = null;
        if (!touchLens) return;
        touchLens = false;
        cursorOn = false;
        cursorEl?.classList.remove("is-on", "is-lens", "is-touch");
        loupeClip.setAttribute("r", "0");
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch" || indiaLook < 0.5 || reduce) return;
        pressAt = { x: e.clientX, y: e.clientY };
        window.clearTimeout(pressTimer);
        pressTimer = window.setTimeout(() => {
          if (!pressAt) return;
          touchLens = true;
          cursorOn = true;
          px = pressAt.x;
          py = pressAt.y - LIFT;
          cursorEl?.classList.add("is-on", "is-touch");
          if (navigator.vibrate) navigator.vibrate(8);
          placeCursor();
        }, 480);
      };
      const onTouchMove = (e: PointerEvent) => {
        if (touchLens) {
          px = e.clientX;
          py = e.clientY - LIFT;
          if (!pending) pending = requestAnimationFrame(placeCursor);
        } else if (pressAt && Math.hypot(e.clientX - pressAt.x, e.clientY - pressAt.y) > 10) {
          // The finger is scrolling, not holding.
          window.clearTimeout(pressTimer);
          pressAt = null;
        }
      };
      const stopScrollWhileLens = (e: TouchEvent) => {
        if (touchLens && e.cancelable) e.preventDefault();
      };
      svg.addEventListener("pointerdown", onDown);
      svg.addEventListener("pointermove", onTouchMoveGate);
      svg.addEventListener("pointerup", endTouch);
      svg.addEventListener("pointercancel", endTouch);
      svg.addEventListener("touchmove", stopScrollWhileLens, { passive: false });

      function onTouchMoveGate(e: PointerEvent) {
        if (e.pointerType === "touch") onTouchMove(e);
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        px = e.clientX;
        py = e.clientY;
        if (!reduce && e.pointerType === "mouse") {
          if (!litRef.current) {
            litRef.current = true;
            setLit(true);
          }
          // Light comes from where the pointer is, around the centre of the map.
          const r = svg.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width * 0.72);
          const dy = e.clientY - (r.top + r.height * 0.5);
          if (Math.hypot(dx, dy) > 24) lightTarget = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
        }
        if (!pending) pending = requestAnimationFrame(placeCursor);
      };
      const onEnter = () => {
        cursorOn = true;
        cursorEl?.classList.add("is-on");
      };
      const onLeave = () => {
        lightTarget = 315;
        cursorOn = false;
        cursorEl?.classList.remove("is-on", "is-lens", "is-over-state");
        loupeClip.setAttribute("r", "0");
      };
      if (fine) {
        svg.addEventListener("pointermove", onMove);
        svg.addEventListener("pointerenter", onEnter);
        svg.addEventListener("pointerleave", onLeave);
        el.classList.add("has-cursor");
      }

      /* ---- The opening ---- */
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        const splits: SplitText[] = [];
        const title = q("[data-hero-title]")[0] as HTMLElement | undefined;
        const lines = title ? SplitText.create(title, { type: "lines", mask: "lines" }) : null;
        if (lines) splits.push(lines);
        const tl = gsap.timeline({ defaults: { ease: "land" }, delay: 0.15 });
        gsap.set(q("[data-intro]"), { visibility: "visible" });
        el.dataset.ready = "";
        tl.fromTo(q("[data-a-grat]"), { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power1.out" }, 0)
          .fromTo(q("[data-a-outline]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: "swing" }, 0.1)
          .fromTo(q("[data-a-ctx]"), { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.05, ease: "power1.out" }, 0.6)
          .fromTo(q("[data-a-reveal]"), { attr: { r: 0 } }, { attr: { r: 1400 }, duration: 2.8, ease: "expo.inOut" }, 0.9)
          .fromTo(q(".atlas-focus"), { opacity: 0 }, { opacity: 1, duration: 1.1, stagger: 0.22 }, 1.5)
          .fromTo(q("[data-a-focus-line]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.22, ease: "swing" }, 1.5)
          .fromTo(q("[data-a-labels]"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 2.3)
          .fromTo(q("[data-hero-meta] > *"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.4);
        if (lines) tl.from(lines.lines, { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.7);
        tl.fromTo(q("[data-hero-line]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.3).fromTo(
          q("[data-hero-cue]"),
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: "top", duration: 0.9 },
          2.3,
        );

        // The hero type leaves as the camera starts west.
        gsap.to(q("[data-hero-copy]"), {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: q("[data-hero-block]")[0], start: "top top", end: "bottom 35%", scrub: 0.6 },
        });
        return () => splits.forEach((s) => s.revert());
      });

      return () => {
        st.kill();
        if (fine) {
          svg.removeEventListener("pointermove", onMove);
          svg.removeEventListener("pointerenter", onEnter);
          svg.removeEventListener("pointerleave", onLeave);
        }
        svg.removeEventListener("pointerdown", onDown);
        svg.removeEventListener("pointermove", onTouchMoveGate);
        svg.removeEventListener("pointerup", endTouch);
        svg.removeEventListener("pointercancel", endTouch);
        svg.removeEventListener("touchmove", stopScrollWhileLens);
        window.clearTimeout(pressTimer);
        cancelAnimationFrame(pending);
        gsap.ticker.remove(tick);
        gsap.ticker.remove(lightTick);
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  const dossier = open ? stateDossiers.find((d) => d.iso === open.iso)! : null;

  return (
    <div ref={root} className="atlas" data-atlas-root data-active="india">
      {/* The stage: sticky behind the flow */}
      <div className="atlas-stage">
        <div aria-hidden="true" className="atlas-veil" data-veil />
        <AtlasMap onState={(iso) => openDossier(iso)} lit={lit} />
        <div className="atlas-labels" aria-hidden="true" data-a-labels>
          {LABELS.map((l) => (
            <div key={l.id} data-label={l.id} className={`atlas-label atlas-label-${l.kind} align-${l.align ?? "center"}`}>
              {l.kind === "capital" ? <span className="atlas-capital-dot" /> : null}
              <span className="atlas-label-text">
                <span className="atlas-label-name">{l.text}</span>
                {l.native ? (
                  <Script lang={l.native.lang} className="atlas-label-native">
                    {l.native.text}
                  </Script>
                ) : null}
                {l.sub ? <span className="atlas-label-sub">{l.sub}</span> : null}
              </span>
            </div>
          ))}
        </div>
        {/* Cartographic furniture */}
        <div className="atlas-furniture" aria-hidden="true" data-a-labels>
          <span className="atlas-readout" data-readout>
            22.00° N  79.00° E
          </span>
          <span className="atlas-scale">
            <span className="atlas-scale-bar" data-scale />
            <span data-scale-text>500 km</span>
          </span>
          <span className="atlas-credit">Boundaries: Natural Earth, India point of view. Relief: Terrain Tiles (SRTM and others). India printed with a GGY brochure photograph.</span>
        </div>
        <div aria-hidden="true" className="atlas-cursor" data-cursor-el>
          <span className="atlas-cursor-ring" />
          <span className="atlas-cursor-cross" />
          <span className="atlas-cursor-read" data-cursor-read />
          <span className="atlas-cursor-note" data-cursor-note />
        </div>
      </div>

      {/* The flow: text that scrolls over the stage */}
      <div className="atlas-flow">
        <header id="top" className="atlas-block atlas-hero" data-stage="0" data-hero-block aria-labelledby="hero-title">
          <div className="page h-full">
            <div className="atlas-hero-copy" data-hero-copy>
              <dl className="atlas-meta" data-hero-meta>
                <div>
                  <dt>Edition</dt>
                  <dd>Upcoming</dd>
                </div>
                <div>
                  <dt>States</dt>
                  <dd>Maharashtra, Goa, Gujarat</dd>
                </div>
                <div>
                  <dt>Dates</dt>
                  <dd>
                    <Value value={upcoming.dates} />
                  </dd>
                </div>
              </dl>
              <h1 id="hero-title" className="atlas-title" data-hero-title>
                The Good Governance Yatra
              </h1>
              <p className="atlas-sub" data-hero-line data-intro>
                Governance is best understood where it happens.
              </p>
              <p className="atlas-lede" data-hero-line data-intro>
                An immersive journey through the institutions, people and ideas shaping India’s future.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" data-hero-line data-intro>
                <Button href="#states">Explore the journey</Button>
                <a href="#editions" className="tlink tlink-static text-[0.9rem]">
                  What is confirmed so far
                </a>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="atlas-cue" data-hero-cue data-intro>
            <span>Scroll west</span>
          </div>
        </header>

        <section id="states" aria-labelledby="states-title" className="atlas-states-flow" data-thread="The states">
          <div className="atlas-block" data-stage="1">
            <div className="page">
              <div className="atlas-panel">
                <p className="atlas-kicker">
                  Three states, one journey
                </p>
                <h2 id="states-title" className="d-l mt-5">
                  The western edge of India, read state by state.
                </h2>
                <p className="mt-6 max-w-[30rem] text-ink-soft">
                  The upcoming Yatra travels through Gujarat, Goa and Maharashtra. Scroll to visit each in turn, or choose a state on the map to open its dossier.
                </p>
                <p className="atlas-caveat mt-6">
                  The page follows an editorial sequence, Gujarat, Goa, then Maharashtra. It is not an itinerary: the stops and the order of travel are still to be announced.
                </p>
              </div>
            </div>
          </div>

          {stateDossiers.map((d, i) => (
            <StateChapter key={d.iso} d={d} stage={i + 2} onOpen={(el) => openDossier(d.iso, el)} />
          ))}

          <div className="atlas-block" data-stage="5">
            <div className="page">
              <div className="atlas-panel">
                <p className="atlas-kicker">
                  The region together
                </p>
                <h3 className="d-m mt-5">Gujarat and Maharashtra were formed on the same day in 1960. Goa became a state in 1987.</h3>
                <dl className="atlas-status mt-8">
                  {[
                    ["Dates", upcoming.dates],
                    ["Stops", upcoming.itinerary],
                    ["Order of travel", upcoming.orderOfTravel],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>
                        <Value value={v} />
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap gap-2">
                  {stateDossiers.map((d) => (
                    <button key={d.iso} type="button" className="atlas-chip" onClick={(e) => openDossier(d.iso, e.currentTarget)}>
                      {d.name} dossier
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <StateDossierPanel
        dossier={dossier}
        onClose={() => {
          const from = open?.from;
          setOpen(null);
          from?.focus?.({ preventScroll: true });
        }}
        onNavigate={(iso) => {
          setOpen((o) => ({ iso, from: o?.from ?? null }));
          stamp(iso);
        }}
      />
    </div>
  );
}

/* The photograph printed inside each state on the map, credited in its chapter. */
const MAP_PHOTO = { "IN-GJ": "sabarmati", "IN-GA": "bomJesus", "IN-MH": "gateway" } as const;
const DESCRIPTOR = { "IN-GJ": "The westernmost state", "IN-GA": "The Konkan coast", "IN-MH": "Coast, Ghats and Deccan" } as const;
const VARIANT = { "IN-GJ": "is-lead", "IN-GA": "is-quote", "IN-MH": "is-columns" } as const;

/**
 * A state's chapter. The photograph is on the map, inside the state's own
 * outline, so the chapter is typographic, and each of the three is set
 * differently: Gujarat leads with its name in Gujarati, Goa with its
 * introduction as a quotation, Maharashtra in two columns.
 */
function StateChapter({ d, stage, onOpen }: { d: StateDossier; stage: number; onOpen: (el: HTMLElement) => void }) {
  const photo = photos[MAP_PHOTO[d.iso]];
  const native = nativeOf(d.name);
  const variant = VARIANT[d.iso];
  const facts = (
    <dl className="atlas-facts">
      <div>
        <dt>Capital, for reference</dt>
        <dd>
          {d.capital.name}
          <span className="block text-[0.8rem] text-muted">{d.capital.coords}</span>
        </dd>
      </div>
      <div>
        <dt>Earlier editions here</dt>
        <dd>
          {d.editions.join(" and ")}
        </dd>
      </div>
    </dl>
  );
  return (
    <article className={`atlas-block atlas-chapter ${variant}`} data-stage={stage} aria-labelledby={`chapter-${d.iso}`}>
      <div className="page">
        <div className="atlas-panel">
          <p className="atlas-kicker">
            <span className="num">{d.chapter}</span> {DESCRIPTOR[d.iso]}
          </p>
          {variant === "is-lead" ? (
            <h3 id={`chapter-${d.iso}`} className="atlas-lead mt-5">
              <Script lang={native.lang} className="atlas-lead-native">
                {native.native}
              </Script>
              <span className="atlas-lead-name">{d.name}</span>
            </h3>
          ) : (
            <h3 id={`chapter-${d.iso}`} className="atlas-state-name mt-5">
              {d.name}
              <Script lang={native.lang} className="atlas-state-native">
                {native.native}
              </Script>
            </h3>
          )}
          {variant === "is-columns" ? (
            <div className="atlas-columns mt-7">
              <p className="text-ink-soft">{d.intro}</p>
              {facts}
            </div>
          ) : (
            <>
              <p className={variant === "is-quote" ? "atlas-quote mt-7" : "mt-6 max-w-[32rem] text-ink-soft"}>{d.intro}</p>
              <div className="mt-7">{facts}</div>
            </>
          )}
          <button type="button" className="atlas-open mt-8" onClick={(e) => onOpen(e.currentTarget)}>
            <span>Open the {d.name} dossier</span>
            <span aria-hidden="true" className="atlas-open-plus" />
          </button>
          <p className="caption mt-6">
            On the map: {photo.caption}. {photo.credit}
          </p>
        </div>
      </div>
    </article>
  );
}
