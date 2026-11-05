"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#yatra", label: "The Yatra" },
  { href: "#journey", label: "Journey" },
  { href: "#programme", label: "Programme" },
  { href: "#archive", label: "Archive" },
  { href: "#people", label: "People" },
];
const MENU = [...LINKS.slice(0, 2), { href: "#idea", label: "The idea" }, ...LINKS.slice(2), { href: "#questions", label: "Questions" }, { href: "#connect", label: "Admissions" }];

/** "dark" (crimson text) over light grounds, "light" (cream text) over dark grounds and photographs. */
function toneOf(start: Element): "dark" | "light" {
  for (let n: Element | null = start; n && n !== document.body; n = n.parentElement) {
    if (n instanceof HTMLImageElement || n instanceof HTMLVideoElement || n instanceof HTMLCanvasElement) return "light";
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
    if (!m) continue;
    const [r, g, b, a = "1"] = m;
    if (Number(a) < 0.5) continue;
    const lum = (0.2126 * Number(r) + 0.7152 * Number(g) + 0.0722 * Number(b)) / 255;
    return lum > 0.5 ? "dark" : "light";
  }
  return "dark";
}

/**
 * Floating nav: links on the left, the wordmark in the centre, one pill on
 * the right. Its tone follows whatever sits under it: any element with
 * data-nav="dark" (crimson text, for paper grounds) or data-nav="light"
 * (cream text, for photographs and crimson grounds).
 */
export function LandingNav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let raf = 0;
    const probe = () => {
      raf = 0;
      const y = Math.min(nav.offsetHeight / 2, 40);
      const hits = document.elementsFromPoint(window.innerWidth / 2, y);
      let tone = nav.dataset.tone ?? "dark";
      let glass = "";
      for (const el of hits) {
        if (nav.contains(el)) continue;
        const host = el.closest<HTMLElement>("[data-nav]");
        const chapter = el.closest<HTMLElement>(".lp-chapters");
        if (chapter && (!host || chapter.contains(host))) {
          // The journal chapters carry no hints: read the ground under the nav.
          tone = toneOf(el);
          glass = tone;
          break;
        }
        if (host) {
          tone = host.dataset.nav ?? tone;
          glass = host.hasAttribute("data-nav-glass") ? tone : "";
          break;
        }
      }
      nav.dataset.tone = tone;
      if (glass) nav.dataset.glass = glass;
      else delete nav.dataset.glass;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // The hero changes its own tone as it zooms, without the page scrolling past it.
    window.addEventListener("lp:tone", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("lp:tone", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={ref} className="lp-nav" data-site-header data-tone="dark" data-open={open || undefined}>
      <nav className="lp-nav__links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="lp-nav__link" onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href="#top" className="lp-nav__brand" aria-label="Good Governance Yatra, back to top">
        <b>GGY</b>
        <span>Good Governance Yatra</span>
      </a>
      <div className="lp-nav__end">
        <a href="#connect" className="lp-pill lp-pill--line">
          Connect
        </a>
        <button
          type="button"
          className="lp-nav__burger"
          aria-expanded={open}
          aria-controls="lp-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </div>
      <div id="lp-menu" className="lp-menu" hidden={!open}>
        {MENU.map((l, i) => (
          <a key={l.href} href={l.href} style={{ "--i": i } as React.CSSProperties} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}
