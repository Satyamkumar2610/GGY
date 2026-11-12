import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";

/**
 * The page root every GGY section renders inside. It is the body of
 * app/layout.tsx plus the `.lp` wrapper from app/page.tsx: `.lp` carries the
 * palette tokens (--c-crimson, --c-deep, --c-saffron…), the font stacks and
 * the resets that every section's styles hang off. Outside it, sections
 * render unstyled.
 */
export function SiteShell({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <MotionProvider>
      <div className={`lp ${className}`.trim()}>{children}</div>
    </MotionProvider>
  );
}
