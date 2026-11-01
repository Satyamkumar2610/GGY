"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { contact, learningJourney, stateDossiers, upcoming } from "@/content/ggy";
import { cardBlob, drawJournalCard, loadCardFonts } from "@/lib/journal-card";
import { clearJournal, setName, setQuestion, useJournal } from "@/lib/journal";
import { stateHref, nativeOf } from "@/lib/states";
import { Postmark } from "./postmark";
import { Script } from "./primitives";

const RING = {
  "IN-GJ": "GUJARAT ✦ GANDHINAGAR ✦ 23.22° N 72.64° E ✦ ",
  "IN-GA": "GOA ✦ PANAJI ✦ 15.49° N 73.83° E ✦ ",
  "IN-MH": "MAHARASHTRA ✦ MUMBAI ✦ 19.08° N 72.88° E ✦ ",
} as const;

/**
 * The visitor's field journal: three stamp slots, one name and one question,
 * and a page that can be saved as an image or sent to the team. It reads and
 * writes only this browser's localStorage. It is not a registration, and
 * nothing here is sent unless the visitor chooses to write an email.
 */
export function JournalBoard() {
  const j = useJournal();
  const canvas = useRef<HTMLCanvasElement>(null);
  const id = useId();
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");
  // Sharing exists only in some browsers; false on the server so the markup matches.
  const canShare = useSyncExternalStore(
    () => () => undefined,
    () => typeof navigator.share === "function" && typeof navigator.canShare === "function",
    () => false,
  );

  // Redraw the page when the journal changes; typing is given a moment to settle.
  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(async () => {
      await loadCardFonts();
      if (!cancelled && canvas.current) drawJournalCard(canvas.current, j);
    }, 160);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [j]);

  const say = (m: string) => {
    setNote(m);
    window.setTimeout(() => setNote(""), 4000);
  };

  const download = async () => {
    if (!canvas.current) return;
    await loadCardFonts();
    drawJournalCard(canvas.current, j);
    const blob = await cardBlob(canvas.current);
    if (!blob) return say("The page could not be saved. Try again.");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ggy-field-journal.png";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setSaved(true);
    say("Saved as ggy-field-journal.png.");
  };

  const share = async () => {
    if (!canvas.current) return;
    const blob = await cardBlob(canvas.current);
    if (!blob) return;
    const file = new File([blob], "ggy-field-journal.png", { type: "image/png" });
    try {
      if (navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: "My Good Governance Yatra field journal" });
      else await navigator.share({ title: "My Good Governance Yatra field journal", url: window.location.origin });
      setSaved(true);
    } catch {
      // The share sheet was closed. Nothing to report.
    }
  };

  const names = j.stamped.map((iso) => stateDossiers.find((d) => d.iso === iso)?.name).filter(Boolean) as string[];
  const mail = (() => {
    const lines = ["Hello GGY team,", "", "I am interested in the upcoming Good Governance Yatra (Maharashtra, Goa and Gujarat)."];
    if (names.length) lines.push(`I have been reading about: ${names.join(", ")}.`);
    if (j.question.trim()) lines.push("", `A question I would bring to the field: “${j.question.trim()}”`);
    lines.push("", "Please let me know when dates and applications are announced.");
    if (j.name.trim()) lines.push("", j.name.trim());
    return `mailto:${contact.email}?subject=${encodeURIComponent("Interest in the upcoming Good Governance Yatra")}&body=${encodeURIComponent(lines.join("\n"))}`;
  })();

  const stages = [
    { ...learningJourney[0], done: j.question.trim().length > 0, text: "Write one question to bring to the field." },
    { ...learningJourney[1], done: j.stamped.length === 3, text: `Open each state to stamp it. ${j.stamped.length} of 3 so far.` },
    { ...learningJourney[2], done: saved, text: "Save the page, and look again at what you stamped." },
    { ...learningJourney[3], done: false, text: "Write to the team with your question, and ask for the dates." },
  ];

  return (
    <section id="board" aria-labelledby="board-title" className="journal-board" data-thread="Your page">
      <div className="page grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
        <div className="lg:col-span-6 lg:order-2">
          <h2 id="board-title" className="sr-only">
            Your journal page
          </h2>
          <div className="journal-paper">
            <canvas ref={canvas} width={1080} height={1350} role="img" aria-label={`Your field journal page. ${names.length ? `Stamped: ${names.join(", ")}.` : "No state stamped yet."}${j.question ? ` Your question: ${j.question}` : ""}`} />
          </div>
          <p className="caption mt-3">Drawn on this device. Nothing leaves it unless you save, share or email the page.</p>
        </div>

        <div className="lg:col-span-5 lg:order-1">
          <h3 className="d-m">Your stamps</h3>
          <ul className="journal-slots mt-6">
            {stateDossiers.map((d) => {
              const on = j.stamped.includes(d.iso);
              const n = nativeOf(d.name);
              return (
                <li key={d.iso} className={on ? "is-on" : ""}>
                  {on ? (
                    <Postmark ring={RING[d.iso]} centre={n.native} lang={n.lang} className="journal-slot-stamp" />
                  ) : (
                    <span aria-hidden="true" className="journal-slot-empty" />
                  )}
                  <span>
                    <span className="block font-display text-[1.3rem] leading-tight">
                      {d.name} <Script lang={n.lang} className="text-crimson">{n.native}</Script>
                    </span>
                    <span className="caption">
                      {on ? "Stamped." : <Link href={stateHref(d.iso)} className="tlink tlink-static">Open the page to stamp it</Link>}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <form className="journal-form mt-10" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor={`${id}-q`} className="journal-label">
              A question for the field
            </label>
            <textarea id={`${id}-q`} value={j.question} maxLength={280} rows={3} onChange={(e) => setQuestion(e.target.value)} placeholder="What do you want to understand about governance?" className="journal-input" />
            <p className="caption mt-1">{280 - j.question.length} characters left. Printed on your page.</p>
            <label htmlFor={`${id}-n`} className="journal-label mt-6">
              Your name, if you would like it on the page
            </label>
            <input id={`${id}-n`} value={j.name} maxLength={60} autoComplete="name" onChange={(e) => setName(e.target.value)} className="journal-input" />
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={download} className="btn" data-magnetic>
              <span className="btn-label">
                <span>Save the page</span>
                <span aria-hidden="true">Save the page</span>
              </span>
            </button>
            {canShare ? (
              <button type="button" onClick={share} className="btn btn-ghost" data-magnetic>
                <span className="btn-label">
                  <span>Share</span>
                  <span aria-hidden="true">Share</span>
                </span>
              </button>
            ) : null}
            <a href={mail} className="tlink tlink-static text-[0.9rem]">
              Write to the team with this
            </a>
          </div>
          <p role="status" aria-live="polite" className="caption mt-3 min-h-[1.2em]">
            {note}
          </p>

          <ol className="journal-stages mt-10">
            {stages.map((s) => (
              <li key={s.name} className={s.done ? "is-done" : ""}>
                <span aria-hidden="true" className="journal-stage-dot" />
                <span>
                  <span className="font-display text-[1.15rem]">{s.name}</span>
                  <span className="sr-only">{s.done ? ", done" : ", open"}</span>
                  <span className="caption block">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => {
              clearJournal();
              setSaved(false);
              say("Your journal has been cleared from this device.");
            }}
            className="tlink tlink-static mt-8 text-[0.85rem] text-muted"
          >
            Clear my journal
          </button>
          <p className="caption mt-3 max-w-[26rem]">
            Your journal is kept only in this browser. It is not a registration or an application: applications for the upcoming edition, {upcoming.dates ?? "whose dates are to be announced"}, have not opened.
          </p>
        </div>
      </div>
    </section>
  );
}
