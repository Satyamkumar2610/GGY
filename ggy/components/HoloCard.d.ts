import type { CSSProperties } from "react";

export interface HoloCardProps {
  image?: string;
  backImage?: string;
  alt?: string;
  preset?: "bursts" | "stars" | "shards" | "cosmos" | "rainbow" | "swirl" | "glitter" | "gold";
  intensity?: number;
  scale?: number;
  edgeSparkle?: number;
  frame?: number;
  glare?: number;
  foilColor?: string;
  width?: number;
  radius?: number;
  tiltMax?: number;
  hoverScale?: number;
  idle?: boolean;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
}
declare function HoloCard(props: HoloCardProps): JSX.Element;
export default HoloCard;
