import "./_still";
import { Readiness } from "ggy";

/** Lives inside Joining, on the deep crimson ground (j-deep on-dark on-crimson). */
export const AreYouReady = () => (
  <section className="j-sec j-deep on-dark on-crimson" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div className="j-ready">
        <Readiness />
      </div>
    </div>
  </section>
);
