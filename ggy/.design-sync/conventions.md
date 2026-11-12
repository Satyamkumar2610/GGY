# GGY: how to build with this design system

The Good Governance Yatra site is a cinematic, long-form travel essay: full-bleed photographs, crimson and white grounds, Anek capitals with a Gambetta italic carry-line. Build in that voice. Grounds are flat colour (no gradients, glows, patterns or animated backgrounds); avoid generic boxy card grids.

## 1. Always wrap in `SiteShell`

`window.Ggy.SiteShell` is the page root. It adds the `.lp` scope that defines every token below and the type resets. Outside it, sections and titles render unstyled.

```jsx
const { SiteShell, Act, Head, Button, Value, photos } = window.Ggy;
<SiteShell>{/* sections in page order */}</SiteShell>
```

Full sections (`LandingHero`, `Departure`, `Field`, `YatraFlight`, `Coda`, `Stages`, `Programme`, `Decade`, `Ledger`, `FieldGallery`, `People`, `After`, `Questions`, `ComeAndSee`, `Joining`, `LandingFooter`) take no props and render their own copy and photographs. Put them directly inside `SiteShell`. Open a new part of the page with `Act`.

## 2. Grounds and containers (CSS classes)

- Section: `<section className="j-sec j-paper">` (white), `j-cream` (ivory `#f6f0e6`), or `j-deep on-dark` (deep crimson `#5c1026`). `on-ember` gives the brighter crimson `#871b38` ground, with ivory text.
- Content column: `<div className="j-wrap">` inside the section. `Title`/`Head` are only styled inside `.j-wrap`.
- Text: `j-lede` (large intro), `j-body`, `j-note`, `j-meta` (small, muted), `j-quote` (Gambetta italic). Inside `on-dark`, `j-body`, `j-note` and `j-meta` switch to light colours by themselves; give anything else `color: var(--c-on-dark)`.

## 3. Tokens (use `var(--…)` in inline styles)

Colour: `--c-crimson` #871b38 (brand), `--c-deep` #5c1026, `--c-saffron` #b8730f (marigold, large text on light), `--c-saffron-ink` #8a5209 (small text on light), `--c-saffron-soft` #eeab45 (marigold on dark), `--c-ink-soft`, `--c-muted`, `--c-on-dark` (ivory text), `--c-paper` #fff, `--c-sand`.
Type: `--f-display` (Anek: headings, labels), `--f-serif` (Gambetta: italic carry-lines, quotations), `--f-sans` (Switzer: text).
Layout: `--gutter`, `--page-max`, `--radius-sheet`, `--radius-media`, `--ease`, hairline `--j-hair`.
Tailwind utilities exist only where the site already uses them, so don't invent utility classes. Prefer these tokens.

## 4. Content rules

- Titles: `<Head title="Six parts of the programme" em="as run in 2025">note</Head>`: `title` becomes the capitals, `em` the italic marigold line.
- Unconfirmed facts (dates, fee, cohort): `<Value value={null} />` prints "To be announced". Never write placeholder dates. Mark a disputed figure with `<NoteRef id="duration" />` (ids are the keys of `Ggy.pendingNotes`).
- Photographs: `Ggy.photos.<key>.src` and `.alt` (keys: highCourt, municipalCorporation, oldSecretariat, sabarmati, gateway, bomJesus, cohort, openLandscape, lectureHall, overhead, fieldGroup, legislatureSteps, flagOff, address). `Ggy.SEAL` is the foil seal. Never use stock placeholders, and never repeat a photograph in adjacent sections.
- Actions: `Button` (`href` required, `children` a string). On crimson grounds use `variant="cream"`.

## 5. Where the truth lives

`styles.css` → `_ds_bundle.css` (the site stylesheet, all classes above), `fonts/fonts.css`. Per-component usage: `components/<group>/<Name>/<Name>.prompt.md`.

## Example: a new section

```jsx
<SiteShell>
  <Act id="act-joining" n="IV" photos={["oldSecretariat", "address", "lectureHall", "flagOff", "overhead"]}
       title="Joining the next edition" dek="Common questions, a conversation with the team, and how admission works." />
  <section className="j-sec j-cream">
    <div className="j-wrap">
      <Head title="The next edition" em="at a glance"><p>Dates and fee will be announced with the programme.</p></Head>
      <p className="j-lede">Gujarat, Maharashtra and Goa. Dates: <Value value={null} /></p>
      <Button href="#connect">Admissions and contact</Button>
    </div>
  </section>
</SiteShell>
```
