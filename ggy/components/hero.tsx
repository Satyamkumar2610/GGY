import Image from "next/image";
import { photos, upcoming } from "@/content/ggy";
import { Button, Script } from "./primitives";
import { HeroMotion } from "./motion/hero-motion";

const SLATS = 6;

/** One photograph cut into seamless vertical strips; at rest it reads as a single image. */
function Slats() {
  const focal = photos.highCourt;
  return (
    <div className="hero-slats" data-hero-slats>
      {Array.from({ length: SLATS }, (_, i) => (
        <div key={i} className="hero-slat" style={{ left: `${(100 / SLATS) * i}%`, width: `${100 / SLATS}%` }} data-slat>
          <div className="hero-slat-inner" style={{ width: `${SLATS * 100}%`, left: `${-i * 100}%` }} data-slat-inner>
            <Image
              src={focal.src}
              alt={i === 0 ? focal.alt : ""}
              aria-hidden={i === 0 ? undefined : true}
              fill
              preload={i === 0}
              loading="eager"
              quality={82}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "56% 40%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** A photographic print that drops onto the page during the opening sequence. */
function Print({ name, lang, native, photoKey, className }: { name: string; lang: string; native: string; photoKey: "municipalCorporation" | "oldSecretariat" | "sabarmati" | null; className: string }) {
  const p = photoKey ? photos[photoKey] : null;
  return (
    <figure className={`hero-print ${className}`} data-print>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {p ? (
          <Image src={p.src} alt={p.alt} fill quality={80} sizes="18vw" className="object-cover" />
        ) : (
          <div className="plate absolute inset-0" role="img" aria-label={`Placeholder: an approved photograph of ${name} is still to be supplied.`}>
            <div aria-hidden="true" className="flex flex-col items-center gap-2 text-center">
              <Script lang={lang} className="text-[2.6rem] leading-none text-crimson">
                {native}
              </Script>
              <span className="text-[0.68rem] text-muted">Photograph to be supplied</span>
            </div>
          </div>
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-2 pt-2.5">
        <span className="text-[0.75rem] font-medium">{name}</span>
        <Script lang={lang} className="text-[0.8rem] text-crimson">
          {native}
        </Script>
      </figcaption>
    </figure>
  );
}

/**
 * The opening. A full-bleed photograph carries the title: it resolves out of
 * darkness on a canvas that can displace it, then hands back to the strips.
 * On large screens, scrolling gathers those strips into a contact sheet which
 * tumbles away; the three states of the upcoming edition are set on the page
 * beneath, and their photographs drop in like prints on a desk.
 */
export function Hero() {
  const focal = photos.highCourt;
  const [maharashtra, goa, gujarat] = upcoming.states;
  return (
    <section id="top" aria-labelledby="hero-title" className="hero" data-hero>
      {/* The page beneath the photograph (large screens with motion) */}
      <div className="hero-paper" data-hero-paper>
        {/* Kept clear of the prints at either side. */}
        <div className="absolute left-1/2 top-1/2 w-[min(56rem,60%)] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="label text-saffron" data-paper-line>
            The upcoming edition
          </p>
          <ol className="hero-route mt-7">
            {[maharashtra, goa, gujarat].map((s) => (
              <li key={s.name} className="overflow-hidden pb-[0.06em]">
                <span className="hero-route-stop" data-paper-line>
                  {s.name}
                  <Script lang={s.lang} className="hero-route-native">
                    {s.native}
                  </Script>
                </span>
              </li>
            ))}
          </ol>
          {/* The road the three states sit on. */}
          <div aria-hidden="true" className="hero-route-road" data-paper-road>
            <span />
            <span />
            <span />
          </div>
          <p className="mx-auto mt-7 max-w-[26rem] text-[0.95rem] text-ink-soft" data-paper-line>
            Dates, stops and the order of travel are still to be announced.
          </p>
        </div>
        <Print name={goa.name} lang={goa.lang} native={goa.native} photoKey="oldSecretariat" className="left-[7%] top-[18%] w-[16vw] -rotate-6" />
        <Print name={maharashtra.name} lang={maharashtra.lang} native={maharashtra.native} photoKey="municipalCorporation" className="right-[8%] top-[14%] w-[17vw] rotate-[5deg]" />
        <Print name={gujarat.name} lang={gujarat.lang} native={gujarat.native} photoKey="sabarmati" className="bottom-[8%] right-[17%] w-[14vw] -rotate-3" />
      </div>

      <Slats />
      {/* The opening draws the same photograph here so it can be displaced. */}
      <canvas aria-hidden="true" className="hero-gl" data-hero-gl />
      <div aria-hidden="true" className="hero-bloom" data-hero-bloom />
      <div aria-hidden="true" className="hero-shade" data-hero-shade />
      <div aria-hidden="true" className="hero-grain" data-hero-grain />

      {/* Title and essentials */}
      <div className="hero-content on-photo" data-hero-content>
        <div className="page pb-[clamp(1.75rem,5vh,3.25rem)]" data-hero-type>
          <p className="label text-ivory/90" data-intro data-hero-label>
            The upcoming edition travels through Maharashtra, Goa and Gujarat.
          </p>
          <h1 id="hero-title" className="d-xl mt-6 max-w-[11ch] lg:max-w-none" data-intro data-hero-title>
            Good Governance Yatra
          </h1>
          <div className="mt-8 grid items-end gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
            <div className="lg:col-span-5">
              <p className="lede max-w-[30rem] text-ivory/90" data-intro data-hero-lede>
                An immersive yatra into governance and leadership. Its dates, stops and applications are still to be announced.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3" data-intro data-hero-links>
                <Button href="#route">See the route</Button>
                <Button href="#editions" variant="ghost">
                  What is confirmed so far
                </Button>
              </div>
            </div>
            <p className="meta hidden text-right text-[0.7rem] text-ivory/75 lg:col-span-4 lg:col-start-9 lg:block" data-intro data-hero-caption>
              {focal.caption}. Photograph by A.Savin, Wikimedia Commons, Free Art License.
            </p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="scroll-cue absolute bottom-0 left-1/2 z-[7] hidden h-14 w-px text-ivory/70 lg:block" data-intro data-hero-cue />
      <span aria-hidden="true" data-hero-edge className="pointer-events-none absolute bottom-0 left-0 h-px w-px" />
      <HeroMotion />
    </section>
  );
}
