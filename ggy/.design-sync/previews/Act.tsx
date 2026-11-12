import "./_still";
import { Act } from "ggy";

/**
 * A chapter opening. On the page it is a scrubbed zoom through five prints;
 * as a still it is the first photograph at full bleed with the title on it.
 */
export const ChapterOpening = () => (
  <Act
    id="act-how"
    n="II"
    photos={["lectureHall", "fieldGroup", "overhead", "legislatureSteps", "address"]}
    title="How the days are spent"
    dek="Four stages of learning, and the field visits, workshops and conversations that make up the programme."
  />
);

export const WesternCoast = () => (
  <Act
    id="act-where"
    n="I"
    photos={["highCourt", "sabarmati", "bomJesus", "municipalCorporation", "oldSecretariat"]}
    title="Along the western coast"
    dek="Gujarat, Maharashtra and Goa: the three states of the upcoming edition."
  />
);
