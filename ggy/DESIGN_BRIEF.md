# GGY design brief and handoff

Read this first, then `AGENTS.md` (Next.js 16 differs from older versions: read `node_modules/next/dist/docs/` before writing framework code).

## 1. What this is

Website for **Good Governance Yatra (GGY)**: a 9–10 day immersive travel programme for aspiring public leaders, run by Rashtram School of Public Leadership, Rishihood University. The upcoming edition travels through **Maharashtra, Goa and Gujarat**; dates, stops and applications are not announced. The site is judged on **design**, against a competitor (CMGGA, cmgga.vercel.app) whose site is strong. Goal: the best-designed, most dynamic, scroll-driven site, in our own identity.

Branch: `claude/brave-hopper-9yxu80` (not yet merged to `main`). App lives in `ggy/`.

## 2. Content rules (do not break)

- Every fact has a source: `content/ggy.ts` is the single source of truth. Sources are the 2025 brochure and the GGY concept note.
- Unconfirmed or conflicting facts carry a † (`NoteRef`, text in `pendingNotes`). Never "fix" them: duration 9 vs 10 days, 8th-edition dates, alumni 300+/350+/400+, Workshops description.
- Upcoming-edition values that are `null` render as "To be announced". Do not invent dates, prices or stops.
- Names and titles are reproduced as printed. The Maharashtra plan is tentative and says so.
- Image credits and licences stay in captions (Wikimedia images require attribution).

## 3. Identity (keep unless the new direction replaces it)

- **Primary: crimson `#710017`** (from the parent university's footer); deep `#55000f`.
- **Secondary: `#db5627`** (`--color-saffron`); `--color-saffron-ink #a8401d` for small text on light grounds; `--color-saffron-soft #e9a24c` for accents on crimson.
- Neutrals: paper `#f7f6f3`, cream `#f6ead6`, ink `#141210`, ivory `#f5f1ea`.
- Type: **Anek** (display; width axis `wdth` 75–112, Latin + Devanagari + Gujarati), **Gambetta** (quotations, serif), **Switzer** (text). Capitals only for physical objects; no all-caps eyebrows, no middle-dot labels.
- Full-bleed sections, no inset rounded "sheets". Crimson grounds are lit by `.gloss` (diagonal planes plus a scroll-carried sheen).
- House eases in `lib/gsap.ts`: `land` (reveals), `swing` (scrubbed moves).

## 4. Page order and motion inventory

Hero (WebGL strips, pinned, `refreshPriority 3`) → Band (marquee, scroll-speed width/lean) → Edition notes (compare slider) → Route (state map, `data-drift`) → Idea (statement fills word by word) + Immersion stage (pinned zoom, `refreshPriority 2`) → Format (sticky camera journey) → Archive (stats, pinned sideways road, `refreshPriority 1`) → Itinerary (sticky day plate) → Field photographs → People (filter + spotlight roll) → Life after (paths) → Questions → Admissions → Colophon.

Motion lives in `components/motion/*`, one file per chapter, GSAP + ScrollTrigger + Lenis; `motion` for the header and map. `data-drift` titles shear in by line; `.gloss` sheen is in `page-motion.tsx`.

## 5. Engineering rules learned the hard way

1. **Never animate the same property of the same element in two timelines** (arrival + pinned). Split across elements (e.g. wrapper vs inner) or the second one inherits stale start values and the first jumps.
2. Pins change page height: give every pinned trigger a `refreshPriority` (3 hero, 2 immersion, 1 archive) and keep them in page order.
3. Nothing inside a pinned or sticky chapter may create a containing block (`transform`, `filter`, `contain`) on an ancestor. `.gloss` deliberately does not.
4. Put `.js-motion` styles behind the class set in `layout.tsx` before paint; content must read correctly without it. Honour `prefers-reduced-motion` (`MOTION_QUERIES` in `lib/gsap.ts`).
5. Images: only qualities in `next.config.ts` (75, 80, 82). Phones get an upright photo in the immersion stage.
6. After pulling while the dev server runs: stop it, `rm -rf .next`, restart, hard refresh. Stale CSS looks like a broken layout.
7. Fonts Gambetta/Switzer (ITF Free Font License) must not live in a public repo. Move to a private repo or supply at build time before launch.
8. Env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=true` only once content is confirmed.

Check before committing: `npx eslint components app lib && npm run build`, then screenshot desktop (1440×900) and phone (390×844), plus a reduced-motion pass.

## 6. How to borrow a reference design (not copy it)

**Allowed:** layout structure, grid and spacing relationships, type scale and pairing logic, colour *relationships*, motion behaviour and timing, interaction patterns. Rebuild them with our own content, palette, fonts, photographs and code.
**Not allowed:** their images, text, logos, icon artwork, illustrations, fonts under licence, or code copied line for line. No near-clone: the result must read as GGY.

Process:

1. **Capture.** Open the reference in Playwright (the domain must be allowlisted). Full-page screenshots at 1440 and 390; scroll slowly and capture each state of every effect; if a screen recording was provided, extract frames at the noted timestamps (`ffmpeg -ss <t> -i rec.mp4 -frames:v 1 out.png`).
2. **Measure.** Read computed styles: font sizes, line heights, tracking, section paddings, grid columns, colours, radii, shadows. Note libraries (gsap, lenis, three, framer-motion) from script URLs and global objects; read `data-*` attributes and class names for pin/scrub/marquee hints; sample `transform` and `opacity` at several scroll offsets to recover trigger start/end, easing and durations.
3. **Write the analysis before any code.** For each effect: what the reader sees, what it communicates, how it is built, the equivalent in our stack, what we change so it is ours. Get the user's agreement.
4. **Plan against our identity** (section 3), following the `frontend-design:frontend-design` skill: a compact token system, a layout concept, one memorable moment, and a check that nothing reads as the generic default.
5. **Build one effect at a time** in its own motion file, with the rules in section 5. Screenshot desktop and phone, with and without reduced motion, after each.
6. **Audit** against the checklist: contrast ≥ 4.5:1 for small text, visible focus, no horizontal scroll, headings in order, keyboard use of every control.

## 7. Skills and tools to use

- `frontend-design:frontend-design`: the design process (plan → critique → build). Primary.
- `ui-ux-pro-max` (repo-scoped `ggy:ui-ux-pro-max`): `--domain gsap` for motion skeletons, `--domain ux` for accessibility and animation rules, `--design-system` for tokens. Run its `search.py` from `.claude/skills/ui-ux-pro-max/scripts/`; delete `__pycache__` afterwards.
- `design:accessibility-review`, `design:design-critique`: before sign-off.
- Playwright (`require('playwright')`, preinstalled): capture, measure, verify. Chromium is at `/opt/pw-browsers/chromium`.
- `simplify` and `code-review`: after large changes.

## 8. Open items

- Decide the new design direction from the user's reference and concept (provided in the chat that opens this session).
- Font licence (section 5.7).
- Confirm the † items with the GGY team.
- Open a pull request into `main` when the user asks.
