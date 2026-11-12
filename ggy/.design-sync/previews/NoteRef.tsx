import { NoteRef } from "ggy";

/** A dagger after an unconfirmed figure; the note opens beside it on hover or focus. */
export const AfterAFigure = () => (
  <div className="j-wrap" style={{ paddingBlock: "2.5rem" }}>
    <p className="j-lede" style={{ color: "var(--c-ink-soft)" }}>
      Nine days on the road
      <NoteRef id="duration" />, through three states and more than twenty institutions.
    </p>
    <p className="j-meta" style={{ marginTop: "1rem" }}>
      Titles are reproduced as printed
      <NoteRef id="titles" />
    </p>
  </div>
);

/** On the crimson ground the dagger is lit in marigold. */
export const OnCrimson = () => (
  <div className="on-dark on-ember ground" style={{ padding: "2.5rem" }}>
    <p className="j-lede">
      1 to 9 March 2025
      <NoteRef id="dates8" />
    </p>
  </div>
);
