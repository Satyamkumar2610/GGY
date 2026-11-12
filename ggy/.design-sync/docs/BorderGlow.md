---
category: Interactive
---

**Use.** A paper sheet whose edge catches a marigold light near the pointer; used for the pass on the joining section. Keep the GGY colours shown in the example. Content inside is on white, so do not put `on-dark` between the ground and the sheet.

## Example

```jsx
// const { BorderGlow } = window.Ggy;  (inside <SiteShell>)
/**
 * The pass on the joining section: a white sheet whose edge catches a
 * marigold light near the pointer. The ground behind is deep crimson; the
 * sheet itself is paper, so its text keeps the paper colours (no `on-dark`
 * between the ground and the sheet).
 */
export const ThePass = () => (
  <div style={{ background: "var(--c-deep)", padding: "3rem", display: "grid", placeItems: "center" }}>
    <BorderGlow
      backgroundColor="#ffffff"
      borderRadius={10}
      glowRadius={34}
      glowColor="36 83 60"
      glowIntensity={0.9}
      edgeSensitivity={26}
      coneSpread={22}
      fillOpacity={0.32}
      colors={["#eeab45", "#b8730f", "#f4e7d6"]}
    >
      <div style={{ padding: "2rem 2.25rem", width: 460 }}>
        <p className="j-meta" style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
          Good Governance Yatra · Upcoming edition
        </p>
        <p style={{ marginTop: "0.9rem", fontFamily: "var(--f-display)", fontWeight: 640, fontSize: "1.9rem", lineHeight: 1, color: "var(--c-crimson)" }}>
          Gujarat, Maharashtra and Goa
        </p>
        <p className="j-meta" style={{ marginTop: "0.75rem" }}>
          The order of travel is to be announced.
        </p>
      </div>
    </BorderGlow>
  </div>
);
```
