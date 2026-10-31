import type { PhotoKey } from "@/content/ggy";

export const navItems: { href: string; label: string; id: string; preview: PhotoKey }[] = [
  { href: "#states", label: "The states", id: "states", preview: "gateway" },
  { href: "#idea", label: "The idea", id: "idea", preview: "openLandscape" },
  { href: "#programme", label: "Programme", id: "programme", preview: "lectureHall" },
  { href: "#archive", label: "Archive", id: "archive", preview: "flagOff" },
  { href: "#people", label: "People", id: "people", preview: "legislatureSteps" },
  { href: "#questions", label: "Questions", id: "questions", preview: "overhead" },
];
