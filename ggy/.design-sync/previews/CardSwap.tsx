import "./_still";
import { CardSwap, Card, photos } from "ggy";

const deck = [
  { key: "fieldGroup", label: "Field visits" },
  { key: "lectureHall", label: "Sessions" },
  { key: "legislatureSteps", label: "Institutions" },
  { key: "address", label: "Conversations" },
] as const;

const label = {
  position: "absolute" as const,
  left: "1.25rem",
  bottom: "1.1rem",
  color: "#fff",
  fontFamily: "var(--f-display)",
  fontSize: "1.5rem",
  fontWeight: 600,
  textShadow: "0 2px 18px rgb(46 6 18 / 0.6)",
};

/** A deck of photographs that swaps on a timer or a drag, as the programme section uses it. */
export const PhotoDeck = () => (
  <div style={{ position: "relative", height: 560, display: "grid", placeItems: "center", background: "var(--c-paper)" }}>
    <div style={{ position: "relative", width: 540, height: 400 }}>
      <CardSwap theme="light" width={540} height={400} cardDistance={54} verticalDistance={58} skewAmount={4} visibleCards={4} cardRadius={22} autoplay={false} intro={false} ariaLabel="The parts of the programme, as photographs">
        {deck.map((d) => (
          <Card key={d.key} style={{ overflow: "hidden" }}>
            <img src={photos[d.key].src} alt={photos[d.key].alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={label}>{d.label}</span>
          </Card>
        ))}
      </CardSwap>
    </div>
  </div>
);
