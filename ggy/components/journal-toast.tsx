"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { stateDossiers } from "@/content/ggy";
import { Postmark } from "./postmark";
import { Script } from "./primitives";
import { upcoming } from "@/content/ggy";

const LANG = Object.fromEntries(upcoming.states.map((s) => [s.name, { lang: s.lang, native: s.native }]));

/**
 * A quiet confirmation when a state is stamped into the visitor's journal.
 * Announced politely to screen readers; it never takes focus and goes by
 * itself after a few seconds.
 */
export function JournalToast() {
  const [shown, setShown] = useState<{ name: string; n: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = (e: Event) => {
      const { iso, count } = (e as CustomEvent<{ iso: string; count: number }>).detail;
      const name = stateDossiers.find((d) => d.iso === iso)?.name;
      if (!name) return;
      setShown({ name, n: count });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(null), 5200);
    };
    window.addEventListener("ggy:stamp", on);
    return () => {
      window.removeEventListener("ggy:stamp", on);
      window.clearTimeout(timer.current);
    };
  }, []);

  const native = shown ? LANG[shown.name] : null;
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {shown && native ? (
        <div className="toast" key={shown.name}>
          <Postmark ring={`${shown.name.toUpperCase()} ✦ STAMPED ✦ `} centre={native.native} lang={native.lang} className="toast-stamp" />
          <div>
            <p className="font-display text-[1.05rem] leading-tight">
              {shown.name} <Script lang={native.lang} className="text-crimson">{native.native}</Script> stamped
            </p>
            <p className="caption mt-1">
              {shown.n} of 3 in your field journal. <Link href="/journal" className="tlink tlink-static">Open it</Link>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
