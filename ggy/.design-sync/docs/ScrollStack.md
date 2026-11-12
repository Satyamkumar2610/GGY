---
category: Interactive
---

**Use.** Prints laid one over the next as the reader scrolls. Children are `Ggy.ScrollStackItem` elements (exported from the bundle). `useWindowScroll` when it runs with the page scroll; otherwise give the parent a fixed height.

## Example

```jsx
// const { ScrollStack, ScrollStackItem, photos } = window.Ggy;  (inside <SiteShell>)
const prints = ["cohort", "openLandscape", "flagOff"] as const;

/** Prints laid one over the next as the reader scrolls (here in its own scroller). */
export const FieldPrints = () => (
  <div className="fs on-dark on-ember ground" style={{ height: 640 }}>
    <ScrollStack itemDistance={90} itemStackDistance={28} itemScale={0.04} baseScale={0.85} dimAmount={0.18} smoothScroll={false}>
      {prints.map((k) => (
        <ScrollStackItem key={k} itemClassName="fs-card">
          <img src={photos[k].src} alt={photos[k].alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <p className="fs-card__cap">{photos[k].caption}</p>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  </div>
);
```
