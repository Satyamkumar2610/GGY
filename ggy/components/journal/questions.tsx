"use client";

import { useId, useState } from "react";
import { faqs } from "@/content/ggy";
import { Head } from "./head";

/** Ten questions, answered only from the 2025 brochure and the confirmed route. One answer is open at a time. */
export function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="questions" className="j-sec j-paper" data-nav="dark" data-j-station="questions" aria-labelledby="questions-title">
      <div className="j-wrap">
        <Head id="questions-title" title="Questions," em="answered">
          <p>Answers use only the 2025 brochure and the confirmed route.</p>
        </Head>
        <ul className="j-faq">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="j-faq__item" data-open={on ? "" : undefined}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`${id}-${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span>{f.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-${i}`} className="j-faq__a" inert={!on}>
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
