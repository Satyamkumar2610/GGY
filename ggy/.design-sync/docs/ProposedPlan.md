---
category: Route
---

The plan proposed for Maharashtra, kept visibly tentative: the state in
outline with Nashik and Mumbai marked on a dashed link, four dated tabs,
and the visits of the chosen day dealt out as cards. Choosing a day lights
the city it is spent in.

**Use.** The tentative day plan proposed for Maharashtra. Takes no props. Part of `Coda`; on its own it needs `<section className="j-sec j-cream"><div className="j-wrap">`.

## Example

```jsx
// const { ProposedPlan } = window.Ggy;  (inside <SiteShell>)
/** Lives inside Coda, on the cream ground (j-cream). */
export const ProposedForMaharashtra = () => (
  <section className="j-sec j-cream" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div>
        <ProposedPlan />
      </div>
    </div>
  </section>
);
```
