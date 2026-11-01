import type { ReactNode } from "react";

/**
 * The opening of every page after the first: a title and standfirst on the
 * left, the page's own framing of the atlas on the right. The title rises
 * line by line once ([data-page-title] in PageMotion).
 */
export function PageHero({
  kicker,
  title,
  standfirst,
  meta,
  children,
  id,
  tone = "paper",
}: {
  kicker: string;
  title: ReactNode;
  standfirst: ReactNode;
  meta?: { term: string; value: ReactNode }[];
  /** The map or other plate, set at the right. */
  children?: ReactNode;
  id?: string;
  tone?: "paper" | "cream";
}) {
  return (
    <header className={`page-hero ${tone === "cream" ? "bg-cream" : ""}`} data-page-hero aria-labelledby={id ?? "page-title"}>
      <div className="page page-hero-grid">
        <div className="page-hero-copy">
          <p className="kicker" data-fade>
            {kicker}
          </p>
          <h1 id={id ?? "page-title"} className="page-title" data-page-title>
            {title}
          </h1>
          <p className="page-standfirst" data-fade>
            {standfirst}
          </p>
          {meta?.length ? (
            <dl className="page-meta" data-fade>
              {meta.map((m) => (
                <div key={m.term}>
                  <dt>{m.term}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {children ? (
          <div className="page-hero-plate" data-fade>
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}
