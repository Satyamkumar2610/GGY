"use client";

import { useId, useState } from "react";
import { ArrowUpRight, MessageCircleQuestion, Plus } from "lucide-react";
import { faqs } from "@/content/ggy";
import { contact27 } from "@/content/ggy27";
import { Star, Title } from "./head";

/**
 * FAQs, centred on the page: the title over a single column of questions,
 * each opening downward to its answer. Answers use only the 2025 brochure and
 * the confirmed route until the GGY team supplies new ones.
 */
export function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="questions" className="j-sec j-paper x-faqc" data-nav="dark" data-j-station="questions" data-arch aria-labelledby="questions-title">
      <div className="j-wrap">
        <header className="x-faqc__head">
          <Star />
          <Title id="questions-title" title="Frequently asked" em="questions" />
          <p className="x-faqc__note">Answers use only the 2025 brochure and the confirmed route.</p>
        </header>

        <ul className="x-faqc__list">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="x-faqc__item" data-open={on ? "" : undefined}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`${id}-${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span className="x-faqc__q">{f.q}</span>
                    <Plus className="x-faqc__icon" aria-hidden="true" strokeWidth={1.8} />
                  </button>
                </h3>
                <div id={`${id}-${i}`} className="x-faqc__a" inert={!on}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <a className="x-faqc__ask" href={`mailto:${contact27.email}`}>
          <MessageCircleQuestion aria-hidden="true" strokeWidth={1.6} />
          <span>
            <strong>Still curious?</strong> Write to the GGY team at {contact27.email}
          </span>
          <ArrowUpRight aria-hidden="true" strokeWidth={1.6} />
        </a>
      </div>
    </section>
  );
}
