import { Value } from "ggy";

const rows: [string, string | null][] = [
  ["Route", "Gujarat, Maharashtra and Goa"],
  ["Dates", null],
  ["Programme fee", null],
  ["Cohort", null],
];

/** Confirmed values print as given; null prints "To be announced" in the muted style. */
export const ConfirmedAndPending = () => (
  <div className="j-wrap" style={{ paddingBlock: "2.5rem" }}>
    <dl style={{ display: "grid", gridTemplateColumns: "10rem 1fr", rowGap: "0.75rem", margin: 0 }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <dt className="j-meta">{k}</dt>
          <dd style={{ margin: 0, color: "var(--c-ink-soft)" }}>
            <Value value={v} />
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

/** On the crimson ground. */
export const OnCrimson = () => (
  <div className="on-dark on-ember ground" style={{ padding: "2.5rem" }}>
    <p>
      Applications open: <Value value={null} />
    </p>
  </div>
);
