"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { BROCHURE, careerPaths, CONCEPT_NOTE, saarthi, takeaways } from "@/content/ggy";
import { institutionLogos, starAlums } from "@/content/ggy27";
import { Marquee } from "./marquee";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head, Title } from "./head";
import { Briefcase, Compass, FlaskConical, GraduationCap, HeartHandshake, Landmark, Network, UsersRound, type LucideIcon } from "lucide-react";

const TOOK_ICONS: LucideIcon[] = [Compass, UsersRound, Briefcase, FlaskConical, Landmark, Network];

/* The ten paths exactly as the brochure prints them, under four headings
   of the site's own. */
const P = careerPaths;
const FIELDS: { name: string; Icon: LucideIcon; paths: string[] }[] = [
  { name: "Public service", Icon: Landmark, paths: [P[1], P[0], P[4]] },
  { name: "Private sector", Icon: Briefcase, paths: [P[2], P[8], P[9]] },
  { name: "Learning and research", Icon: GraduationCap, paths: [P[5], P[6]] },
  { name: "Social impact", Icon: HeartHandshake, paths: [P[7], P[3]] },
];

/**
 * Afterwards, on the dark ground. The concept note's purpose for its alumni
 * is set as a statement; then the ten paths the brochure lists, in four
 * cards by field. What
 * delegates took away follows as a bento of six cards.
 */
export function After() {
  const root = useRef<HTMLElement>(null);
  // The alumni figure counts up once as it arrives.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.any, () => {
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const full = el.dataset.count ?? "";
          const to = parseInt(full, 10);
          const tail = full.replace(/^\d+/, "");
          const n = { v: 0 };
          gsap.to(n, { v: to, duration: 1.8, ease: "power2.out", snap: { v: 1 }, onUpdate: () => (el.textContent = `${n.v}${tail}`), scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="after" className="j-sec j-deep j-sheet on-dark" data-nav="light" data-j-station="after" data-arch aria-labelledby="after-title">
      <div className="j-wrap">
        <figure className="j-saarthi">
          <blockquote data-ink>{saarthi.text}</blockquote>
          <figcaption className="j-meta">From the {CONCEPT_NOTE}.</figcaption>
        </figure>

        <Head id="after-title" title="Where alumni" em="went next">
          <p>As listed in the {BROCHURE} under “Life after Good Governance Yatra”.</p>
        </Head>

        <ul className="x-paths">
          {FIELDS.map((f) => (
            <li key={f.name} className="x-card x-paths__card" data-row>
              <div className="x-paths__head">
                <span className="x-paths__icon">
                  <f.Icon aria-hidden="true" strokeWidth={1.5} />
                </span>
                <span className="x-paths__count">
                  {f.paths.length} {f.paths.length === 1 ? "path" : "paths"}
                </span>
              </div>
              <h3 className="x-paths__name">{f.name}</h3>
              <ul className="x-paths__list">
                {f.paths.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="j-meta x-paths__src">The ten paths are the brochure’s; the four headings are added here to group them.</p>

        {/* Star alumni, held like a hand of photographs that opens when it is
            pointed at; then the institutions, carried past on a paper strip. */}
        <div className="x-stars">
          <Title as="h3" sub title="Some of our" em="star alumni" />
          <ul className="x-stars__hand" aria-label="GGY star alumni">
            {starAlums.map((a, i) => (
              <li key={a.name} className="x-stars__card" style={{ "--i": i - (starAlums.length - 1) / 2, "--a": Math.abs(i - (starAlums.length - 1) / 2) } as CSSProperties}>
                <figure tabIndex={0}>
                  <div className="x-stars__photo">
                    <Image src={a.photo.src} alt={a.photo.alt} fill sizes="(min-width: 64rem) 15rem, 40vw" quality={80} className="object-cover" />
                  </div>
                  <figcaption>{a.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="x-logos">
        <p className="x-logos__label">Where GGY alumni have worked and studied</p>
        <Marquee
          className="x-logos__belt"
          label="Institutions and organisations"
          items={institutionLogos.map((l) => (
            <Image key={l.name} src={l.src} alt={l.name} width={l.width} height={l.height} sizes="10rem" className="x-logos__img" data-invert={l.invert ? "" : undefined} />
          ))}
        />
      </div>

      <div className="j-wrap">

        <div className="j-took">
          <Title as="h3" sub title="What delegates" em="took away" />
          <ul className="x-bento">
            {takeaways.map((t, i) => {
              const Icon = TOOK_ICONS[i] ?? Compass;
              const alumni = t.name === "Impact Legacy" ? t.text.match(/(\d+)\+/) : null;
              return (
                <li key={t.name} className={`x-bento__cell x-bento__cell--${i}`} data-row>
                  <div className="x-card x-bento__card">
                    <div className="x-bento__top">
                      <span className="x-bento__icon">
                        <Icon aria-hidden="true" strokeWidth={1.5} />
                      </span>
                      <span className="x-bento__n" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {alumni ? (
                      <p className="x-bento__figure" aria-hidden="true">
                        <span data-count={`${alumni[1]}+`}>{alumni[1]}+</span>
                        <small>alumni</small>
                      </p>
                    ) : null}
                    <h4 className="x-bento__name">{t.name}</h4>
                    <p className="x-bento__text">
                      {t.text}
                      {t.note ? <NoteRef id={t.note} /> : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="j-meta x-bento__src">As listed in the 2025 brochure, which also offered delegates a certificate of appreciation.</p>
        </div>
      </div>
    </section>
  );
}
