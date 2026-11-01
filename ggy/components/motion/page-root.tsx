"use client";

import { useRef } from "react";

/**
 * With Cache Components, Next keeps recently visited routes mounted but
 * hidden. Motion code must therefore never query the whole document: it
 * looks inside the page it belongs to. Render `sentinel` once in a page's
 * motion component and call `root()` from its effect.
 */
export function usePageRoot() {
  const ref = useRef<HTMLSpanElement>(null);
  const root = (): ParentNode => ref.current?.closest("[data-page]") ?? document;
  return { ref, root };
}

/** The marker element. Renders nothing visible. */
export function PageSentinel({ innerRef }: { innerRef: React.RefObject<HTMLSpanElement | null> }) {
  return <span ref={innerRef} hidden data-sentinel />;
}
