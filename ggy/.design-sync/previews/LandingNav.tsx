import { LandingNav, photos } from "ggy";

/** The fixed top bar over the opening photograph: wordmark, chapter links, menu. */
export const OverAPhotograph = () => (
  <div style={{ position: "relative", height: 260, overflow: "hidden" }} data-nav="dark">
    <img src={photos.highCourt.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <LandingNav />
  </div>
);
