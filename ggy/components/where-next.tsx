import Link from "next/link";

const ROWS = [
  { href: "/yatra", title: "The Yatra", text: "The idea, the four stages of learning, and the six parts of the programme as it ran in 2025." },
  { href: "/archive", title: "The archive", text: "Every route the Yatra has printed since 2015, a day-by-day record of 2025, and the photographs." },
  { href: "/people", title: "The people", text: "The leaders, officials and reformers delegates have met, and the institutions behind the Yatra." },
  { href: "/journal", title: "Your field journal", text: "Open a state to stamp it. Keep a question for the field, and take the page with you." },
] as const;

/** The home page's index of the other pages: type and a rule, nothing else. */
export function WhereNext() {
  return (
    <section id="next" aria-labelledby="next-title" className="bg-paper py-[clamp(6rem,12vw,10rem)]" data-thread="Pages">
      <div className="page">
        <h2 id="next-title" className="kicker">
          Read on
        </h2>
        <ul className="next-list mt-8">
          {ROWS.map((r) => (
            <li key={r.href} data-row>
              <Link href={r.href} className="next-row">
                <span className="next-title">{r.title}</span>
                <span className="next-text">{r.text}</span>
                <span aria-hidden="true" className="next-go" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
