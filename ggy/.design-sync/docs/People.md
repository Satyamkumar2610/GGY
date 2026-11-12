---
category: Record
---

The people delegates have met, as a filterable wall of cards: a monogram,
the name and office as printed, and where the name comes from. Changing the
filter re-deals the cards in place.

**Use.** "The people delegates met", filterable by edition. Takes no props: a full-width homepage section that renders its own copy and photographs from the site content. Place it directly inside `<SiteShell>`, in page order, between other sections.

## Example

```jsx
// const { People } = window.Ggy;  (inside <SiteShell>)
export const ThePeopleDelegatesMet = () => <People />;
```
