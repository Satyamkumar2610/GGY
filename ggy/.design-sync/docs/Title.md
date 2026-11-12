---
category: Foundations
---

A title in the opening's voice: capitals in Anek, then the phrase that
carries it in Gambetta italic, as "THE GOOD GOVERNANCE / Yatra" is set.

**Use.** Every section title: `title` in Anek capitals, then `em` in Gambetta italic marigold on its own line. `as="h3" sub` for a title inside a section. Must sit inside a `.j-wrap` container (inside `<SiteShell>`) to be styled.

## Example

```jsx
// const { Title } = window.Ggy;  (inside <SiteShell>)
/** Section title: capitals in Anek, then the carrying phrase in Gambetta italic. */
export const SectionTitle = () => (
  <div className="j-wrap" style={{ paddingBlock: "3rem" }}>
    <Title title="Questions," em="answered" />
  </div>
);

/** A sub-title (h3) inside a section. */
export const SubTitle = () => (
  <div className="j-wrap" style={{ paddingBlock: "3rem" }}>
    <Title as="h3" sub title="What delegates" em="took away" />
  </div>
);

/** On the deep crimson ground. */
export const OnDeepCrimson = () => (
  <div className="j-deep on-dark" style={{ paddingBlock: "3rem" }}>
    <div className="j-wrap">
      <Title title="The journey changes" em="the way you see governance" />
    </div>
  </div>
);
```
