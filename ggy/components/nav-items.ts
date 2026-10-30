import type { PhotoKey } from "@/content/ggy";

export const navItems: { href: string; label: string; id: string; preview: PhotoKey }[] = [
  { href: "#route", label: "The route", id: "route", preview: "municipalCorporation" },
  { href: "#format", label: "The format", id: "format", preview: "lectureHall" },
  { href: "#archive", label: "Archive", id: "archive", preview: "flagOff" },
  { href: "#people", label: "People", id: "people", preview: "legislatureSteps" },
  { href: "#questions", label: "Questions", id: "questions", preview: "overhead" },
  { href: "#admissions", label: "Admissions", id: "admissions", preview: "cohort" },
];
