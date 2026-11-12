---
category: Chrome
---

The footer: one band, a quarter of a screen at most. The mark, the
contents and a way back up on one line; the credits and provenance on a
second. Contact is not repeated: the cards just above carry it.

**Use.** The footer band on deep crimson. Takes no props: a full-width homepage section that renders its own copy and photographs from the site content. Place it directly inside `<SiteShell>`, in page order, between other sections.

## Example

```jsx
// const { LandingFooter } = window.Ggy;  (inside <SiteShell>)
export const Footer = () => <LandingFooter />;
```
