import Image from "next/image";
import { Contours } from "./contours";
import type { CSSProperties } from "react";
import { learningJourney, photos } from "@/content/ggy";
import { JourneyMotion } from "./motion/journey-motion";

/**
 * The learning journey as a documentary push-in on one photograph from a past
 * session: each stage is a closer crop. On large screens the photograph stays
 * in view (sticky, not pinned — the hero and the archive already pin) while
 * the stages pass it as milestones on a road.
 */
const crops = [
  { s: 1, x: 0, y: 0 },
  { s: 1.6, x: -19, y: 8 },
  { s: 1.9, x: 45, y: 15 },
  { s: 2.2, x: -48, y: -39 },
];
const cropStyle = (i: number): CSSProperties => ({ transform: `translate(${crops[i].x}%, ${crops[i].y}%) scale(${crops[i].s})` });

function Crop({ i, sizes, className = "" }: { i: number; sizes: string; className?: string }) {
  const hall = photos.lectureHall;
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      <div className="absolute inset-0" style={cropStyle(i)}>
        <Image src={hall.src} alt={i === 0 ? hall.alt : ""} aria-hidden={i === 0 ? undefined : true} fill quality={82} sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

export function FormatChapter() {
  const hall = photos.lectureHall;
  return (
    <section id="learning" aria-labelledby="format-title" className="relative isolate bg-cream pb-[clamp(6rem,12vw,10rem)] pt-[clamp(6rem,12vw,11rem)]" data-format>
      <Contours variant="c" />
      <div className="page">
        <p className="kicker">
          <span className="num">04</span> The learning journey
        </p>
        <h2 id="format-title" className="d-l mt-6 max-w-[14ch]">
          Four stages of a <em>personal</em> learning journey
        </h2>
        <p className="mt-6 max-w-[30rem] text-ink-soft">
          As described for the 2025 edition. The format of the upcoming edition will be confirmed with its programme.
        </p>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-[var(--gap)] lg:grid-cols-12">
          {/* The camera: sticky on large screens */}
          <div className="hidden lg:col-span-7 lg:-ml-[var(--gutter)] lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div className="journey-frame relative aspect-[16/10] overflow-hidden bg-sand">
                <div className="absolute inset-0" data-journey-camera>
                  <Image src={hall.src} alt={hall.alt} fill quality={82} sizes="58vw" className="object-cover" />
                </div>
                <p aria-hidden="true" className="journey-readout">
                  <span className="num" data-journey-readout>
                    01
                  </span>
                  <span className="journey-readout-total">/ 04</span>
                </p>
              </div>
              <ol className="mt-3 grid grid-cols-4 gap-3" aria-hidden="true">
                {learningJourney.map((s, i) => (
                  <li key={s.name} className="journey-thumb" data-journey-thumb>
                    <Crop i={i} sizes="14vw" className="aspect-[16/10] rounded-[var(--radius-thumb)]" />
                    <span className="journey-thumb-bar" />
                    <span className="mt-2 block text-[0.75rem] text-muted">{s.name}</span>
                  </li>
                ))}
              </ol>
              <p className="caption mt-4">{hall.caption} Photograph from the GGY brochure; each stage is a closer crop of it.</p>
            </div>
          </div>

          {/* The stages, as milestones on a road */}
          <ol className="journey-stages lg:col-span-4 lg:col-start-9" data-journey-stages>
            {learningJourney.map((s, i) => (
              <li key={s.name} className="journey-stage py-10 lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:py-0" data-journey-stage>
                <span aria-hidden="true" className="journey-milestone" />
                <Crop i={i} sizes="100vw" className="mb-6 aspect-[16/10] rounded-[var(--radius-media)] lg:hidden" />
                <p aria-hidden="true" className="journey-num num">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="d-m mt-4">{s.name}</h3>
                <p className="lede mt-4 text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="caption mt-4 lg:hidden">{hall.caption} Photograph from the GGY brochure; each stage is a closer crop of it.</p>
      </div>

      <JourneyMotion />
    </section>
  );
}
