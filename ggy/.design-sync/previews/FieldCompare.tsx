import "./_still";
import { FieldCompare } from "ggy";

/** Lives inside Field, on the paper ground (j-paper). */
export const HallAndField = () => (
  <section className="j-sec j-paper" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div>
        <FieldCompare />
      </div>
    </div>
  </section>
);
