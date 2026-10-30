import { Anek_Devanagari, Anek_Gujarati, Anek_Latin } from "next/font/google";

// Lab-only: full variable Anek (weight + width) for the typography comparison.
// Anek is by Ek Type (Mumbai), SIL Open Font License 1.1.
export const anekLatin = Anek_Latin({ variable: "--lab-anek-latin", subsets: ["latin"], axes: ["wdth"], display: "swap" });
export const anekDeva = Anek_Devanagari({ variable: "--lab-anek-deva", subsets: ["devanagari", "latin"], axes: ["wdth"], display: "swap" });
export const anekGuj = Anek_Gujarati({ variable: "--lab-anek-guj", subsets: ["gujarati", "latin"], axes: ["wdth"], display: "swap" });
