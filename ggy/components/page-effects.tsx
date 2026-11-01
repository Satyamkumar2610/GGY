import { PageMotion } from "./motion/page-motion";
import { ScrollRefresh } from "./motion/scroll-refresh";
import { MarginThread } from "./motion/margin-thread";

/** What every page carries: the shared reveals, a refresh once fonts are in, and the margin thread. */
export function PageEffects() {
  return (
    <>
      <PageMotion />
      <MarginThread />
      <ScrollRefresh />
    </>
  );
}

/** The wrapper every page's content sits in, so motion can find its own page. */
export function Page({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <div data-page={name}>
      {children}
      <PageEffects />
    </div>
  );
}
