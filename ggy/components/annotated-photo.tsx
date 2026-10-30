"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { annotations, photos, type PhotoKey } from "@/content/ggy";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A photograph with numbered markers on details that are visible in it.
 * Each marker is a button that opens a note beside it; the notes are also
 * listed under the photograph for small screens and screen readers.
 */
export function AnnotatedPhoto({
  photoKey,
  sizes,
  className = "",
  dark = false,
  duotone = false,
}: {
  photoKey: PhotoKey;
  sizes: string;
  className?: string;
  dark?: boolean;
  /** Print the photograph in the chapter's two inks until it reaches the reader. */
  duotone?: boolean;
}) {
  const p = photos[photoKey];
  const notes = annotations[photoKey] ?? [];
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <figure className={className}>
      <div className="media relative" style={{ aspectRatio: `${p.width} / ${p.height}` }} data-reveal>
        {/* The inks wrap the image alone, so the markers stay above them. */}
        <div className={duotone ? "duotone" : "absolute inset-0"}>
          <Image src={p.src} alt={p.alt} fill quality={82} sizes={sizes} className="object-cover" />
        </div>
        {notes.map((n, i) => {
          const on = open === i;
          return (
            <div key={n.title} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                aria-label={`Detail ${i + 1}: ${n.title}`}
                onClick={() => setOpen(on ? null : i)}
                onMouseEnter={() => setOpen(i)}
                className="annot-dot -translate-x-1/2 -translate-y-1/2"
              >
                <span aria-hidden="true">{i + 1}</span>
              </button>
              <AnimatePresence>
                {on ? (
                  <motion.div
                    id={`${id}-${i}`}
                    role="note"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.35, ease }}
                    onMouseLeave={() => setOpen(null)}
                    className={`absolute top-5 z-10 hidden w-[17rem] bg-light p-4 text-[0.85rem] leading-snug text-ink shadow-[0_24px_48px_-24px_rgb(20_18_16/0.6)] md:block ${n.x > 55 ? "right-0" : "left-0"}`}
                  >
                    <p className="font-display text-[1.05rem]">{n.title}</p>
                    <p className="mt-1.5 text-ink-soft">{n.text}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-4">
        <ol className={`grid gap-3 text-[0.85rem] sm:grid-cols-3 ${dark ? "text-ivory/85" : "text-ink-soft"}`}>
          {notes.map((n, i) => (
            <li key={n.title} className="flex gap-2">
              <span className={`num shrink-0 text-[1rem] ${dark ? "text-crimson-on-ink" : "text-crimson"}`}>{i + 1}</span>
              <span>
                <span className={dark ? "text-ivory" : "text-ink"}>{n.title}.</span> {n.text}
              </span>
            </li>
          ))}
        </ol>
        <p className="caption mt-3">{p.caption} Photograph from the GGY brochure.</p>
      </figcaption>
    </figure>
  );
}
