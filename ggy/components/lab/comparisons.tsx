import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { photos } from "@/content/ggy";

/* ---------- Typography: Gambetta (current) against Anek, with real GGY content ---------- */

const gambetta: CSSProperties = { fontFamily: "var(--font-gambetta), serif", fontWeight: 300, letterSpacing: "-0.035em" };
const anekCond: CSSProperties = { fontFamily: "var(--lab-anek-latin), sans-serif", fontWeight: 500, fontVariationSettings: '"wdth" 75', letterSpacing: "-0.02em" };
const anekWide: CSSProperties = { fontFamily: "var(--lab-anek-latin), sans-serif", fontWeight: 300, fontVariationSettings: '"wdth" 112', letterSpacing: "-0.03em" };
const deva = (style: "current" | "cond" | "wide"): CSSProperties =>
  style === "current"
    ? { fontFamily: "var(--font-anek-devanagari), sans-serif", fontWeight: 500 }
    : { fontFamily: "var(--lab-anek-deva), sans-serif", fontWeight: style === "cond" ? 500 : 300, fontVariationSettings: style === "cond" ? '"wdth" 75' : '"wdth" 112' };
const guj = (style: "current" | "cond" | "wide"): CSSProperties =>
  style === "current"
    ? { fontFamily: "var(--font-anek-gujarati), sans-serif", fontWeight: 500 }
    : { fontFamily: "var(--lab-anek-guj), sans-serif", fontWeight: style === "cond" ? 500 : 300, fontVariationSettings: style === "cond" ? '"wdth" 75' : '"wdth" 112' };

function Specimen({ name, latin, style }: { name: string; latin: CSSProperties; style: "current" | "cond" | "wide" }) {
  return (
    <div className="min-w-0" data-specimen={style}>
      <p className="meta text-muted">{name}</p>
      <p className="mt-4 text-[clamp(2.6rem,1rem+4.4vw,5.6rem)] leading-[0.92]" style={latin}>
        Good Governance Yatra
      </p>
      <p className="mt-6 text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] leading-[1.02]" style={latin}>
        What is confirmed, and what came before.
      </p>
      <div className="mt-8 space-y-2 text-[clamp(1.5rem,1rem+1.6vw,2.4rem)] leading-[1.15]">
        <p>
          <span style={latin}>Maharashtra</span> <span lang="mr" style={deva(style)}>महाराष्ट्र</span>
        </p>
        <p>
          <span style={latin}>Goa</span> <span lang="mr" style={deva(style)}>गोवा</span>{" "}
          <span lang="kok" className="text-[0.6em] text-muted" style={deva(style)}>
            गोंय
          </span>
        </p>
        <p>
          <span style={latin}>Gujarat</span> <span lang="gu" style={guj(style)}>ગુજરાત</span>
        </p>
      </div>
      <p className="mt-6 max-w-[26rem] text-[0.95rem] text-ink-soft">
        Body copy stays in Switzer in every option: “The upcoming edition travels through Maharashtra, Goa and Gujarat.”
      </p>
    </div>
  );
}

export function TypeComparison() {
  return (
    <section id="type" className="border-t border-hair py-16">
      <div className="page">
        <p className="meta text-muted">Comparison 1</p>
        <h2 className="d-m mt-2">Display type with real content</h2>
        <p className="mt-3 max-w-[48rem] text-[0.95rem] opacity-80">
          Current: Gambetta Light for Latin, Anek 500 for Indic scripts. Options: Anek Latin with matching Anek Devanagari and Gujarati,
          condensed (width 75) or extended (width 112). The site currently writes Goa as गोंय (Konkani); गोवा is the Hindi and Marathi spelling.
        </p>
        <div className="mt-10 grid gap-14 lg:grid-cols-3 lg:gap-10">
          <Specimen name="Current · Gambetta 300 + Anek 500" latin={gambetta} style="current" />
          <Specimen name="Option A · Anek condensed 500" latin={anekCond} style="cond" />
          <Specimen name="Option B · Anek extended 300" latin={anekWide} style="wide" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Paper colours, tested against real photographs ---------- */

const papers: { name: string; bg: string; fg: string; soft: string; muted: string; accent: string; contrast: string }[] = [
  { name: "Current · #F3F0EA", bg: "#F3F0EA", fg: "#141210", soft: "#4A433D", muted: "#6B635B", accent: "#8E2531", contrast: "ink 16.4 · muted 5.2 · crimson 7.5" },
  { name: "Archival white · #F7F6F3", bg: "#F7F6F3", fg: "#141210", soft: "#4A433D", muted: "#6B635B", accent: "#8E2531", contrast: "ink 17.3 · muted 5.5 · crimson 7.9" },
  { name: "Stone · #E6E3DD", bg: "#E6E3DD", fg: "#141210", soft: "#4A433D", muted: "#6B635B", accent: "#8E2531", contrast: "ink 14.6 · muted 4.6 · crimson 6.7" },
  { name: "Ink-led · #141210", bg: "#141210", fg: "#F5F1EA", soft: "#C9C2B8", muted: "#AAA39A", accent: "#E2737B", contrast: "ivory 16.6 · dim 7.5 · crimson 6.2" },
];

function Panel({ p, children }: { p: (typeof papers)[number]; children: ReactNode }) {
  return (
    <div className="p-6" style={{ background: p.bg, color: p.fg }} data-paper={p.name}>
      <p className="meta" style={{ color: p.muted }}>
        {p.name}
      </p>
      {children}
      <p className="mt-4 text-[0.75rem]" style={{ color: p.muted }}>
        Contrast: {p.contrast}
      </p>
    </div>
  );
}

export function PaperComparison() {
  const a = photos.highCourt;
  const b = photos.cohort;
  return (
    <section id="paper" className="border-t border-hair py-16">
      <div className="page">
        <p className="meta text-muted">Comparison 2</p>
        <h2 className="d-m mt-2">Paper colour against the photographs</h2>
        <p className="mt-3 max-w-[48rem] text-[0.95rem] opacity-80">
          Each panel uses the same two photographs, ink headline, secondary text, caption and crimson link. All text pairs pass WCAG AA.
        </p>
      </div>
      <div className="mt-10 grid gap-1 md:grid-cols-2 xl:grid-cols-4">
        {papers.map((p) => (
          <Panel key={p.name} p={p}>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden">
              <Image src={a.src} alt="" fill sizes="(min-width: 1280px) 25vw, 50vw" className="object-cover" />
            </div>
            <p className="mt-5 font-display text-[2rem] font-light leading-[1] tracking-[-0.03em]">Three states on India’s western coast</p>
            <p className="mt-3 text-[0.92rem]" style={{ color: p.soft }}>
              Arranged from south to north. The stops and the order of travel are still to be announced.
            </p>
            <div className="relative mt-5 aspect-[16/7] overflow-hidden">
              <Image src={b.src} alt="" fill sizes="(min-width: 1280px) 25vw, 50vw" className="object-cover" />
            </div>
            <p className="mt-2 text-[0.78rem]" style={{ color: p.muted }}>
              Delegates of a past edition. Photograph from the GGY brochure.
            </p>
            <p className="mt-4 text-[0.95rem] underline underline-offset-4" style={{ color: p.accent }}>
              Write to the GGY team
            </p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
