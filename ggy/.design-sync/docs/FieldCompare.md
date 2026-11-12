---
category: Opening
---

The classroom and the field, one over the other. Drag the divider (or use
the arrow keys) to move from the lecture hall into open country; the side
being revealed lights its caption. Points of interest on the field
photograph open on press. On arrival the divider sweeps once, to show it
can be moved.

**Use.** The lecture-hall / field photograph comparison. Takes no props. It is part of `Field`; on its own it needs the paper ground: `<section className="j-sec j-paper"><div className="j-wrap">`.

## Example

```jsx
// const { FieldCompare } = window.Ggy;  (inside <SiteShell>)
/** Lives inside Field, on the paper ground (j-paper). */
export const HallAndField = () => (
  <section className="j-sec j-paper" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div>
        <FieldCompare />
      </div>
    </div>
  </section>
);
```
