"use client";

import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Split-flap board, owned by GSAP. When the board arrives, every tile cycles
 * through letters and settles on its own, row by row, with a flip on each change.
 * Hovering a row flips it again.
 */
export function BoardMotion() {
  useGSAP(() => {
    const board = document.querySelector<HTMLElement>("[data-board]");
    if (!board) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES.any, () => {
      const rows = Array.from(board.querySelectorAll<HTMLElement>(".board-row"));
      const flipRow = (row: HTMLElement, delay = 0) => {
        const tiles = Array.from(row.querySelectorAll<HTMLElement>("[data-flap-char]"));
        tiles.forEach((t, i) => {
          const final = t.dataset.flapChar ?? "";
          const turns = 4 + Math.floor(Math.random() * 6);
          const tl = gsap.timeline({ delay: delay + i * 0.025 });
          for (let k = 0; k < turns; k++) {
            tl.to(t, {
              rotateX: -90,
              duration: 0.05,
              ease: "power1.in",
              onComplete: () => {
                t.textContent = k === turns - 1 ? final : ALPHA[Math.floor(Math.random() * ALPHA.length)];
              },
            }).to(t, { rotateX: 0, duration: 0.06, ease: "power1.out" });
          }
        });
      };
      gsap.timeline({ scrollTrigger: { trigger: board, start: "top 75%", once: true, onEnter: () => rows.forEach((r, i) => flipRow(r, i * 0.12)) } });
      const handlers = rows.map((r) => {
        const h = () => flipRow(r);
        r.addEventListener("mouseenter", h);
        return () => r.removeEventListener("mouseenter", h);
      });
      return () => {
        handlers.forEach((off) => off());
        board.querySelectorAll<HTMLElement>("[data-flap-char]").forEach((t) => (t.textContent = t.dataset.flapChar ?? ""));
      };
    });
    return () => mm.revert();
  });
  return null;
}
