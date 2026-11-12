import { Button } from "ggy";

const row = { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" as const, padding: "2rem" };

/** Solid crimson on paper: the primary action. */
export const Solid = () => (
  <div style={row}>
    <Button href="#apply">Apply for the next edition</Button>
    <Button href="#apply" size="sm">
      Read the brochure
    </Button>
  </div>
);

/** Cream on a crimson ground (fills marigold on hover). */
export const CreamOnCrimson = () => (
  <div className="on-dark on-ember ground" style={row}>
    <Button href="#contact" variant="cream">
      Write to the team
    </Button>
    <Button href="#programme" variant="ghost">
      See the programme
    </Button>
  </div>
);

/** Ghost on paper: a secondary action beside a solid one. */
export const GhostOnPaper = () => (
  <div style={row}>
    <Button href="#apply">Admissions and contact</Button>
    <Button href="#programme" variant="ghost">
      See the programme
    </Button>
  </div>
);
