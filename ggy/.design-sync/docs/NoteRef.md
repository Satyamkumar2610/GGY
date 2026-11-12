---
category: Foundations
---

Footnote marker. The note sits with the figure it qualifies: it opens
beside the dagger on hover or keyboard focus, and is read out with the
button by assistive tech.

**Use.** A dagger placed straight after an unconfirmed figure. `id` is a key of `window.Ggy.pendingNotes` (duration, alumni, dates8, workshops, titles, flagoff, process).

## Example

```jsx
// const { NoteRef } = window.Ggy;  (inside <SiteShell>)
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
```
