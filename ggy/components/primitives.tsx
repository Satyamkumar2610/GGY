import Link from "next/link";
import type { ReactNode } from "react";
import { pendingNotes, type NoteId } from "@/content/ggy";

export const scriptClass: Record<string, string> = { mr: "script-deva", kok: "script-deva", gu: "script-guj", hi: "script-deva" };

/** Renders a confirmed value, or "To be announced" when the value is null. */
export function Value({ value }: { value: ReactNode | null | undefined }) {
  if (value === null || value === undefined || value === "") {
    return <span className="tba">To be announced</span>;
  }
  return <>{value}</>;
}

/**
 * Footnote marker. The note sits with the figure it qualifies: it opens
 * beside the dagger on hover or keyboard focus, and is read out with the
 * button by assistive tech.
 */
export function NoteRef({ id }: { id: NoteId }) {
  return (
    <span className="note">
      <button type="button" className="note-ref">
        <span aria-hidden="true">†</span>
        <span className="sr-only"> Note: {pendingNotes[id]}</span>
      </button>
      <span aria-hidden="true" className="note-tip">
        {pendingNotes[id]}
      </span>
    </span>
  );
}

/** A state's name in its own script, marked with its language. */
export function Script({ lang, children, className = "" }: { lang: string; children: ReactNode; className?: string }) {
  return (
    <span lang={lang} className={`${scriptClass[lang] ?? ""} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Primary action: a pill whose label rolls over and whose colour rises from
 * below. Magnetic under a fine pointer (see Interactions). The label is
 * printed twice for the roll; the second copy is hidden from assistive tech.
 */
export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
  onClick,
}: {
  href: string;
  children: string;
  variant?: "solid" | "ghost" | "cream";
  size?: "md" | "sm";
  className?: string;
  onClick?: () => void;
}) {
  const v = variant === "solid" ? "" : `btn-${variant}`;
  const s = size === "sm" ? "btn-sm" : "";
  const label = (
    <span className="btn-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
  const cls = `btn ${v} ${s} ${className}`;
  // Pages of this site go through the router; mailto and in-page anchors stay plain links.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls} data-magnetic onClick={onClick}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} data-magnetic onClick={onClick}>
      {label}
    </a>
  );
}
