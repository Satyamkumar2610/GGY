import type { Metadata } from "next";
import Link from "next/link";
import { stateDossiers } from "@/content/ggy";
import { stateHref, nativeOf } from "@/lib/states";
import { PageHero } from "@/components/page-hero";
import { MapPlate, boxOf } from "@/components/map-plate";
import { Page } from "@/components/page-effects";
import { Script } from "@/components/primitives";
import { STATE_TEXTURE } from "@/components/atlas/atlas-map";
import { atlas } from "@/lib/atlas";

export const metadata: Metadata = {
  title: "The states",
  description: "Gujarat, Goa and Maharashtra: the three states of the upcoming Good Governance Yatra. Open a state dossier. Stops, dates and the order of travel are to be announced.",
  alternates: { canonical: "/states" },
};

function Silhouette({ iso }: { iso: string }) {
  const s = atlas.states.find((x) => x.iso === iso)!;
  const [x0, y0, x1, y1] = s.bounds;
  const pad = Math.max(x1 - x0, y1 - y0) * 0.08;
  return (
    <svg viewBox={`${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`} className="states-sil" aria-hidden="true">
      <path d={s.d} />
    </svg>
  );
}

export default function StatesPage() {
  return (
    <Page name="states">
      <PageHero
        kicker="The states"
        title="Three states on the western coast."
        standfirst="The upcoming Yatra travels through Gujarat, Goa and Maharashtra. Choose a state, on the map or in the list, to open its dossier. The stops, the dates and the order of travel are still to be announced."
        meta={[{ term: "Order shown", value: "North to south. Not the order of travel." }]}
      >
        <MapPlate
          box={boxOf(["IN-GJ", "IN-GA", "IN-MH"], 0.1)}
          photos={STATE_TEXTURE}
          showRelief
          names={{ "IN-GJ": "Gujarat", "IN-MH": "Maharashtra" }}
          links={Object.fromEntries(stateDossiers.map((d) => [d.iso, { href: stateHref(d.iso), label: `Open the ${d.name} dossier` }]))}
          label="Map of western India. Gujarat, Goa and Maharashtra each open a state dossier."
        />
      </PageHero>

      <section id="list" aria-label="The three states" className="states-list" data-thread="The states">
        <div className="page">
          <ul>
            {stateDossiers.map((d) => {
              const n = nativeOf(d.name);
              return (
                <li key={d.iso} data-row>
                  <Link href={stateHref(d.iso)} className="states-row">
                    <Silhouette iso={d.iso} />
                    <span className="states-name">
                      {d.name}
                      <Script lang={n.lang} className="states-native">
                        {n.native}
                      </Script>
                    </span>
                    <span className="states-text">
                      {d.intro}
                      <span className="states-meta">
                        Capital, for reference: {d.capital.name}. With the Yatra before: {d.editions.join(" and ")}.
                      </span>
                    </span>
                    <span aria-hidden="true" className="next-go" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="caption mt-8 max-w-[34rem]">
            Short introductions are general reference notes compiled for this site, not GGY sources. Capitals are marked as geographic reference points; they are not confirmed stops.
          </p>
        </div>
      </section>
    </Page>
  );
}
