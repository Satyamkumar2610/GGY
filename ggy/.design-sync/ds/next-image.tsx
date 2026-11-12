import type { CSSProperties, ImgHTMLAttributes } from "react";

/**
 * Stand-in for next/image in the design-system bundle. There is no Next
 * image optimizer outside the site, so this renders the plain <img> that
 * next/image itself produces: `fill` becomes the same absolutely-positioned
 * cover box, and the optimizer-only props are dropped.
 *
 * Photograph paths ("/images/…") are replaced with inlined data URLs by
 * build.mjs before this module ever sees them.
 */
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string | { src: string };
  alt: string;
  fill?: boolean;
  width?: number | string;
  height?: number | string;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  overrideSrc?: string;
  preload?: boolean;
};

const FILL: CSSProperties = { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent" };

export default function Image({ src, alt, fill, width, height, style, quality, priority, sizes, placeholder, blurDataURL, unoptimized, loader, overrideSrc, preload, loading, fetchPriority, ...rest }: Props) {
  void quality, priority, sizes, placeholder, blurDataURL, unoptimized, loader, preload, loading, fetchPriority;
  const url = overrideSrc ?? (typeof src === "string" ? src : src.src);
  return (
    <img
      {...rest}
      src={url}
      alt={alt}
      decoding="async"
      data-nimg={fill ? "fill" : "1"}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={fill ? { ...FILL, ...style } : style}
    />
  );
}
