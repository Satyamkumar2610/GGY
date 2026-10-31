import Image from "next/image";
import { Contours } from "./contours";
import { components, photos, takeaways } from "@/content/ggy";
import { NoteRef } from "./primitives";

/**
 * Section 05: the programme experience, as described for 2025. The six
 * components are set as an index beside a photograph from the field; what
 * delegates took away follows as a ruled list. Where the brochure gives no
 * description, the entry says so instead of inventing one.
 */
export function ProgrammeChapter() {
  const field = photos.fieldGroup;
  const hall = photos.address;
  return (
    <section id="programme" aria-labelledby="programme-title" className="programme">
      <Contours variant="b" />
      <div className="page">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-7">
            <p className="kicker">
              <span className="num">05</span> The programme experience
            </p>
            <h2 id="programme-title" className="d-l mt-6" data-drift>
              Six parts of the programme, <em>as run in 2025.</em>
            </h2>
          </div>
          <p className="max-w-[24rem] text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
            The components of the 2025 programme, as the brochure describes them. The programme for the upcoming edition will be confirmed with its dates.
          </p>
        </div>

        <div className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="media relative aspect-[4/5]" data-reveal data-parallax>
                <div className="absolute inset-[-8%_0]" data-parallax-media>
                  <Image src={field.src} alt={field.alt} fill quality={80} sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
                </div>
              </div>
              <p className="caption mt-3">{field.caption} Photograph from the GGY brochure.</p>
            </div>
          </div>
          <ol className="programme-index lg:col-span-6 lg:col-start-7">
            {components.map((c, i) => (
              <li key={c.name} className="programme-row" data-row>
                <span className="programme-num num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="programme-name">{c.name}</h3>
                  <p className="mt-2 max-w-[28rem] text-[0.98rem] text-ink-soft">
                    {c.text ?? <span className="tba">Description awaiting confirmation</span>}
                    {c.note ? <NoteRef id={c.note} /> : null}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[clamp(6rem,12vw,10rem)] grid gap-10 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-4">
            <h3 className="d-m">
              What delegates <em>took away</em>
            </h3>
            <p className="caption mt-4 max-w-[18rem]">As listed in the 2025 brochure, which also offered delegates a certificate of appreciation.</p>
            <figure className="mt-8 hidden lg:block">
              <div className="media relative aspect-[5/3]" data-reveal>
                <Image src={hall.src} alt={hall.alt} fill quality={80} sizes="30vw" className="object-cover" />
              </div>
              <figcaption className="caption mt-2">{hall.caption} Photograph from the GGY brochure.</figcaption>
            </figure>
          </div>
          <ul className="programme-takeaways lg:col-span-7 lg:col-start-6">
            {takeaways.map((t) => (
              <li key={t.name} data-row>
                <p className="font-display text-[1.45rem] leading-tight">{t.name}</p>
                <p className="mt-2.5 text-[0.95rem] text-ink-soft">
                  {t.text}
                  {t.note ? <NoteRef id={t.note} /> : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
