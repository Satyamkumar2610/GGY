import { Head } from "./head";
import { ProposedPlan } from "./proposed-plan";


/**
 * What is confirmed: the route, and nothing else yet. The one concrete
 * glimpse of the next edition is the plan proposed for Maharashtra, marked
 * tentative throughout.
 */
export function Coda() {
  return (
    <section id="editions" className="j-sec j-cream" data-nav="dark" data-j-station="editions" data-arch aria-labelledby="editions-title">
      <div className="j-wrap">
        <Head id="editions-title" title="So far, only the route" em="is confirmed">
          <p>The dates, the stops, the order of travel and the size of the cohort will be announced with the programme.</p>
        </Head>

        <ProposedPlan />
      </div>
    </section>
  );
}
