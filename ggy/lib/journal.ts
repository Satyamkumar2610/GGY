"use client";

import { useSyncExternalStore } from "react";
import type { FocusIso } from "./atlas";

/**
 * The visitor's own field journal. It lives only in this browser's
 * localStorage: nothing is sent anywhere, and nothing here is a registration
 * or an application. Opening a state's dossier or page stamps it; the
 * visitor may add a name and one question to bring to the field.
 */
export type Journal = { stamped: FocusIso[]; name: string; question: string };

const KEY = "ggy-journal-v1";
const EMPTY: Journal = { stamped: [], name: "", question: "" };
const ISOS: FocusIso[] = ["IN-GJ", "IN-GA", "IN-MH"];

let raw: string | null | undefined;
let cache: Journal = EMPTY;
const listeners = new Set<() => void>();

function read(): Journal {
  let text: string | null = null;
  try {
    text = window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked: the journal then lives for this visit only (see memory).
    return cache;
  }
  if (text === raw) return cache;
  raw = text;
  try {
    const j = text ? (JSON.parse(text) as Partial<Journal>) : {};
    cache = {
      stamped: (Array.isArray(j.stamped) ? j.stamped : []).filter((i): i is FocusIso => ISOS.includes(i as FocusIso)),
      name: typeof j.name === "string" ? j.name.slice(0, 60) : "",
      question: typeof j.question === "string" ? j.question.slice(0, 280) : "",
    };
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Journal) {
  cache = next;
  try {
    const text = JSON.stringify(next);
    window.localStorage.setItem(KEY, text);
    raw = text;
  } catch {
    // Blocked or full: keep the in-memory copy.
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useJournal(): Journal {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Stamps a state. Returns true the first time, and announces it. */
export function stamp(iso: FocusIso): boolean {
  const j = read();
  if (j.stamped.includes(iso)) return false;
  const stamped = [...j.stamped, iso];
  write({ ...j, stamped });
  window.dispatchEvent(new CustomEvent("ggy:stamp", { detail: { iso, count: stamped.length } }));
  return true;
}

export const setName = (name: string) => write({ ...read(), name: name.slice(0, 60) });
export const setQuestion = (question: string) => write({ ...read(), question: question.slice(0, 280) });
export const clearJournal = () => write(EMPTY);
