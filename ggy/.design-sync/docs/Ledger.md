---
category: Record
---

The 8th edition, day by day, from the concept note. On large screens the
section holds still and the nine days travel past as a line of cards; a
railway runs along the top with a train that keeps pace with the reader
and lights each stop as it is reached. Elsewhere the cards scroll sideways
on their own and the railway is a still key.

**Use.** "Nine days on the road": the 2025 itinerary as a timeline and day cards. Takes no props: a full-width homepage section that renders its own copy and photographs from the site content. Place it directly inside `<SiteShell>`, in page order, between other sections.

## Example

```jsx
// const { Ledger } = window.Ggy;  (inside <SiteShell>)
export const NineDaysOnTheRoad = () => <Ledger />;
```
