import { stateDossiers, upcoming } from "@/content/ggy";
import type { FocusIso } from "./atlas";

/** URL slugs of the three states. */
export const SLUG: Record<FocusIso, string> = { "IN-GJ": "gujarat", "IN-GA": "goa", "IN-MH": "maharashtra" };
export const stateHref = (iso: FocusIso) => `/states/${SLUG[iso]}`;

export const dossierBySlug = (slug: string) => stateDossiers.find((d) => SLUG[d.iso] === slug);
export const nativeOf = (name: string) => upcoming.states.find((s) => s.name === name)!;
