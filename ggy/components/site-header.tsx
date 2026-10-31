"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { navItems } from "./nav-items";
import { contact } from "@/content/ggy";
import { Button } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The masthead: a quiet running head, as on the page of a field journal.
 * Wordmark at the left, chapters in the middle, the one available action at
 * the right. It sits on the paper and takes a hairline once the page moves.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  // Chapter being read.
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

  return (
    <header data-site-header data-scrolled={scrolled || open ? "" : undefined} className="masthead">
      <div className="page flex h-full items-center justify-between gap-6">
        <a href="#top" className="masthead-mark" aria-label="Good Governance Yatra, back to top">
          <span aria-hidden="true" className="masthead-glyph">
            <span />
            <span />
            <span />
          </span>
          <span className="leading-[1.05]">
            <span className="block font-display text-[1.05rem] font-semibold tracking-[-0.02em]">Good Governance Yatra</span>
            <span className="hidden font-serif text-[0.8rem] italic text-muted sm:block">Western India field journal</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.href}>
                  <a href={item.href} aria-current={isActive ? "location" : undefined} className="masthead-link">
                    {item.label}
                    {isActive ? <motion.span layoutId="masthead-rule" aria-hidden="true" className="masthead-rule" transition={{ duration: 0.45, ease }} /> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href="#connect" size="sm" variant="ghost">
            Connect with the team
          </Button>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="flex min-h-11 items-center gap-2.5 rounded-full px-3 text-[0.875rem] font-medium lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Close" : "Contents"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <motion.span className="absolute left-0 top-0 h-px w-5 bg-current" animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.25, ease }} />
            <motion.span className="absolute bottom-0 left-0 h-px w-5 bg-current" animate={open ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.25, ease }} />
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
            transition={{ duration: 0.45, ease }}
            className="glass glass-strong pointer-events-auto absolute inset-x-[clamp(0.6rem,1.6vw,1.5rem)] top-[calc(100%+0.5rem)] h-[calc(100svh-var(--header-h)-1.5rem)] overflow-y-auto text-ink lg:hidden"
          >
            <nav aria-label="Primary" className="page flex h-full flex-col justify-between py-8">
              <ol>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.4, ease }}
                    className="border-b border-hair"
                  >
                    <a href={item.href} onClick={() => setOpen(false)} className="flex min-h-16 items-baseline gap-4 no-underline">
                      <span className="text-[0.7rem] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="d-m">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>
              <Button href="#connect" className="mt-10 self-start" onClick={() => setOpen(false)}>
                Connect with the team
              </Button>
              <p className="caption mt-4">{contact.email}</p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
