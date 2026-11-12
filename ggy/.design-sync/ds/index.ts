/**
 * Design-system entry for the GGY site (design-sync only; the website never
 * imports this file). It names what the live homepage is built from, so the
 * sync ships exactly those pieces and nothing from the lab or the retired
 * chapter components.
 *
 * Imports go through the "@/…" and "@ds/…" aliases so the emitted .d.ts tree
 * can be relocated by build.mjs.
 */

// Page root (layout.tsx + the `.lp` scope from page.tsx).
export { SiteShell } from "@ds/site-shell";

// The site's photographs (src inlined as data URLs by build.mjs) and the
// footnote texts NoteRef reads. Use these instead of placeholder images.
export { photos, pendingNotes } from "@/content/ggy";
export type { Photo, PhotoKey, NoteId } from "@/content/ggy";
/** The foil seal of the Yatra (PNG, transparent), as used on the pass. */
export const SEAL: string = "/images/ggy-seal.png";

// Primitives
export { Button, Value, NoteRef, Script } from "@/components/primitives";
export { Star, Title, Head } from "@/components/journal/head";

// Cards and stacks (React Bits pieces the homepage uses)
export { default as CardSwap, Card } from "@/components/CardSwap";
export { default as BorderGlow } from "@/components/BorderGlow";
export { default as HoloCard } from "@/components/HoloCard";
export { default as ScrollStack, ScrollStackItem } from "@/components/ScrollStack";

// Opening
export { LandingNav } from "@/components/landing/landing-nav";
export { LandingHero } from "@/components/landing/landing-hero";
export { Departure, Field } from "@/components/journal/opening";
export { FieldCompare } from "@/components/journal/field-compare";
export { IdeaPanels } from "@/components/journal/idea-panels";

// Chapter openings and the route
export { Act } from "@/components/journal/act";
export { YatraFlight } from "@/components/landing/yatra-flight";
export { AtlasMap } from "@/components/atlas/atlas-map";
export { Coda } from "@/components/journal/chapters";
export { ProposedPlan } from "@/components/journal/proposed-plan";

// Journal chapters
export { Stages } from "@/components/journal/stages";
export { Programme } from "@/components/journal/programme";
export { Decade } from "@/components/journal/decade";
export { Ledger } from "@/components/journal/ledger";
export { FieldGallery } from "@/components/field-gallery";
export { People } from "@/components/journal/people";
export { After } from "@/components/journal/after";
export { Questions } from "@/components/journal/questions";

// Joining and the close
export { ComeAndSee, LandingFooter } from "@/components/landing/landing-sections";
export { Joining } from "@/components/journal/joining";
export { AdmissionPath } from "@/components/journal/admission-path";
export { Readiness } from "@/components/readiness";
export { Thread } from "@/components/journal/thread";

// Page-level motion controllers (render nothing, or a hairline; they animate
// the sections above by their data-attributes)
export { MotionProvider } from "@/components/motion/motion-provider";
export { SmoothScroll } from "@/components/motion/smooth-scroll";
export { ScrollProgress } from "@/components/motion/scroll-progress";
export { ScrollRefresh } from "@/components/motion/scroll-refresh";
export { LandingMotion } from "@/components/landing/landing-motion";
export { JournalMotion } from "@/components/journal/journal-motion";
export { CinemaMotion } from "@/components/motion/cinema-motion";
export { PageMotion } from "@/components/motion/page-motion";
export { Interactions } from "@/components/motion/interactions";
export { TicketMotion } from "@/components/motion/ticket-motion";
