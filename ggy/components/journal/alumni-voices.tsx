"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { alumniVideos } from "@/content/ggy27";
import { Head } from "./head";

/**
 * Hear from our GGY Alumni: nine short films from past delegates on a belt
 * that slides past on its own, endlessly (the row is printed twice and moved
 * by one CSS transform, so it costs nothing per frame). It slows to a stop
 * under the pointer or keyboard focus, and stands still while a film plays.
 * Pressing a card swaps in the player (youtube-nocookie.com), so nothing from
 * YouTube loads until it is asked for.
 */
export function AlumniVoices() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="alumni" className="j-sec j-deep on-dark x-voices" data-nav="light" data-j-station="alumni" data-arch aria-labelledby="alumni-title">
      <div className="j-wrap">
        <Head id="alumni-title" title="Hear from" em="our GGY alumni">
          <p>Delegates of past editions on what the Yatra changed for them.</p>
        </Head>
      </div>

      <div className="x-voices__viewport" data-playing={playing ? "" : undefined}>
        <div className="x-voices__belt">
          {[0, 1].map((copy) => (
            <ul key={copy} className="x-voices__row" aria-hidden={copy === 1 ? true : undefined} aria-label={copy === 0 ? "Films from GGY alumni" : undefined}>
              {alumniVideos.map((v) => {
                const key = `${copy}-${v.id}`;
                const on = playing === key;
                return (
                  <li key={key} className="x-voices__card">
                    <div className="x-voices__media">
                      {on ? (
                        <>
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                            title={v.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          <button type="button" className="x-voices__close" onClick={() => setPlaying(null)} aria-label="Close the film">
                            <X aria-hidden="true" strokeWidth={1.8} />
                          </button>
                        </>
                      ) : (
                        <button type="button" className="x-voices__play" onClick={() => setPlaying(key)} aria-label={`Play: ${v.title}`} tabIndex={copy === 1 ? -1 : undefined}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail, loaded lazily */}
                          <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" draggable={false} />
                          <span className="x-voices__icon" aria-hidden="true">
                            <Play strokeWidth={1.6} />
                          </span>
                        </button>
                      )}
                    </div>
                    <p className="x-voices__name">{v.name}</p>
                    <p className="x-voices__year">GGY {v.year} alum</p>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
