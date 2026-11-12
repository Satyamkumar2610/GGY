import "./_still";
import { IdeaPanels } from "ggy";

/** Lives inside Field, on the paper ground (j-paper). */
export const TheIdea = () => (
  <section className="j-sec j-paper" style={{ paddingBlock: "3.5rem" }}>
    <div className="j-wrap">
      <div>
        <IdeaPanels />
      </div>
    </div>
  </section>
);
