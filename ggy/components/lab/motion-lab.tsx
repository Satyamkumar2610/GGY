"use client";

import { ControlPanel, ControlsProvider } from "./controls";
import { HeroEntrance, MaskReveal, TypeEntrance, ImageScaling, FullScreen, Horizontal } from "./experiments-a";
import { HeroSequence, RouteVariants, SectionTransitions, NavInteractions, LinkHovers, PageTransitions } from "./experiments-b";
import { PaperComparison, TypeComparison } from "./comparisons";

const toc = [
  ["type", "Type"],
  ["paper", "Paper"],
  ["x1", "1 Hero entrance"],
  ["x2", "2 Mask reveal"],
  ["x3", "3 Type entrance"],
  ["x4", "4 Image scaling"],
  ["x5", "5 Full screen"],
  ["x6", "6 Horizontal"],
  ["x7", "7 Hero sequence"],
  ["x8", "8 Route"],
  ["x9", "9 Transitions"],
  ["x10", "10 Navigation"],
  ["x11", "11 Links"],
  ["x12", "12 Pages"],
];

/** Private motion lab: isolated, adjustable experiments. Nothing here is used by the site. */
export function MotionLab() {
  return (
    <ControlsProvider>
      <header className="page py-10">
        <p className="meta text-muted">GGY · private development route · not indexed</p>
        <h1 className="d-l mt-3">Motion lab</h1>
        <nav aria-label="Experiments" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem]">
          {toc.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="tlink tlink-static">
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <TypeComparison />
        <PaperComparison />
        <HeroEntrance />
        <MaskReveal />
        <TypeEntrance />
        <ImageScaling />
        <FullScreen />
        <Horizontal />
        <HeroSequence />
        <RouteVariants />
        <SectionTransitions />
        <NavInteractions />
        <LinkHovers />
        <PageTransitions />
        <div className="h-[40vh]" />
      </main>
      <ControlPanel />
    </ControlsProvider>
  );
}
