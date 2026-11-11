/**
 * A URL from Next's image optimizer, for components that take a plain image
 * URL rather than <Image>. Width must be one of Next's device sizes and the
 * quality one of `images.qualities` in next.config.ts.
 */
export const optimized = (src: string, width: 640 | 750 | 828 | 1080 | 1200 | 1920 = 1200, quality: 75 | 80 | 82 = 80) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
