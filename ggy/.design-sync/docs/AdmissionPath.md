---
category: Joining
---

The admission process as a climb: five stations rising from the
application to the Yatra itself. A track is laid through their badges as
the section is read, and a small train rides it to the last stop.

**Use.** The five-step admission process as climbing cards. Takes no props. Part of `Joining`; on its own it needs the deep crimson ground: `<section className="j-sec j-deep on-dark on-crimson"><div className="j-wrap"><div className="j-process">`.

## Example

```jsx
// const { AdmissionPath } = window.Ggy;  (inside <SiteShell>)
/** Lives inside Joining, on the deep crimson ground (j-deep on-dark on-crimson); its cards are styled for that ground. */
export const AdmissionProcess = () => (
  <section className="j-sec j-deep on-dark on-crimson" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div className="j-process">
        <AdmissionPath />
      </div>
    </div>
  </section>
);
```
