import { HoloCard, SEAL } from "ggy";

/** The foil seal on the pass stub: round, star foil, marigold tint. The site uses HoloCard only for this seal. */
export const FoilSeal = () => (
  <div style={{ padding: "3rem", display: "grid", placeItems: "center", background: "#fff" }}>
    <HoloCard image={SEAL} alt="Foil seal of the Good Governance Yatra" preset="stars" width={160} radius={80} intensity={0.7} edgeSparkle={0.5} frame={0} glare={0.45} foilColor="#f1cf8f" tiltMax={18} />
  </div>
);

/** Smaller, on deep crimson, as it sits on the pass stub. */
export const OnDeepCrimson = () => (
  <div style={{ padding: "3rem", display: "grid", placeItems: "center", background: "var(--c-deep)" }}>
    <HoloCard image={SEAL} alt="Foil seal of the Good Governance Yatra" preset="stars" width={112} radius={56} intensity={0.7} edgeSparkle={0.5} frame={0} glare={0.45} foilColor="#f1cf8f" tiltMax={18} />
  </div>
);
