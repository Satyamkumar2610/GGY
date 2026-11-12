---
category: Interactive
---

**Use.** A foil card that tilts under the pointer. The site uses it only for the round foil seal (`image={Ggy.SEAL}`, `radius` = half the `width`).

## Example

```jsx
// const { HoloCard, SEAL } = window.Ggy;  (inside <SiteShell>)
/** The foil seal on the pass stub: round, star foil, marigold tint. The site uses HoloCard only for this seal. */
export const FoilSeal = () => (
  <div style={{ padding: "3rem", display: "grid", placeItems: "center", background: "#fff" }}>
    <HoloCard image={SEAL} alt="Foil seal of the Good Governance Yatra" preset="stars" width={160} radius={80} intensity={0.7} edgeSparkle={0.5} frame={0} glare={0.45} foilColor="#f1cf8f" tiltMax={18} />
  </div>
);

/** Smaller, on deep crimson, as it sits on the pass stub. */
export const OnDeepCrimson = () => (
  <div style={{ padding: "3rem", display: "grid", placeItems: "center", background: "var(--c-deep)" }}>
    <HoloCard image={SEAL} alt="Foil seal of the Good Governance Yatra" preset="stars" width={112} radius={56} intensity={0.7} edgeSparkle={0.5} frame={0} glare={0.45} foilColor="#f1cf8f" tiltMax={18} />
  </div>
);
```
