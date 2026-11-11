"use client";

import { useState } from "react";
import DepthCarousel from "../DepthCarousel";
import { photos, type PhotoKey } from "@/content/ggy";
import { optimized } from "@/lib/image-url";
import { Title } from "./head";

/** Photographs of the three states, north to south. Reference only: none is a confirmed stop. */
const PLACES: { key: PhotoKey; state: string }[] = [
  { key: "sabarmati", state: "Gujarat" },
  { key: "gateway", state: "Maharashtra" },
  { key: "highCourt", state: "Maharashtra" },
  { key: "municipalCorporation", state: "Maharashtra" },
  { key: "oldSecretariat", state: "Goa" },
  { key: "bomJesus", state: "Goa" },
];

const items = PLACES.map(({ key }) => ({ image: optimized(photos[key].src, 1080), alt: photos[key].alt }));

/**
 * The three states in photographs, stacked in depth: drag, use the arrow
 * keys or select a photograph behind to bring it forward. The one in front
 * is named beside the stack with its credit and licence.
 */
export function Places() {
  const [i, setI] = useState(0);
  const { key, state } = PLACES[i];
  const p = photos[key];
  return (
    <div className="j-places">
      <Title as="h3" sub title="The three states," em="for reference" />
      <div className="j-places__grid">
        <div className="j-places__stage" data-cursor="Drag">
          <DepthCarousel
            items={items}
            ariaLabel="Photographs of Gujarat, Maharashtra and Goa"
            cardWidth={540}
            cardHeight={360}
            radius={4}
            tint="#5c1026"
            depth={200}
            spread={120}
            tilt={16}
            tiltDirection="right"
            perspective={1500}
            visibleCards={4}
            falloff={0.18}
            blur={3}
            duration={800}
            ease="expo.out"
            loop
            wheel={false}
            showIndicators={false}
            onChange={(n: number) => setI(n)}
          />
        </div>
        <div className="j-places__note" aria-live="polite">
          <p className="j-places__count">
            {i + 1}
            <span>of {PLACES.length}</span>
          </p>
          <p className="j-places__state">{state}</p>
          <p className="j-places__caption">{p.caption}</p>
          <p className="j-meta">
            {p.credit}{" "}
            {p.license ? (
              <a className="tlink tlink-static" href={p.license.url} target="_blank" rel="noreferrer">
                {p.license.name}
              </a>
            ) : null}
          </p>
          <p className="j-meta j-places__ref">Places in the three states, for reference. None of them is a confirmed stop.</p>
        </div>
      </div>
    </div>
  );
}
