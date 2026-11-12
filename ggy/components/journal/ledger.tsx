"use client";

import { useRef } from "react";
import { Footprints, NotebookPen } from "lucide-react";
import { CONCEPT_NOTE, itinerary8, previousEdition } from "@/content/ggy";
import { gsap, MOTION_QUERIES, useGSAP } from "@/lib/gsap";
import { NoteRef } from "../primitives";
import { Head } from "./head";

const LAST = itinerary8.length - 1;

/**
 * The 8th edition, day by day, from the concept note. On large screens the
 * section holds still and the nine days travel past as a line of cards; a
 * railway runs along the top with a train that keeps pace with the reader
 * and lights each stop as it is reached. Elsewhere the cards scroll sideways
 * on their own and the railway is a still key.
 */
export function Ledger() {
  const root = useRef<HTMLElement>(null);
  const facts: [string, string][] = [
    ["Route", previousEdition.route],
    ["Delegates", previousEdition.delegates],
    ["Distance", previousEdition.distance],
    ["Yatra leader", previousEdition.yatraLeader],
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_QUERIES.desktop, () => {
        const el = root.current!;
        const stage = el.querySelector<HTMLElement>("[data-trip-stage]")!;
        const track = el.querySelector<HTMLElement>("[data-trip-track]")!;
        const train = el.querySelector<HTMLElement>("[data-trip-train]")!;
        const rail = train.parentElement!;
        const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", el);
        const cards = gsap.utils.toArray<HTMLElement>("[data-trip-day]", el);
        stage.setAttribute("data-pinned", "");

        const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
        let current = -1;
        const light = (i: number) => {
          if (i === current) return;
          current = i;
          stops.forEach((s, k) => {
            s.toggleAttribute("data-on", k === i);
            s.toggleAttribute("data-past", k < i);
          });
          cards.forEach((c, k) => c.toggleAttribute("data-on", k === i));
        };
        light(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => light(Math.round(self.progress * LAST)),
          },
        });
        tl.to(track, { x: () => -distance() }, 0).fromTo(train, { x: 0 }, { x: () => rail.clientWidth, force3D: true }, 0);

        return () => {
          stage.removeAttribute("data-pinned");
          stops.forEach((s) => s.removeAttribute("data-on"));
          cards.forEach((c) => c.removeAttribute("data-on"));
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="itinerary" className="j-sec j-paper x-trip" data-nav="dark" data-j-station="itinerary" data-arch aria-labelledby="itinerary-title">
      <div className="j-wrap">
        <Head id="itinerary-title" title="Nine days" em="on the road">
          <p>
            The itinerary of the 8th edition, 23 to 31 March, as printed in the {CONCEPT_NOTE}.
            <NoteRef id="dates8" />
          </p>
        </Head>

        <dl className="x-trip__facts">
          {facts.map(([t, v]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="x-trip__stage" data-trip-stage>
        <div className="j-wrap x-trip__rail-wrap">
          <div className="x-rail" aria-hidden="true">
            <i className="x-rail__track" />
            <ol className="x-rail__stops">
              {itinerary8.map((d) => (
                <li key={d.day} className="x-rail__stop" data-stop>
                  <i />
                  <span className="x-rail__day">Day {d.day}</span>
                  <span className="x-rail__city">{d.city}</span>
                </li>
              ))}
            </ol>
            <span className="x-rail__train" data-trip-train>
              <svg viewBox="0 0 64 26">
                <rect x="1" y="4" width="26" height="16" rx="4" className="car" />
                <rect x="31" y="2" width="31" height="18" rx="6" className="engine" />
                <rect x="5" y="8" width="7" height="6" rx="1.5" className="win" />
                <rect x="15" y="8" width="7" height="6" rx="1.5" className="win" />
                <rect x="36" y="6" width="9" height="7" rx="1.5" className="win" />
                <rect x="55" y="7" width="5" height="5" rx="2.5" className="lamp" />
                <circle cx="8" cy="22" r="3" />
                <circle cx="20" cy="22" r="3" />
                <circle cx="38" cy="22" r="3" />
                <circle cx="54" cy="22" r="3" />
              </svg>
            </span>
          </div>
        </div>

        <ol className="x-trip__track" data-trip-track>
          {itinerary8.map((d) => (
            <li key={d.day} className={`x-day${d.field ? " x-day--wide" : ""}`} data-trip-day>
              <header className="x-day__head">
                <div>
                  <p className="x-day__date">
                    Day {d.day} · {d.date}
                  </p>
                  <h3 className="x-day__city">{d.city}</h3>
                </div>
              </header>
              <div className="x-day__body">
                <ul className="x-day__agenda">
                  {d.agenda.map((a) => (
                    <li key={a}>
                      <Footprints aria-hidden="true" strokeWidth={1.6} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                {d.field ? (
                  <aside className="x-day__field">
                    <p className="x-day__field-k">
                      <NotebookPen aria-hidden="true" strokeWidth={1.6} /> Field note
                    </p>
                    <h4>{d.field.title}</h4>
                    <p>{d.field.text}</p>
                  </aside>
                ) : null}
              </div>
            </li>
          ))}
          <li className="x-day x-day--end" aria-hidden="true">
            <p>Journey&rsquo;s end</p>
            <span>Lucknow, 31 March</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
