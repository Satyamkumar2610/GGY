"use client";

import Link from "next/link";
import { useJournal } from "@/lib/journal";

const SLOTS = ["IN-GJ", "IN-GA", "IN-MH"] as const;
const NAMES = { "IN-GJ": "Gujarat", "IN-GA": "Goa", "IN-MH": "Maharashtra" } as const;

/**
 * Three small squares in the masthead: one per state, filled as the visitor
 * stamps their journal. A link to the journal page.
 */
export function JournalMark({ onNavigate }: { onNavigate?: () => void }) {
  const { stamped } = useJournal();
  const n = stamped.length;
  return (
    <Link href="/journal" onClick={onNavigate} className="journal-mark" aria-label={`Your field journal: ${n} of 3 states stamped`}>
      <span aria-hidden="true" className="journal-mark-slots">
        {SLOTS.map((iso) => (
          <span key={iso} className={stamped.includes(iso) ? "is-on" : ""} title={NAMES[iso]} />
        ))}
      </span>
      <span className="journal-mark-label">Journal</span>
    </Link>
  );
}
