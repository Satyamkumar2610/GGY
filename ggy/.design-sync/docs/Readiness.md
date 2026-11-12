---
category: Joining
---

A self-check for when applications open, built from the 2025 brochure.
It is not an eligibility test: criteria for the upcoming edition are to be
announced. Set as one compact band: a meter on the left, five tiles that
toggle on press.

**Use.** The "Are you ready to apply?" self-check. Takes no props. Part of `Joining`; on its own it needs `<section className="j-sec j-deep on-dark on-crimson"><div className="j-wrap"><div className="j-ready">`.

## Example

```jsx
// const { Readiness } = window.Ggy;  (inside <SiteShell>)
/** Lives inside Joining, on the deep crimson ground (j-deep on-dark on-crimson). */
export const AreYouReady = () => (
  <section className="j-sec j-deep on-dark on-crimson" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div className="j-ready">
        <Readiness />
      </div>
    </div>
  </section>
);
```
