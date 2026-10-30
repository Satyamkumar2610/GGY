"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion for React follows the visitor's reduced-motion setting everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
