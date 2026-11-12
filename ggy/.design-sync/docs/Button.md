---
category: Foundations
---

Primary action: a pill whose label rolls over and whose colour rises from
below. Magnetic under a fine pointer (see Interactions). The label is
printed twice for the roll; the second copy is hidden from assistive tech.

**Use.** The one action style on the site. `href` is required (it renders an `<a>`); `children` must be a plain string because the label is printed twice for the roll-over. On crimson grounds use `variant="cream"`, or `"ghost"` inside an `on-dark` wrapper.

## Example

```jsx
// const { Button } = window.Ggy;  (inside <SiteShell>)
const row = { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" as const, padding: "2rem" };

/** Solid crimson on paper: the primary action. */
export const Solid = () => (
  <div style={row}>
    <Button href="#apply">Apply for the next edition</Button>
    <Button href="#apply" size="sm">
      Read the brochure
    </Button>
  </div>
);

/** Cream on a crimson ground (fills marigold on hover). */
export const CreamOnCrimson = () => (
  <div className="on-dark on-ember ground" style={row}>
    <Button href="#contact" variant="cream">
      Write to the team
    </Button>
    <Button href="#programme" variant="ghost">
      See the programme
    </Button>
  </div>
);

/** Ghost on paper: a secondary action beside a solid one. */
export const GhostOnPaper = () => (
  <div style={row}>
    <Button href="#apply">Admissions and contact</Button>
    <Button href="#programme" variant="ghost">
      See the programme
    </Button>
  </div>
);
```
