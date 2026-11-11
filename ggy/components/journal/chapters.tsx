import { CONCEPT_NOTE, proposedMaharashtra } from "@/content/ggy";
import { Head } from "./head";
import { Places } from "./places";


/**
 * What is confirmed: the route, and nothing else yet. The one concrete
 * glimpse of the next edition is the plan proposed for Maharashtra, set on a
 * dashed line because it is tentative.
 */
export function Coda() {
  return (
    <section id="editions" className="j-sec j-cream" data-nav="dark" data-j-station="editions" data-arch aria-labelledby="editions-title">
      <div className="j-wrap">
        <Head id="editions-title" title="So far, only the route" em="is confirmed">
          <p>The dates, the stops, the order of travel and the size of the cohort will be announced with the programme.</p>
        </Head>

        <div className="j-proposed" data-proposed>
          <div className="j-proposed__lead">
            <h3 className="j-h3">Proposed for Maharashtra</h3>
            <p className="j-meta">A plan for Mumbai and Nashik proposed in the {CONCEPT_NOTE}. Dates and visits are tentative and not yet confirmed.</p>
          </div>
          <div className="j-proposed__track">
            <i className="j-dash" data-dash aria-hidden="true" />
            <ol className="j-proposed__days">
            {proposedMaharashtra.map((d) => (
              <li key={d.date} data-proposed-day>
                <i className="j-node" aria-hidden="true" />
                <p className="j-date">{d.date}</p>
                <ul>
                  {d.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
            </ol>
          </div>
        </div>

        <Places />
      </div>
    </section>
  );
}
