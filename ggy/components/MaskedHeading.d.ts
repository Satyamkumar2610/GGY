import type { CSSProperties } from "react";

export interface MaskedHeadingProps {
  text?: string;
  tag?: string;
  mediaType?: "image" | "video";
  src?: string;
  poster?: string;
  reveal?: "rise" | "scale" | "blur" | "wipe" | "fade" | "none";
  trigger?: "view" | "mount" | "hover";
  duration?: number;
  stagger?: number;
  spotlight?: boolean;
  spotlightRadius?: number;
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  hoverZoom?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  tint?: string;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
}
declare const MaskedHeading: (props: MaskedHeadingProps) => JSX.Element;
export default MaskedHeading;
