---
category: Chrome
---

Floating nav: links on the left, the wordmark in the centre, one pill on
the right. Its tone follows whatever sits under it: any element with
data-nav="dark" (crimson text, for paper grounds) or data-nav="light"
(cream text, for photographs and crimson grounds).

**Use.** The fixed top bar: wordmark, chapter links, menu. Takes no props. It reads the ground beneath it and switches between light and dark glass, and highlights the link whose section (`#yatra`, `#journey`, `#programme`, `#archive`, `#people`) is in view.

## Example

```jsx
// const { LandingNav, photos } = window.Ggy;  (inside <SiteShell>)
/** The fixed top bar over the opening photograph: wordmark, chapter links, menu. */
export const OverAPhotograph = () => (
  <div style={{ position: "relative", height: 260, overflow: "hidden" }} data-nav="dark">
    <img src={photos.highCourt.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <LandingNav />
  </div>
);
```
