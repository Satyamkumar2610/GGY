"use client";

import { gsap, useGSAP } from "@/lib/gsap";

const FINE_MOTION = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Pointer interactions, owned by GSAP, for fine pointers that accept motion.
 *
 * Magnetic: anything marked [data-magnetic] leans toward the pointer while it
 * is over it and springs back when it leaves.
 *
 * Cursor: over anything marked [data-cursor="Verb"], a crimson disc follows
 * the pointer and names what pressing or dragging there will do. The system
 * pointer is never hidden.
 *
 * Both listen once on the document, so elements that mount later (the mobile
 * menu's button, the photo viewer) are covered without rebinding.
 */
export function Interactions() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(FINE_MOTION, () => {
      type Pull = { x: (v: number) => void; y: (v: number) => void };
      const pulls = new WeakMap<HTMLElement, Pull>();
      const pullOf = (el: HTMLElement) => {
        let p = pulls.get(el);
        if (!p) {
          p = {
            x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" }),
          };
          pulls.set(el, p);
        }
        return p;
      };
      let magnet: HTMLElement | null = null;
      const release = () => {
        if (!magnet) return;
        const p = pullOf(magnet);
        p.x(0);
        p.y(0);
        magnet = null;
      };

      const cursor = document.createElement("div");
      cursor.className = "cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.appendChild(cursor);
      gsap.set(cursor, { scale: 0 });
      const cx = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
      const cy = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });
      let label: string | null = null;
      let placed = false;

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const target = e.target instanceof Element ? e.target : null;

        const el = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (el !== magnet) release();
        if (el) {
          magnet = el;
          const r = el.getBoundingClientRect();
          // The rect includes the pull already applied; take it back out so
          // the element does not chase its own offset.
          const ox = Number(gsap.getProperty(el, "x")) || 0;
          const oy = Number(gsap.getProperty(el, "y")) || 0;
          const p = pullOf(el);
          p.x((e.clientX - (r.left - ox + r.width / 2)) * 0.3);
          p.y((e.clientY - (r.top - oy + r.height / 2)) * 0.4);
        }

        if (!placed) {
          gsap.set(cursor, { x: e.clientX, y: e.clientY });
          placed = true;
        }
        cx(e.clientX);
        cy(e.clientY);
        const next = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null;
        if (next !== label) {
          label = next;
          if (next) {
            cursor.textContent = next;
            gsap.to(cursor, { scale: 1, duration: 0.45, ease: "back.out(1.8)", overwrite: "auto" });
          } else {
            gsap.to(cursor, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
          }
        }
      };
      const onDown = () => label && gsap.to(cursor, { scale: 0.82, duration: 0.2, overwrite: "auto" });
      const onUp = () => label && gsap.to(cursor, { scale: 1, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
      const onLeave = () => {
        release();
        label = null;
        gsap.to(cursor, { scale: 0, duration: 0.25, overwrite: "auto" });
      };

      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerdown", onDown);
        document.removeEventListener("pointerup", onUp);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        release();
        cursor.remove();
      };
    });
    return () => mm.revert();
  });
  return null;
}
