import Image from "next/image";
import Link from "next/link";
import { CONCEPT_NOTE, pastEditions, photos, proposedMaharashtra, stateDossiers, type StateDossier } from "@/content/ggy";
import { atLeast, unionBox, type Box } from "@/lib/atlas";
import { nativeOf, stateHref } from "@/lib/states";
import { STATE_TEXTURE } from "./atlas/atlas-map";
import { MapPlate } from "./map-plate";
import { PageHero } from "./page-hero";
import { NoteRef, Script, Value } from "./primitives";
import { StampOnVisit } from "./stamp-on-visit";
import { Postmark } from "./postmark";
import { upcoming } from "@/content/ggy";

function Credit({ k }: { k: keyof typeof photos }) {
  const p = photos[k];
  return (
    <p className="caption mt-2.5 max-w-[34rem]">
      {p.caption}. {p.credit}{" "}
      {p.license ? (
        <a className="tlink tlink-static" href={p.license.url} rel="license noopener" target="_blank">
          {p.license.name}
        </a>
      ) : null}
      {p.sourceUrl ? (
        <>
          {", "}
          <a className="tlink tlink-static" href={p.sourceUrl} rel="noopener" target="_blank">
            source
          </a>
        </>
      ) : null}
    </p>
  );
}

const STAMP = {
  "IN-GJ": "GUJARAT ✦ GANDHINAGAR ✦ 23.22° N 72.64° E ✦ ",
  "IN-GA": "GOA ✦ PANAJI ✦ 15.49° N 73.83° E ✦ ",
  "IN-MH": "MAHARASHTRA ✦ MUMBAI ✦ 19.08° N 72.88° E ✦ ",
} as const;

/**
 * A state's own page: the dossier set at length. The photograph is printed
 * inside the state's outline in the hero, and the page ends with the other
 * two states. General reference notes are marked as such; nothing here says
 * where the Yatra will stop.
 */
