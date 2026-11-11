import type { ReactNode } from "react";

export interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  /** "H S L" with no units, e.g. "22 61 70". */
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}
declare function BorderGlow(props: BorderGlowProps): JSX.Element;
export default BorderGlow;
