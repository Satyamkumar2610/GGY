import { useId } from "react";
import { Script } from "./primitives";

/**
 * A rubber stamp, as a journal is stamped at each place it passes through.
 * Ring text runs around the edge; the centre carries a name, usually in its
 * own script. It presses onto the page once as it arrives ([data-stamp] in
 * PageMotion). Decorative: whatever it says is also written in the text.
 */
export function Postmark({
  ring,
  centre,
  lang,
  sub,
  className = "",
  tone = "crimson",
}: {
  ring: string;
  centre: string;
  lang?: string;
  sub?: string;
  className?: string;
  tone?: "crimson" | "ivory" | "terracotta";
}) {
  const id = useId().replace(/:/g, "");
  return (
    <span aria-hidden="true" className={`postmark postmark-${tone} ${className}`} data-stamp>
      <svg viewBox="0 0 200 200">
        <defs>
          <path id={`ring-${id}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          <filter id={`ink-${id}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.25" result="holes" />
            <feComposite in="SourceGraphic" in2="holes" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#ink-${id})`}>
          <circle cx="100" cy="100" r="95" className="postmark-line" strokeWidth="3" />
          <circle cx="100" cy="100" r="88" className="postmark-line" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="58" className="postmark-line" strokeWidth="1.2" />
          <text className="postmark-ring">
            <textPath href={`#ring-${id}`} startOffset="0" textLength="458" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
          {sub ? (
            <text x="100" y="128" textAnchor="middle" className="postmark-sub">
              {sub}
            </text>
          ) : null}
        </g>
      </svg>
      <Script lang={lang ?? "en"} className="postmark-centre">
        {centre}
      </Script>
    </span>
  );
}