export function StatePage({ d }: { d: StateDossier }) {
  const native = nativeOf(d.name);
  const box: Box = (() => {
    // Goa is small: frame it close so its outline and photograph read.
    const b = atLeast(unionBox([d.iso]), d.iso === "IN-GA" ? 70 : 150);
    const m = (b[2] - b[0]) * 0.06;
    return [b[0] - m, b[1] - m, b[2] + m, b[3] + m];
  })();
  const routes = pastEditions.filter((e) => e.route.split(" – ").includes(d.name));
  const others = stateDossiers.filter((x) => x.iso !== d.iso);
  const [first, ...rest] = d.photos;
  return (
    <>
      <PageHero
        kicker="State dossier"
        title={
          <>
            {d.name} <Script lang={native.lang} className="page-title-native">{native.native}</Script>
          </>
        }
        standfirst={d.intro}
        meta={[
          { term: "Capital, for reference", value: d.capital.name },
          { term: "Official language", value: d.facts.find((f) => f.term === "Official language")?.value },
          { term: "Statehood", value: d.facts.find((f) => f.term === "Statehood")?.value },
        ]}
      >
        <MapPlate
          box={box}
          photos={{ [d.iso]: STATE_TEXTURE[d.iso] }}
          outline={[d.iso]}
          showRelief
          label={`Map of ${d.name}, with a photograph printed inside its outline.`}
        />
      </PageHero>

      <section id="photographs" aria-label={`Photographs of ${d.name}`} className="state-photos" data-thread="Photographs">
        <div className="page">
          <div className="state-photos-grid">
            <figure className="state-photo-main">
              <div className="media relative aspect-[3/2]" data-reveal>
                <Image src={photos[first].src} alt={photos[first].alt} fill quality={82} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </div>
              <Credit k={first} />
            </figure>
            {rest.map((k, i) => (
              <figure key={k} className={`state-photo-aside is-${i}`}>
                <div className="media relative aspect-[4/3]" data-reveal>
                  <Image src={photos[k].src} alt={photos[k].alt} fill quality={80} sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
                </div>
                <Credit k={k} />
              </figure>
            ))}
            <div className="state-reference">
              <Postmark ring={STAMP[d.iso]} centre={native.native} lang={native.lang} className="state-stamp" />
              <dl className="dossier-facts">
                <div>
                  <dt>Capital, for reference</dt>
                  <dd>
                    {d.capital.name}
                    <span className="block text-[0.8rem] text-muted">{d.capital.coords}</span>
                  </dd>
                </div>
                {d.facts
                  .filter((f) => f.term !== "Capital, for reference")
                  .map((f) => (
                    <div key={f.term}>
                      <dt>{f.term}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
              </dl>
              <p className="caption mt-4">General reference notes compiled for this page; not from GGY sources. The capital is a geographic reference point, not a stop.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="history" aria-labelledby="history-title" className="state-history" data-thread="With the Yatra">
        <div className="page grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-4">
            <h2 id="history-title" className="d-m">
              With the Yatra before
            </h2>
            <p className="caption mt-3 max-w-[18rem]">Routes as printed in the 2025 brochure. These are past editions, not the upcoming one.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="state-routes">
              {routes.map((r) => (
                <li key={r.year + r.route} data-row>
                  <span className="num">
                    {r.year}
                    {r.season && r.season !== "8th edition" ? <span className="state-route-season">{r.season.toLowerCase()}</span> : null}
                  </span>
                  <span className="font-display text-[1.35rem] leading-snug">{r.route}</span>
                </li>
              ))}
            </ul>

            {d.people.length ? (
              <div className="mt-12">
                <p className="kicker">Named among the role models delegates have met</p>
                <ul className="mt-4 space-y-3">
                  {d.people.map((p) => (
                    <li key={p.name} className="text-[1rem]">
                      <span className="font-display text-[1.25rem]">{p.name}</span>, <span className="text-ink-soft">{p.title}</span>
                    </li>
                  ))}
                </ul>
                <p className="caption mt-3">
                  Titles as printed in the 2025 brochure, which does not say in which edition delegates met them.
                  <NoteRef id="titles" />
                </p>
              </div>
            ) : null}

            {d.iso === "IN-MH" ? (
              <div className="mt-12 state-tentative">
                <p className="kicker">
                  Proposed in the {CONCEPT_NOTE}
                  <span className="dossier-tag">Tentative</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-[0.95rem]">
                  {proposedMaharashtra.flatMap((day) => day.items).map((it) => (
                    <li key={it} className="dossier-tentative">
                      {it}
                    </li>
                  ))}
                </ul>
                <p className="caption mt-3">A proposal, not a confirmed programme. None of these visits has been confirmed.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="status" aria-labelledby="status-title" className="state-status" data-thread="Status">
        <div className="page grid gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <h2 id="status-title" className="d-m lg:col-span-4">
            Programme status
          </h2>
          <dl className="register-lines lg:col-span-7 lg:col-start-6">
            {[
              ["Stops in this state", null],
              ["Dates", upcoming.dates],
              ["Order of travel", upcoming.orderOfTravel],
            ].map(([k, v]) => (
              <div key={k} className="register-line">
                <dt>{k}</dt>
                <dd>
                  <Value value={v} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="others" aria-label="The other states" className="state-others" data-thread="Next">
        <div className="page">
          <p className="kicker">The other two states</p>
          <ul className="state-others-list">
            {others.map((o) => {
              const n = nativeOf(o.name);
              return (
                <li key={o.iso} data-row>
                  <Link href={stateHref(o.iso)} className="next-row">
                    <span className="next-title">
                      {o.name} <Script lang={n.lang} className="text-crimson">{n.native}</Script>
                    </span>
                    <span className="next-text">{o.intro.split(". ")[0]}.</span>
                    <span aria-hidden="true" className="next-go" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="caption mt-6">
            Read in an editorial order only. The stops and the order of travel are still to be announced. This page has been added to <Link className="tlink tlink-static" href="/journal">your field journal</Link>.
          </p>
        </div>
      </section>
      <StampOnVisit iso={d.iso} />
    </>
  );
}
