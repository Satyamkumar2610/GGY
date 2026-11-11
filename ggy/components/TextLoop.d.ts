import type { CSSProperties } from "react";

export interface TextLoopProps {
  text?: string;
  shape?: "wave" | "circle" | "infinity" | "arch" | "line";
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  curviness?: number;
  tilt?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  color?: string;
  edgeFade?: number;
  cross?: boolean;
  crossAngle?: number;
  draggable?: boolean;
  scrollBoost?: number;
  outline?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
}
declare const TextLoop: (props: TextLoopProps) => JSX.Element;
export default TextLoop;
