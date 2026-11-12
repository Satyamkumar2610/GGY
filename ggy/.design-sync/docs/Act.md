---
category: Foundations
---

A chapter opening. Five photographs from the act are laid out loosely
around the title like prints on a table; scrolling pushes the camera in,
every print grows at its own rate, the outer ones fly past the edges and
the centre one fills the screen, where the title returns in white over it.
The prints lean a little toward the pointer, so the table has depth.

Without motion it is a still: the centre photograph at full bleed with
the title on it.

**Use.** Opens each act of the page (four on the homepage). On the page it is a scroll-scrubbed zoom through five prints; with reduced motion it is the first photograph at full bleed with the title over it. `photos` takes five keys of `window.Ggy.photos`; never repeat the photograph used in the section just before or after.

## Example

```jsx
// const { Act } = window.Ggy;  (inside <SiteShell>)
/**
 * A chapter opening. On the page it is a scrubbed zoom through five prints;
 * as a still it is the first photograph at full bleed with the title on it.
 */
export const ChapterOpening = () => (
  <Act
    id="act-how"
    n="II"
    photos={["lectureHall", "fieldGroup", "overhead", "legislatureSteps", "address"]}
    title="How the days are spent"
    dek="Four stages of learning, and the field visits, workshops and conversations that make up the programme."
  />
);

export const WesternCoast = () => (
  <Act
    id="act-where"
    n="I"
    photos={["highCourt", "sabarmati", "bomJesus", "municipalCorporation", "oldSecretariat"]}
    title="Along the western coast"
    dek="Gujarat, Maharashtra and Goa: the three states of the upcoming edition."
  />
);
```
