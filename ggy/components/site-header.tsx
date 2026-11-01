"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { connectItem, journalItem, navItems } from "./nav-items";
import { JournalMark } from "./journal-mark";
import { Button } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The masthead: a quiet running head, as on the page of a field journal.
 * Wordmark at the left, the pages in the middle, the journal and the one
 * available action at the right. It sits on the paper and takes a hairline
 * once the page moves.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu is open for one page only: going to another page closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = useCallback((v: boolean | ((o: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null)), [pathname]);
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
  }, [open, setOpen]);

  const current = (match: string) => pathname === match || pathname.startsWith(match + "/");

  return (
    <header data-site-header data-scrolled={scrolled || open ? "" : undefined} className="masthead">
      <div className="page flex h-full items-center justify-between gap-6">
        <Link href="/" className="masthead-mark" aria-label="Good Governance Yatra, home">
          <span aria-hidden="true" className="masthead-glyph">
            <span />
            <span />
            <span />
          </span>
          <span className="leading-[1.05]">
            <span className="block font-display text-[1.05rem] tracking-[-0.01em]">Good Governance Yatra</span>
            <span className="hidden text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted sm:block">Western India field journal</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = current(item.match);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive ? "page" : undefined} className="masthead-link">
                    {item.label}
                    {isActive ? <motion.span layoutId="masthead-rule" aria-hidden="true" className="masthead-rule" transition={{ duration: 0.45, ease }} /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <JournalMark />
          <Button href={connectItem.href} size="sm" variant="ghost">
            {connectItem.label}
          </Button>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="flex min-h-11 items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] lg:hidden"
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
            className="absolute inset-x-0 top-full h-[calc(100svh-var(--header-h))] overflow-y-auto bg-paper text-ink lg:hidden"
          >
            <nav aria-label="Primary" className="page flex h-full flex-col justify-between py-8">
              <ol>
                {[...navItems, journalItem].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.4, ease }}
                    className="border-b border-hair"
                  >
                    <Link href={item.href} aria-current={current(item.match) ? "page" : undefined} className="flex min-h-16 items-baseline gap-4 no-underline">
                      <span className="text-[0.7rem] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="d-m">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ol>
              <div className="mt-10 flex items-center justify-between gap-4">
                <Button href={connectItem.href} onClick={() => setOpen(false)}>
                  {connectItem.label}
                </Button>
                <JournalMark onNavigate={() => setOpen(false)} />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
