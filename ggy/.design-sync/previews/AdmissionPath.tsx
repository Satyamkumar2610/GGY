import "./_still";
import { AdmissionPath } from "ggy";

/** Lives inside Joining, on the deep crimson ground (j-deep on-dark on-crimson); its cards are styled for that ground. */
export const AdmissionProcess = () => (
  <section className="j-sec j-deep on-dark on-crimson" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div className="j-process">
        <AdmissionPath />
      </div>
    </div>
  </section>
);
