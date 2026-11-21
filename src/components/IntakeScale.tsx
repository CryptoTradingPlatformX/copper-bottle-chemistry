import { COPPER_INTAKE_MEN_MG, COPPER_INTAKE_WOMEN_MG, COPPER_RDA_MG, COPPER_UL_MG } from "../lib/chemistry";

const EXAMPLE_BOTTLE_MG = 0.2;

export function IntakeScale() {
  const max = COPPER_UL_MG;
  const marks = [
    { mg: COPPER_RDA_MG, label: `Recommended, ${COPPER_RDA_MG} mg` },
    { mg: COPPER_INTAKE_WOMEN_MG, label: `Typical food, women ${COPPER_INTAKE_WOMEN_MG} mg` },
    { mg: COPPER_INTAKE_MEN_MG, label: `Typical food, men ${COPPER_INTAKE_MEN_MG} mg` },
    { mg: EXAMPLE_BOTTLE_MG, label: `Example bottle liter, ${EXAMPLE_BOTTLE_MG} mg` },
  ];
  return (
    <div className="intake">
      <p className="intake-title">A day of copper, on a scale that ends at the {COPPER_UL_MG} mg upper limit</p>
      <div className="intake-track" aria-hidden="true">
        <span className="intake-end">0</span>
        <span className="intake-end end">{COPPER_UL_MG} mg limit</span>
        {marks.map((mark) => (
          <span key={mark.label} className="intake-mark" style={{ left: `${(mark.mg / max) * 100}%` }} />
        ))}
      </div>
      <ul>
        {marks.map((mark) => (
          <li key={mark.label}>{mark.label}</li>
        ))}
        <li>Upper limit, {COPPER_UL_MG} mg. This is a ceiling, not a target.</li>
      </ul>
      <p className="note">
        The 0.2 mg bottle mark is an example of a low standing-water amount, not a promise about your bottle. One liter at that level is a small add-on next to food.
      </p>
    </div>
  );
}
