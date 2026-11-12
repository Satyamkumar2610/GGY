---
category: Programme
---

The six parts of the programme, as run in 2025: a deck of photographs
that deals itself one card at a time (drag, click or use the arrows), and
beside it an index that follows the card in front and carries its text.

**Use.** "Six parts of the programme", the list beside a CardSwap photograph deck. Takes no props: a full-width homepage section that renders its own copy and photographs from the site content. Place it directly inside `<SiteShell>`, in page order, between other sections.

## Example

```jsx
// const { Programme } = window.Ggy;  (inside <SiteShell>)
export const SixPartsOfTheProgramme = () => <Programme />;
```
