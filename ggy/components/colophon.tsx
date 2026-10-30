import { BROCHURE, contact, pendingNotes, photos, previousEdition } from "@/content/ggy";
import { navItems } from "./nav-items";
import { Button } from "./primitives";
import { FooterMotion } from "./motion/footer-motion";

/**
 * The last page. Contents, contact, and the notes and credits set small,
 * above the full name of the Yatra, which rises into place as the reader
 * reaches the end.
 */
export function Colophon() {
  const external = Object.values(photos).filter((p) => p.source !== "ggy-brochure");
  return (
    <footer id="notes" aria-labelledby="notes-title" className="on-dark on-ember ground sheet gloss" data-footer>
      <div className="page pt-[clamp(5rem,10vw,8rem)]">
        <div className="grid gap-12 border-b border-hair-ember pb-14 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-4">
            <p className="label text-dim">Contents</p>
            <ul className="mt-5 space-y-1">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="group flex items-baseline gap-4 py-1 font-display text-[1.6rem] font-light no-underline">
                    <span className="transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-2">{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="label text-dim">Write to the team</p>
            <p className="mt-5">
              <a href={`mailto:${contact.email}`} className="tlink tlink-static font-display text-[1.4rem]">{contact.email}</a>
            </p>
            <p className="mt-2">
              <a href={contact.phoneHref} className="tlink tlink-static font-display text-[1.4rem]">{contact.phoneDisplay}</a>
            </p>
            <p className="caption mt-4">As printed in the 2025 brochure. Contact details for the upcoming edition are to be confirmed.</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label text-dim">Credits</p>
            <p className="caption mt-5">
              Printed for the {previousEdition.label}: organised by {previousEdition.organisedBy}; the brochure cover reads “An initiative by {previousEdition.initiativeOf}”. The organiser of the upcoming edition is to be confirmed.
            </p>
            <Button href="#top" variant="ghost" className="mt-7">
              Back to the beginning
            </Button>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-6">
            <h2 id="notes-title" className="label text-dim">Notes on sources</h2>
            <p className="caption mt-3">Historical content is drawn from the {BROCHURE}. Marked figures (†) are awaiting confirmation.</p>
            <ol className="mt-5 space-y-2.5">
              {Object.entries(pendingNotes).map(([id, text]) => (
                <li key={id} id={`note-${id}`} className="flex gap-3 text-[0.82rem] text-dim">
                  <span aria-hidden="true" className="text-crimson-on-ink">†</span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="label text-dim">Image credits</h3>
            <ul className="mt-5 space-y-2.5 text-[0.82rem] text-dim">
              {external.map((p) => (
                <li key={p.src}>
                  <span className="text-ivory">{p.caption}.</span> {p.credit}{" "}
                  {p.license ? (
                    <a className="tlink tlink-static" href={p.license.url} rel="license noopener" target="_blank">{p.license.name}</a>
                  ) : null}
                  {p.sourceUrl ? (
                    <>
                      {", "}
                      <a className="tlink tlink-static" href={p.sourceUrl} rel="noopener" target="_blank">Source</a>
                    </>
                  ) : null}
                </li>
              ))}
              <li><span className="text-ivory">Delegates, sessions and the flag-off.</span> From the {BROCHURE}; photographers are not credited.</li>
              <li><span className="text-ivory">Map.</span> State boundaries from Natural Earth, public domain, simplified.</li>
            </ul>
          </div>
        </div>
      </div>

      <p aria-hidden="true" className="footer-mark" data-footer-mark>
        <span>Good Governance Yatra</span>
      </p>
      <p className="page meta flex justify-between pb-6 text-[0.7rem] text-dim">
        <span>Review draft</span>
        <span>The field journal</span>
      </p>
      <FooterMotion />
    </footer>
  );
}
