"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { navItems } from "./nav-items";
import Image from "next/image";
import { contact, photos } from "@/content/ggy";
import { Button } from "./primitives";

type Tone = "light" | "ink" | "paper";

/**
 * The masthead. Ivory over the hero photograph; ink once the photograph
 * steps back into its frame on the page; a paper band after the hero.
 */
export function SiteHeader() {
  const [tone, setTone] = useState<Tone>("light");
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tone from the hero's photograph edge and the hero choreography.
  useEffect(() => {
    let opened = false;
    let frame = 0;
    const edge = document.querySelector<HTMLElement>("[data-hero-edge]");
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const apply = () => {
      frame = 0;
      const limit = header ? header.offsetHeight : 64;
      const overHero = edge ? edge.getBoundingClientRect().top > limit : false;
      setTone(overHero ? (opened ? "ink" : "light") : "paper");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onHero = (e: Event) => {
      opened = (e as CustomEvent<{ opened: boolean }>).detail.opened;
      schedule();
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("ggy:hero", onHero);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("ggy:hero", onHero);
    };
  }, []);

  // Active chapter.
  useEffect(() => {
    const sections = navItems.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.6) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Escape closes the mobile menu and returns focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const effectiveTone: Tone = open ? "paper" : tone;

  const pill = { type: "spring", stiffness: 420, damping: 38 } as const;

  return (
    <header data-site-header data-tone={effectiveTone} className="site-header">
      <div className="page flex items-start justify-between gap-4">
        <a href="#top" className="island gap-3 px-4 no-underline" aria-label="Good Governance Yatra, back to top">
          <span className="font-display text-[1.2rem] leading-none tracking-[0.22em]">GGY</span>
          <span className="hidden text-[0.75rem] font-medium leading-[1.15] opacity-85 sm:block">
            Good Governance
            <br />
            Yatra
          </span>
        </a>

        <nav aria-label="Primary" className="island hidden lg:flex">
          <ul className="flex items-center" onMouseLeave={() => setPeek(null)}>
            {navItems.map((item, idx) => {
              const isActive = active === item.id;
              const p = photos[item.preview];
              return (
                <li key={item.href} className="relative" onMouseEnter={() => setPeek(idx)} onFocus={() => setPeek(idx)} onBlur={() => setPeek(null)}>
                  <a href={item.href} aria-current={isActive ? "location" : undefined} className="nav-link">
                    {peek === idx ? <motion.span layoutId="nav-hover" aria-hidden="true" className="nav-hover" transition={pill} /> : null}
                    {isActive ? <motion.span layoutId="nav-current" aria-hidden="true" className="nav-current" transition={pill} /> : null}
                    {item.label}
                  </a>
                  <AnimatePresence>
                    {peek === idx ? (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-[calc(100%+1.1rem)] block w-[15rem] -translate-x-1/2 overflow-hidden rounded-[var(--radius-media)] bg-ember p-1.5 shadow-[0_30px_60px_-30px_rgb(42_17_20/0.7)]"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.18 } }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="relative block aspect-[3/2] overflow-hidden rounded-[var(--radius-thumb)]">
                          <Image src={p.src} alt="" fill sizes="240px" className="object-cover" />
                        </span>
                        <span className="block px-2 pb-1 pt-2 text-[0.75rem] text-ivory/85">{p.caption}</span>
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="island hidden lg:flex">
          <Button href={`mailto:${contact.email}`} size="sm">
            Write to the team
          </Button>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="island gap-2.5 px-4 text-[0.8rem] font-medium lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Close" : "Contents"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <motion.span className="absolute left-0 top-0 h-px w-5 bg-current" animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
            <motion.span className="absolute bottom-0 left-0 h-px w-5 bg-current" animate={open ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute inset-x-0 top-full h-[calc(100svh-var(--header-h))] overflow-y-auto bg-paper text-ink lg:hidden"
          >
            <nav aria-label="Primary" className="page flex h-full flex-col justify-between py-8">
              <ol>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-hair"
                  >
                    <a href={item.href} onClick={() => setOpen(false)} className="flex min-h-16 items-baseline gap-4 no-underline">
                      <span className="d-m">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>
              <Button href={`mailto:${contact.email}`} className="mt-10 self-start" onClick={() => setOpen(false)}>
                Write to the GGY team
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
