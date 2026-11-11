import type { CSSProperties, ReactNode } from "react";

export interface ScrollStackProps {
  children?: ReactNode;
  className?: string;
  itemDistance?: number;
  itemStackDistance?: number;
  stackPosition?: number | string;
  itemScale?: number;
  baseScale?: number;
  dimAmount?: number;
  blurAmount?: number;
  tiltAmount?: number;
  rotationAmount?: number;
  holdDistance?: number;
  smoothScroll?: boolean;
  snap?: boolean;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}
export interface ScrollStackItemProps {
  children?: ReactNode;
  itemClassName?: string;
  style?: CSSProperties;
}
export declare const ScrollStackItem: (props: ScrollStackItemProps) => JSX.Element;
declare const ScrollStack: (props: ScrollStackProps) => JSX.Element;
export default ScrollStack;
