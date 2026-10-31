import { contact, previousEdition } from "@/content/ggy";
import { navItems } from "./nav-items";
import { Button } from "./primitives";
import { FooterMotion } from "./motion/footer-motion";

/**
 * The last page. Contents, contact and the organiser, above the full name of the Yatra, which rises into place as the reader
 * reaches the end.
 */
export function Colophon() {
  return (
    <footer id="notes" aria-label="Contents and contact" className="on-dark on-ember ground gloss" data-footer>
      <div className="page pt-[clamp(5rem,10vw,8rem)]">
        <div className="grid gap-12 pb-14 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-4">
            <p className="label text-dim">Contents</p>
            <ul className="mt-5 space-y-1">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="group flex items-baseline gap-4 py-1 font-display text-[1.6rem] font-medium tracking-[-0.02em] no-underline">
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
      </div>

      <p aria-hidden="true" className="footer-mark" data-footer-mark>
        <span>Good Governance Yatra</span>
      </p>
      <div className="pb-6" />
      <FooterMotion />
    </footer>
  );
}
