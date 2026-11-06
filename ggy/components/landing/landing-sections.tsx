import Image from "next/image";
import { atlas } from "@/lib/atlas";
import { about, components, contact, photos, previousEdition } from "@/content/ggy";

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
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M13.5 7.06 7.06 13.5 6 12.44 12.44 6H6.76V4.5H15v8.24h-1.5z" fill="currentColor" />
                </svg>
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
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13.5 7.06 7.06 13.5 6 12.44 12.44 6H6.76V4.5H15v8.24h-1.5z" fill="currentColor" />
          </svg>
        </a>
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { href: "#yatra", label: "The Yatra" },
  { href: "#journey", label: "The journey" },
  { href: "#idea", label: "The idea" },
  { href: "#programme", label: "Programme" },
  { href: "#archive", label: "Archive" },
  { href: "#people", label: "People" },
  { href: "#questions", label: "Questions" },
  { href: "#connect", label: "Admissions" },
];

export function LandingFooter() {
  const word = "Good Governance Yatra";
  return (
    <footer id="notes" className="lp-footer on-dark" data-nav="light" aria-label="Contents and contact">
      <div className="lp-footer__grid">
        <div>
          <p className="lp-footer__label">Contents</p>
          {FOOTER_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <p className="lp-footer__label">Contact</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <p className="lp-footer__fine">As printed in the 2025 brochure. Contact details for the upcoming edition are to be confirmed.</p>
        </div>
        <div>
          <p className="lp-footer__label">Address</p>
          <p>{contact.address}</p>
        </div>
        <div className="lp-footer__org">
          <p>
            Printed for the {previousEdition.label}: organised by {previousEdition.organisedBy}; the brochure cover reads “An initiative by {previousEdition.initiativeOf}”.
          </p>
          <p>The organiser of the upcoming edition is to be confirmed.</p>
          <a href="#top" className="lp-pill lp-pill--glass">
            Back to top
          </a>
        </div>
      </div>
      <p className="lp-footer__mark" aria-label={word} data-mark>
        {word.split("").map((ch, i) => (
          <span key={i} aria-hidden="true">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
      <div className="lp-footer__base">
        <span>© Good Governance Yatra</span>
        <span>Photographs: GGY brochure, Wikimedia Commons, Unsplash</span>
      </div>
    </footer>
  );
}
