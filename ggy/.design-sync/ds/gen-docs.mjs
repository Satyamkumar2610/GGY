#!/usr/bin/env node
// One-time doc scaffolder for design-sync. Writes .design-sync/docs/<Name>.md
// for each component that has no doc yet, from:
//   - the component's own JSDoc (read from the .d.ts tree in .ds-dist/types),
//   - a placement note written below (where it sits on the page, what ground
//     it needs, whether it takes props),
//   - the verified preview in .design-sync/previews/<Name>.tsx as the example.
// Existing docs are never overwritten: once written they are human-edited.
//
// Run from ggy/ after build.mjs:  node .design-sync/ds/gen-docs.mjs

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '.design-sync/docs';
const TYPES = '.ds-dist/types';
const PREVIEWS = '.design-sync/previews';
mkdirSync(OUT, { recursive: true });

const SECTION = 'Takes no props: a full-width homepage section that renders its own copy and photographs from the site content. Place it directly inside `<SiteShell>`, in page order, between other sections.';

// [group, placement]
const DOCS = {
  Button: ['Foundations', 'The one action style on the site. `href` is required (it renders an `<a>`); `children` must be a plain string because the label is printed twice for the roll-over. On crimson grounds use `variant="cream"`, or `"ghost"` inside an `on-dark` wrapper.'],
  Value: ['Foundations', 'Use for every fact that may not be confirmed yet (dates, fee, cohort): pass `null` and it prints "To be announced" in the muted italic. Never write placeholder text by hand.'],
  NoteRef: ['Foundations', 'A dagger placed straight after an unconfirmed figure. `id` is a key of `window.Ggy.pendingNotes` (duration, alumni, dates8, workshops, titles, flagoff, process).'],
  Script: ['Foundations', 'Wrap a state name written in its own script. `lang`: `gu` (Gujarati), `mr` (Marathi), `kok` (Konkani), `hi` (Hindi); it sets the Anek Gujarati or Anek Devanagari face.'],
  Star: ['Foundations', 'The six-pointed mark that opens every chapter. Colour follows the ground: marigold on paper, lighter marigold inside `on-dark`. Usually used through `Head`.'],
  Title: ['Foundations', 'Every section title: `title` in Anek capitals, then `em` in Gambetta italic marigold on its own line. `as="h3" sub` for a title inside a section. Must sit inside a `.j-wrap` container (inside `<SiteShell>`) to be styled.'],
  Head: ['Foundations', 'The section head: star and drawn rule, `Title` on the left, the note (children) on the right on wide screens. Put it first inside `<section className="j-sec j-paper|j-cream|j-deep"><div className="j-wrap">`. On `j-deep` add `on-dark` to the section.'],
  Act: ['Foundations', 'Opens each act of the page (four on the homepage). On the page it is a scroll-scrubbed zoom through five prints; with reduced motion it is the first photograph at full bleed with the title over it. `photos` takes five keys of `window.Ggy.photos`; never repeat the photograph used in the section just before or after.'],
  CardSwap: ['Interactive', 'A stacked deck of photograph cards that swaps on a timer or drag. Children are `Ggy.Card` elements (exported from the bundle); give each card an absolutely positioned image and a short label. `theme="light"` on paper grounds.'],
  BorderGlow: ['Interactive', 'A paper sheet whose edge catches a marigold light near the pointer; used for the pass on the joining section. Keep the GGY colours shown in the example. Content inside is on white, so do not put `on-dark` between the ground and the sheet.'],
  HoloCard: ['Interactive', 'A foil card that tilts under the pointer. The site uses it only for the round foil seal (`image={Ggy.SEAL}`, `radius` = half the `width`).'],
  ScrollStack: ['Interactive', 'Prints laid one over the next as the reader scrolls. Children are `Ggy.ScrollStackItem` elements (exported from the bundle). `useWindowScroll` when it runs with the page scroll; otherwise give the parent a fixed height.'],
  LandingNav: ['Chrome', 'The fixed top bar: wordmark, chapter links, menu. Takes no props. It reads the ground beneath it and switches between light and dark glass, and highlights the link whose section (`#yatra`, `#journey`, `#programme`, `#archive`, `#people`) is in view.'],
  LandingFooter: ['Chrome', 'The footer band on deep crimson. ' + SECTION],
  LandingHero: ['Opening', 'The opening: India cut as a window over the Gateway of India, the title "The Good Governance Yatra" and the route pill. ' + SECTION],
  Departure: ['Opening', '"Governance, on the ground": the deep crimson statement with the map of India and the route marquee. ' + SECTION],
  Field: ['Opening', '"The field is the classroom": paper ground, the hall-and-field comparison and the idea panels. ' + SECTION],
  FieldCompare: ['Opening', 'The lecture-hall / field photograph comparison. Takes no props. It is part of `Field`; on its own it needs the paper ground: `<section className="j-sec j-paper"><div className="j-wrap">`.'],
  IdeaPanels: ['Opening', 'The idea of the Yatra as a row of expanding panels. Takes no props. Part of `Field`; on its own it needs `<section className="j-sec j-paper"><div className="j-wrap">`.'],
  YatraFlight: ['Route', 'The pinned map flight over Gujarat, Maharashtra and Goa, with a card for each state. ' + SECTION],
  Coda: ['Route', '"So far, only the route is confirmed", on the cream ground, with the proposed plan for Maharashtra. ' + SECTION],
  ProposedPlan: ['Route', 'The tentative day plan proposed for Maharashtra. Takes no props. Part of `Coda`; on its own it needs `<section className="j-sec j-cream"><div className="j-wrap">`.'],
  Stages: ['Programme', '"Four stages of a personal learning journey" on deep crimson. ' + SECTION],
  Programme: ['Programme', '"Six parts of the programme", the list beside a CardSwap photograph deck. ' + SECTION],
  Decade: ['Record', '"A decade on the road": figure cards and the route of every past edition. ' + SECTION],
  Ledger: ['Record', '"Nine days on the road": the 2025 itinerary as a timeline and day cards. ' + SECTION],
  FieldGallery: ['Record', 'Field photographs from past editions, dealt as a scroll stack, each opening full screen. ' + SECTION],
  People: ['Record', '"The people delegates met", filterable by edition. ' + SECTION],
  After: ['Record', 'The Saarthi quote and "Where alumni went next" on deep crimson. ' + SECTION],
  Questions: ['Joining', '"Questions, answered": the accordion beside the map. ' + SECTION],
  ComeAndSee: ['Joining', 'The full-bleed invitation over the cohort photograph. ' + SECTION],
  Joining: ['Joining', '"The journey changes the way you see governance": the pass, the readiness check, the admission process and contact, on deep crimson. ' + SECTION],
  AdmissionPath: ['Joining', 'The five-step admission process as climbing cards. Takes no props. Part of `Joining`; on its own it needs the deep crimson ground: `<section className="j-sec j-deep on-dark on-crimson"><div className="j-wrap"><div className="j-process">`.'],
  Readiness: ['Joining', 'The "Are you ready to apply?" self-check. Takes no props. Part of `Joining`; on its own it needs `<section className="j-sec j-deep on-dark on-crimson"><div className="j-wrap"><div className="j-ready">`.'],
};

