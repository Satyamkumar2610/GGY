export type DepthCarouselItem = string | { image: string; alt?: string };

export interface DepthCarouselProps {
  items?: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  onChange?: (index: number, item: { image: string; alt?: string }) => void;
  /** Local addition: set false so the wheel scrolls the page instead of the carousel. */
  wheel?: boolean;
  /** Local addition: the carousel's accessible name. */
  ariaLabel?: string;
  className?: string;
}
declare function DepthCarousel(props: DepthCarouselProps): JSX.Element;
export default DepthCarousel;
