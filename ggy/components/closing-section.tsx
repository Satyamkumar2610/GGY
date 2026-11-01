import { Button } from "./primitives";
import { ClosingMap } from "./closing-map";

/**
 * The close of the home page: one large sentence over the three states in
 * ivory linework. Applications have not opened, so the one action is to
 * connect with the team.
 */
export function ClosingSection() {
  return (
    <section id="closing" aria-labelledby="closing-title" className="on-dark on-crimson bg-crimson-deep text-ivory" data-ground-reveal data-thread="Closing">
      <div className="closing">
        <ClosingMap />
        <div className="page relative">
          <div className="closing-copy">
            <p className="kicker text-ivory/80">The upcoming edition</p>
            <h2 id="closing-title" className="closing-title mt-7" data-drift>
              The journey changes the way you see governance.
            </h2>
            <p className="lede mt-8 max-w-[30rem] text-ivory/90">Explore the upcoming Good Governance Yatra across Maharashtra, Goa and Gujarat.</p>
            <p className="mt-4 max-w-[30rem] text-[0.95rem] text-ivory/80">
              Applications for the upcoming edition have not opened, and its dates are still to be announced. Until then, the GGY team can be reached directly.
            </p>
            <Button href="/connect" variant="cream" className="mt-9">
              Connect with the GGY team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
