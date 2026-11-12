---
category: Opening
---

Five panels side by side. One is open at a time and carries its quotation
from the brochure; the others stand closed as narrow spines with their
names set vertically. Hovering, focusing or pressing a spine opens it.
On narrow screens the panels stack and open downward.

**Use.** The idea of the Yatra as a row of expanding panels. Takes no props. Part of `Field`; on its own it needs `<section className="j-sec j-paper"><div className="j-wrap">`.

## Example

```jsx
// const { IdeaPanels } = window.Ggy;  (inside <SiteShell>)
/** Lives inside Field, on the paper ground (j-paper). */
export const TheIdea = () => (
  <section className="j-sec j-paper" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div>
        <IdeaPanels />
      </div>
    </div>
  </section>
);
```
