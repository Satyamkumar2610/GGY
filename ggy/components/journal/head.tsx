import type { ReactNode } from "react";

/** The six-pointed mark from the opening, used wherever a chapter begins. */
export const STAR = "M14.4 0l2 11.9 11.3-4.2.4.6-9.3 7.7 9.3 7.7-.4.6-11.3-4.2-2 11.9h-.8l-2-11.9-11.3 4.2L0 23.7 9.3 16 0 8.3l.4-.6 11.3 4.2L13.7 0z";

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28.1 32" className={`j-star ${className}`} aria-hidden="true" focusable="false">
      <path d={STAR} />
    </svg>
  );
}

/**
 * A title in the opening's voice: capitals in Anek, then the phrase that
 * carries it in Gambetta italic, as "THE GOOD GOVERNANCE / Yatra" is set.
 */
export function Title({ id, title, em, as: Tag = "h2", sub = false, children }: { id?: string; title: string; em?: string; as?: "h2" | "h3"; sub?: boolean; children?: ReactNode }) {
  return (
    <Tag id={id} className={sub ? "j-title j-title--sub" : "j-title"} data-settle>
      <span>{title}</span>
      {em ? <em>{em}</em> : null}
      {children}
    </Tag>
  );
}

/**
 * The one section head on the page: a star and a drawn rule, the title on
 * the left edge, and a short note on the right-hand edge with its last line
 * level with the title's.
 */
export function Head({ id, title, em, children }: { id?: string; title: string; em?: string; children?: ReactNode }) {
  return (
    <header className="j-head">
      <div className="j-plate" aria-hidden="true">
        <Star />
        <i className="j-rule" data-rule />
      </div>
      <Title id={id} title={title} em={em} />
      {children ? <div className="j-note">{children}</div> : null}
    </header>
  );
}
