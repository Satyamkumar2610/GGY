"use client";

import { useEffect } from "react";
import { stamp } from "@/lib/journal";
import type { FocusIso } from "@/lib/atlas";

/** Stamps a state into the visitor's journal once they have been on its page a moment. */
export function StampOnVisit({ iso }: { iso: FocusIso }) {
  useEffect(() => {
    const t = window.setTimeout(() => stamp(iso), 1600);
    return () => window.clearTimeout(t);
  }, [iso]);
  return null;
}
