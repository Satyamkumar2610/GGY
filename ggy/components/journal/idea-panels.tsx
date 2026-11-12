"use client";

import { useState } from "react";
import { Eye, Landmark, MapPinned, Scale, Sprout, type LucideIcon } from "lucide-react";

/* What the Yatra is for, each in the words of the 2025 brochure. */
const MODES: { name: string; quote: string; src: string; Icon: LucideIcon }[] = [
  { name: "First-hand exposure", quote: "witness transformative governance projects firsthand", src: "Brochure, p.2", Icon: Eye },
  { name: "Leaders and institutions", quote: "engage with visionary policymakers shaping India’s future", src: "Brochure, p.2", Icon: Landmark },
  { name: "Learning in the field", quote: "Live exposure to last-mile governance institutions and interaction with stakeholders", src: "Field Visit, brochure p.10", Icon: MapPinned },
  { name: "Administration in practice", quote: "experience first-hand the complications and contradictions of the policy implementation processes", src: "Experience, brochure p.7", Icon: Scale },
  { name: "People and places", quote: "Deepen your understanding of Bharat through insights from grassroots leaders", src: "Bharat Insights, brochure p.3", Icon: Sprout },
];

/**
 * Five panels side by side. One is open at a time and carries its quotation
 * from the brochure; the others stand closed as narrow spines with their
 * names set vertically. Hovering, focusing or pressing a spine opens it.
 * On narrow screens the panels stack and open downward.
 */
export function IdeaPanels() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="x-idea">
      {MODES.map((m, i) => {
        const on = i === open;
        return (
          <li key={m.name} className="x-idea__panel" data-open={on ? "" : undefined} onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}>
            <button type="button" className="x-idea__spine" aria-expanded={on} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span className="x-idea__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="x-idea__name">{m.name}</span>
              <m.Icon className="x-idea__icon" aria-hidden="true" strokeWidth={1.5} />
            </button>
            <div className="x-idea__body" inert={!on}>
              <div className="x-idea__inner">
                <p className="x-idea__k">
                  <m.Icon aria-hidden="true" strokeWidth={1.6} />
                  {m.name}
                </p>
                <blockquote className="x-idea__quote">“{m.quote}”</blockquote>
                <p className="x-idea__src">{m.src}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
