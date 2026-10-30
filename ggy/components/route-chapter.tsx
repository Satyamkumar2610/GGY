import { RouteExplorer } from "./route-explorer";

/** The route chapter: a large asymmetric heading and the interactive map explorer. */
export function RouteChapter() {
  return (
    <section id="route" aria-labelledby="route-title" className="overflow-x-clip bg-paper pb-[clamp(6rem,12vw,10rem)] pt-[clamp(5rem,10vw,8rem)]">
      <div className="page">
        <div className="mb-[clamp(3rem,6vw,5rem)] grid gap-6 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <h2 id="route-title" className="d-xl lg:col-span-9 lg:col-start-4" data-drift>
            Three states on the western coast
          </h2>
          <p className="max-w-[22rem] text-ink-soft lg:col-span-3 lg:row-start-1 lg:self-end">
            Choose a state on the map or from the list. The stops, the order of travel and the people delegates will meet are still to be announced.
          </p>
        </div>
        <RouteExplorer />
      </div>
    </section>
  );
}
