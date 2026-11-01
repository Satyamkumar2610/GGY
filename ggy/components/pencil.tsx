import type { ReactNode } from "react";

/**
 * A pencil mark under a few words, as a reader marks a journal: a slightly
 * uneven stroke drawn as it reaches the reader ([data-pencil] in PageMotion).
 * The words read normally without it.
 */
export function Pencil({ children, circle = false }: { children: ReactNode; circle?: boolean }) {
  return (
    <span className={`pencil ${circle ? "is-circle" : ""}`}>
      {children}
      <svg aria-hidden="true" data-pencil viewBox="0 0 200 20" preserveAspectRatio="none">
        {circle ? (
          <path pathLength={1} d="M8 12 C 4 2, 60 -2, 110 2 C 168 6, 198 8, 192 14 C 186 20, 120 20, 70 19 C 30 18, 2 16, 14 6" />
        ) : (
          <path pathLength={1} d="M2 13 C 40 9, 90 15, 130 11 S 180 9, 198 12" />
        )}
      </svg>
    </span>
  );
}
