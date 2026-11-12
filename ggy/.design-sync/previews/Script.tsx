import { Script } from "ggy";

const name = { fontSize: "2.6rem", lineHeight: 1.1, color: "var(--c-crimson)" };

/** Each state's name in its own script (Anek Gujarati / Anek Devanagari), beside the English. */
export const ThreeStates = () => (
  <div className="j-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", paddingBlock: "2.5rem" }}>
    {[
      { en: "Gujarat", lang: "gu", own: "ગુજરાત" },
      { en: "Maharashtra", lang: "mr", own: "महाराष्ट्र" },
      { en: "Goa", lang: "kok", own: "गोंय" },
    ].map((s) => (
      <div key={s.en}>
        <Script lang={s.lang} className="block">
          <span style={name}>{s.own}</span>
        </Script>
        <p className="j-meta" style={{ marginTop: "0.5rem" }}>
          {s.en}
        </p>
      </div>
    ))}
  </div>
);
