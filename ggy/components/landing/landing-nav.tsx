"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#yatra", label: "The Yatra" },
  { href: "#visits", label: "Key Visits" },
  { href: "#programme", label: "Programme" },
  { href: "#journey", label: "Journey" },
  { href: "#alumni", label: "Alumni" },
  { href: "#archive", label: "Past Editions" },
  { href: "#questions", label: "FAQs" },
];
const MENU = [...LINKS, { href: "#connect", label: "Admissions" }];
/** Where "Apply Now" leads until an application form is published: the admissions section. */
const APPLY_HREF = "#connect";

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
 * Floating nav: the Rashtram School of Public Leadership logo on the left,
 * the section links in the centre, "Apply Now" on the right. Its tone follows whatever sits under it: any element with
 * data-nav="dark" (crimson text, for paper grounds) or data-nav="light"
 * (cream text, for photographs and crimson grounds).
 */
export function LandingNav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Which nav section is being read: the last one whose start has crossed
  // the middle of the window. An observer on a hairline at mid-screen, so
  // nothing is measured while scrolling.
  useEffect(() => {
    const targets = LINKS.map((l) => document.querySelector(l.href));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = targets.indexOf(e.target);
          if (e.isIntersecting) setActive(i);
          // Left upward, back past its start: the section before it is current.
          else if (e.boundingClientRect.top > 0) setActive((a) => (a === i ? i - 1 : a));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((t) => t && io.observe(t));
    return () => io.disconnect();
  }, []);

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
        // Doorways (.act) are read the same way: white paper or photograph,
        // depending on how far the arch has opened.
        const chapter = el.closest<HTMLElement>(".lp-chapters, .act");
        if (chapter && (!host || chapter.contains(host))) {
          // The journal chapters carry no hints: read the ground under the nav.
          tone = toneOf(el);
          glass = tone;
          break;
        }
        if (host) {
          tone = host.dataset.nav ?? tone;
          // The backdrop is the default: a bare nav over a photograph or over
          // body copy scrolling under it is unreadable, and only one section
          // used to opt in. Sections that want the nav to float free of any
          // band — the hero's opening composition — set data-nav-bare.
          glass = host.hasAttribute("data-nav-bare") ? "" : tone;
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
      <a href="#top" className="lp-nav__brand" aria-label="Rashtram School of Public Leadership, Rishihood University: back to top">
        {/* eslint-disable-next-line @next/next/no-img-element -- two pre-sized logo variants swapped by tone */}
        <img src="/images/ggy27/brand/rashtram-color.png" alt="" width={900} height={271} className="lp-nav__logo lp-nav__logo--dark" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/ggy27/brand/rashtram-white.png" alt="" width={900} height={271} className="lp-nav__logo lp-nav__logo--light" />
      </a>
      <nav className="lp-nav__links" aria-label="Sections">
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} className="lp-nav__link" aria-current={i === active ? "true" : undefined} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="lp-nav__end">
        <a href={APPLY_HREF} className="lp-pill lp-pill--apply">
          Apply Now
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