function jsdoc(name) {
  for (const f of walk(TYPES)) {
    const txt = readFileSync(f, 'utf8');
    const m = new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*export\\s+declare\\s+(?:function|const)\\s+${name}\\b`).exec(txt)
      ?? new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*declare\\s+(?:function|const)\\s+${name}\\b`).exec(txt);
    if (m) return m[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join('\n').trim();
  }
  return '';
}
function walk(d, out = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}
function example(name) {
  const p = join(PREVIEWS, `${name}.tsx`);
  if (!existsSync(p)) return '';
  let src = readFileSync(p, 'utf8');
  const imp = /import\s*\{([^}]*)\}\s*from\s*"ggy";/.exec(src)?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  src = src.replace(/^import[^\n]*\n/gm, '').trim();
  return `\`\`\`jsx\n// const { ${imp.join(', ')} } = window.Ggy;  (inside <SiteShell>)\n${src}\n\`\`\``;
}

let wrote = 0;
for (const [name, [group, place]] of Object.entries(DOCS)) {
  const out = join(OUT, `${name}.md`);
  if (existsSync(out)) continue;
  const doc = jsdoc(name);
  const ex = example(name);
  writeFileSync(out, `---\ncategory: ${group}\n---\n\n${doc ? doc + '\n\n' : ''}**Use.** ${place}\n${ex ? `\n## Example\n\n${ex}\n` : ''}`);
  wrote++;
}
console.error(`docs: ${wrote} written, ${Object.keys(DOCS).length - wrote} kept`);
