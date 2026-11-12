import { Star } from "ggy";

const cell = { display: "flex", gap: "1rem", alignItems: "center", padding: "2.5rem" };

/** The six-pointed mark that opens every chapter: marigold on paper, lighter marigold on crimson. */
export const OnPaperAndCrimson = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
    <div className="j-paper" style={cell}>
      <Star />
      <span className="j-meta">On paper</span>
    </div>
    <div className="j-deep on-dark" style={cell}>
      <Star />
      <span className="j-meta">On deep crimson</span>
    </div>
  </div>
);

/** With the drawn rule, as it sits above every section title. */
export const WithRule = () => (
  <div className="j-wrap" style={{ paddingBlock: "2.5rem" }}>
    <div className="j-plate" style={{ marginBottom: 0 }}>
      <Star />
      <i className="j-rule" />
    </div>
  </div>
);
