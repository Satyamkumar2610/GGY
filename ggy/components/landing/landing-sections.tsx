import Image from "next/image";
import { atlas } from "@/lib/atlas";
import { Mail, MapPin, Phone } from "lucide-react";
import { about, components, photos } from "@/content/ggy";
import { contact27 } from "@/content/ggy27";

const field = components.find((c) => c.name === "Field Visit")!;
const policy = components.find((c) => c.name === "Interaction with Policy Architects")!;
const cases = components.find((c) => c.name === "Case Studies")!;

/** Crimson band between the opening and the field: the outline of India draws itself in. */
export function GroundBand() {
  return (
    <section className="lp-band on-dark" data-nav="light" aria-labelledby="lp-band-title">
      <div className="lp-band__inner">
        <h2 id="lp-band-title" className="lp-band__title" data-split>
          <span>Governance,</span>
          <span>
            <em>on the ground</em>
          </span>
        </h2>
        <p className="lp-band__claim" data-rise>
          {about.claim}.
        </p>
        <ul className="lp-band__words" aria-label="The Yatra in four words">
          {about.tagline.map((w) => (
            <li key={w} data-pop className="lp-chip lp-chip--dark">
              {w}
            </li>
          ))}
        </ul>
      </div>
      <svg className="lp-band__map" viewBox={`${atlas.outlineBounds[0]} ${atlas.outlineBounds[1]} ${atlas.outlineBounds[2] - atlas.outlineBounds[0]} ${atlas.outlineBounds[3] - atlas.outlineBounds[1]}`} aria-hidden="true">
        {atlas.states.map((s) => (
          <path key={s.iso} d={s.d} data-lp-draw className={s.focus ? "is-focus" : undefined} pathLength={1} />
        ))}
      </svg>
    </section>
  );
}

/** Two tall photographs, stepped: the institutions, and the people who run them. */
export function FieldCards() {
  const cards = [
    { title: "The institutions", text: field.text, photo: photos.lectureHall, href: "#journey" },
    { title: "The people", text: `${policy.text} ${cases.text}`, photo: photos.openLandscape, href: "#people" },
  ];
  return (
    <section className="lp-field" data-nav="dark" aria-labelledby="lp-field-title">
      <header className="lp-field__head">
        <h2 id="lp-field-title" className="lp-h2" data-split>
          <span>The field is</span>
          <span>
            the <em>classroom</em>
          </span>
        </h2>
        <p data-rise>Delegates leave the lecture hall for the places where policy is carried out, and meet the people carrying it out.</p>
      </header>
      <div className="lp-field__grid">
        {cards.map((c, i) => (
          <article key={c.title} className={`lp-tile${i === 1 ? " is-step" : ""}`} data-tile>
            <div className="lp-tile__img" data-lp-parallax>
              <Image src={c.photo.src} alt={c.photo.alt} fill sizes="(min-width: 768px) 48vw, 100vw" quality={82} className="object-cover" />
            </div>
            {/* Heading first, then the text, then the action: the pill used to
                lead and the eye met a bare "Explore" before learning what for. */}
            <div className="lp-tile__foot">
              <div className="lp-tile__line">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
              <a href={c.href} className="lp-pill lp-pill--glass" aria-label={`Explore ${c.title.toLowerCase()}`}>
                Explore
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Come and see: the photograph opens from a rounded window to full bleed and
 * the invitation rises over it. Admissions and contact follow directly.
 */
export function ComeAndSee() {
  const p = photos.cohort;
  return (
    <section className="lp-connect on-dark" data-nav="light" aria-labelledby="lp-connect-title">
      <div className="lp-connect__sticky">
        <div className="lp-connect__window" data-window>
          <Image src={p.src} alt={p.alt} fill sizes="100vw" quality={82} className="object-cover" data-window-img />
          <div className="lp-connect__tint" />
        </div>
      </div>
      <div className="lp-connect__inner">
        <h2 id="lp-connect-title" className="lp-connect__title" data-split>
          <span>Come and see</span>
          <span className="is-r">how India</span>
          <span>
            is <em>governed</em>,
          </span>
          <span className="is-r">state by state</span>
        </h2>
        <a href="#connect" className="lp-pill lp-pill--solid lp-connect__go" data-rise>
          Admissions and contact
        </a>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { href: "#yatra", label: "The Yatra" },
  { href: "#visits", label: "Key Visits" },
  { href: "#programme", label: "Programme" },
  { href: "#journey", label: "Journey" },
  { href: "#alumni", label: "Alumni" },
  { href: "#archive", label: "Past Editions" },
  { href: "#questions", label: "FAQs" },
  { href: "#connect", label: "Apply" },
];

/**
 * The footer, on cream: the Rashtram School of Public Leadership logo and the
 * edition's name; how to write, call and visit; the contents and the
 * copyright on a second line; the edition's name set very large and faint
 * behind it all.
 */
export function LandingFooter() {
  const c = contact27;
  return (
    <footer id="notes" className="lp-footer" data-nav="dark" aria-label="Contact and contents">
      <div className="lp-footer__top">
        <div className="lp-footer__brand">
          <a href="#top" aria-label="Rashtram School of Public Leadership, Rishihood University: back to top">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized logo */}
            <img src="/images/ggy27/brand/rashtram-color.png" alt="" width={900} height={271} className="lp-footer__logo" />
          </a>
          <p className="lp-footer__edition">Good Governance Yatra’ 27</p>
        </div>
        <dl className="lp-footer__contact">
          <div>
            <dt>Write to us</dt>
            <dd>
              <Mail aria-hidden="true" strokeWidth={1.6} />
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </dd>
          </div>
          <div>
            <dt>Call us</dt>
            <dd>
              <Phone aria-hidden="true" strokeWidth={1.6} />
              <span>
                <a href={c.phoneHref}>{c.phoneDisplay}</a>
                <small>{c.phoneName}</small>
              </span>
            </dd>
          </div>
          <div>
            <dt>Visit us</dt>
            <dd>
              <MapPin aria-hidden="true" strokeWidth={1.6} />
              <span>{c.address}</span>
            </dd>
          </div>
        </dl>
      </div>
      <div className="lp-footer__base">
        <nav className="lp-footer__nav" aria-label="Contents">
          {FOOTER_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="lp-footer__copy">{c.copyright}</p>
      </div>
      <p className="lp-footer__mark" aria-hidden="true">
        Good Governance Yatra’ 27
      </p>
    </footer>
  );
}
