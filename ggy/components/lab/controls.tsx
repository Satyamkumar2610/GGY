"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Dir = "up" | "down" | "left" | "right" | "centre";
export type Controls = { duration: number; ease: string; stagger: number; lag: number; dir: Dir; offset: number; run: number };

export const EASES = ["land", "expo.out", "power3.out", "power2.inOut", "swing", "back.out(1.4)", "elastic.out(1,0.8)"] as const;

/** Approximate cubic-bezier equivalents for Motion (which does not read GSAP ease names). */
export const MOTION_EASE: Record<string, [number, number, number, number]> = {
  land: [0.12, 0.82, 0.24, 1],
  "expo.out": [0.16, 1, 0.3, 1],
  "power3.out": [0.215, 0.61, 0.355, 1],
  "power2.inOut": [0.455, 0.03, 0.515, 0.955],
  swing: [0.7, 0, 0.2, 1],
  "back.out(1.4)": [0.34, 1.56, 0.64, 1],
  "elastic.out(1,0.8)": [0.34, 1.56, 0.64, 1],
};

const defaults: Controls = { duration: 1.4, ease: "land", stagger: 0.08, lag: 1, dir: "up", offset: 0.35, run: 0 };
const Ctx = createContext<{ c: Controls; set: (p: Partial<Controls>) => void }>({ c: defaults, set: () => {} });
export const useControls = () => useContext(Ctx).c;

export function clipFrom(dir: Dir): string {
  switch (dir) {
    case "down":
      return "inset(0% 0% 100% 0%)";
    case "left":
      return "inset(0% 100% 0% 0%)";
    case "right":
      return "inset(0% 0% 0% 100%)";
    case "centre":
      return "inset(50% 50% 50% 50%)";
    default:
      return "inset(100% 0% 0% 0%)";
  }
}

export function ControlsProvider({ children }: { children: ReactNode }) {
  const [c, setC] = useState(defaults);
  const set = (p: Partial<Controls>) => setC((prev) => ({ ...prev, ...p }));
  return <Ctx.Provider value={{ c, set }}>{children}</Ctx.Provider>;
}

function Range({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-2">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[#e2737b]" />
      <span className="text-right tabular-nums">{value}</span>
    </label>
  );
}

/** Floating control panel: every experiment reads these values and rebuilds when they change. */
export function ControlPanel() {
  const { c, set } = useContext(Ctx);
  const [open, setOpen] = useState(true);
  return (
    <aside className="fixed bottom-4 right-4 z-[60] w-[19rem] bg-ink text-[0.78rem] text-ivory shadow-2xl" aria-label="Motion controls">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between px-4 py-3 font-medium">
        Controls <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      {open ? (
        <div className="space-y-2.5 px-4 pb-4">
          <Range label="Duration (s)" min={0.3} max={3} step={0.1} value={c.duration} onChange={(v) => set({ duration: v })} />
          <Range label="Stagger (s)" min={0} max={0.3} step={0.01} value={c.stagger} onChange={(v) => set({ stagger: v })} />
          <Range label="Scroll lag (s)" min={0} max={2.5} step={0.1} value={c.lag} onChange={(v) => set({ lag: v })} />
          <Range label="Overlap" min={0} max={1} step={0.05} value={c.offset} onChange={(v) => set({ offset: v })} />
          <label className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
            <span>Easing</span>
            <select value={c.ease} onChange={(e) => set({ ease: e.target.value })} className="bg-ink-2 px-2 py-1">
              {EASES.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </label>
          <label className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
            <span>Reveal from</span>
            <select value={c.dir} onChange={(e) => set({ dir: e.target.value as Dir })} className="bg-ink-2 px-2 py-1">
              {["up", "down", "left", "right", "centre"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => set({ run: c.run + 1 })} className="mt-1 w-full bg-crimson py-2 font-medium">
            Replay time-based demos
          </button>
        </div>
      ) : null}
    </aside>
  );
}

/** Variant switcher shown at the top of each experiment. */
export function Variants({ value, onChange, labels }: { value: number; onChange: (i: number) => void; labels: string[] }) {
  return (
    <div role="group" aria-label="Variants" className="flex flex-wrap gap-2">
      {labels.map((l, i) => (
        <button
          key={l}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`px-3 py-1.5 text-[0.8rem] ${value === i ? "bg-ink text-ivory" : "bg-sand text-ink"}`}
        >
          {String.fromCharCode(65 + i)} · {l}
        </button>
      ))}
    </div>
  );
}

export function LabSection({ id, n, title, note, children, dark = false }: { id: string; n: number; title: string; note: string; children: ReactNode; dark?: boolean }) {
  return (
    <section id={id} className={`${dark ? "on-dark bg-ink text-ivory" : ""} border-t border-hair py-16`}>
      <div className="page">
        <p className="meta text-muted">Experiment {n}</p>
        <h2 className="d-m mt-2">{title}</h2>
        <p className="mt-3 max-w-[48rem] text-[0.95rem] opacity-80">{note}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
