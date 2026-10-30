import type { Metadata } from "next";
import { MotionLab } from "@/components/lab/motion-lab";
import { anekDeva, anekGuj, anekLatin } from "./fonts";

// Private development route: not linked from the site, not indexed.
export const metadata: Metadata = {
  title: "Motion lab · GGY (private)",
  robots: { index: false, follow: false, nocache: true },
};

export default function MotionLabPage() {
  return (
    <div className={`${anekLatin.variable} ${anekDeva.variable} ${anekGuj.variable}`}>
      <MotionLab />
    </div>
  );
}
