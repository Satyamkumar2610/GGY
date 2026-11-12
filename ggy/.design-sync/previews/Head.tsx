import { Head } from "ggy";

/** The section head on a paper chapter: star and drawn rule, title left, note right. */
export const OnPaper = () => (
  <section className="j-sec j-paper" style={{ paddingBlock: "4rem" }}>
    <div className="j-wrap">
      <Head id="preview-programme" title="Six parts of the programme" em="as run in 2025">
        <p>A nine-day immersion that moves between the field, the lecture hall and the people who run the institutions.</p>
      </Head>
    </div>
  </section>
);

/** The same head on the cream alternate ground. */
export const OnCream = () => (
  <section className="j-sec j-cream" style={{ paddingBlock: "4rem" }}>
    <div className="j-wrap">
      <Head id="preview-editions" title="So far, only the route" em="is confirmed">
        <p>The dates, the stops, the order of travel and the size of the cohort will be announced with the programme.</p>
      </Head>
    </div>
  </section>
);

/** On the deep crimson ground: wrap in `on-dark`, the title turns ivory. */
export const OnDeepCrimson = () => (
  <section className="j-sec j-deep on-dark" style={{ paddingBlock: "4rem" }}>
    <div className="j-wrap">
      <Head id="preview-after" title="Where alumni" em="went next">
        <p>Delegates from past editions now work across public service, the private sector, research and social impact.</p>
      </Head>
    </div>
  </section>
);
