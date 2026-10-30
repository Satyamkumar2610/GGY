import type { ReactNode } from "react";
import type { NoteId } from "@/content/ggy";

export const scriptClass: Record<string, string> = { mr: "script-deva", kok: "script-deva", gu: "script-guj", hi: "script-deva" };

/** Renders a confirmed value, or "To be announced" when the value is null. */
export function Value({ value }: { value: ReactNode | null | undefined }) {
  if (value === null || value === undefined || value === "") {
    return <span className="tba">To be announced</span>;
  }
  return <>{value}</>;
}

/** Footnote marker linking to the colophon's notes on sources. */
export function NoteRef({ id }: { id: NoteId }) {
  return (
    <a href={`#note-${id}`} className="note-ref">
      <span aria-hidden="true">†</span>
      <span className="sr-only"> (see note: awaiting confirmation)</span>
    </a>
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
  return (
    <a href={href} className={`btn ${v} ${s} ${className}`} data-magnetic onClick={onClick}>
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}
