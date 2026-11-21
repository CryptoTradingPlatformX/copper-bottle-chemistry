import {
  DISSOLVED_OXYGEN_EXAMPLE_MG_L,
  formatCount,
  waterMoleculesPerDissolvedOxygen,
} from "../lib/chemistry";

export function RatioNote() {
  const count = formatCount(waterMoleculesPerDissolvedOxygen(DISSOLVED_OXYGEN_EXAMPLE_MG_L));
  return (
    <details className="math">
      <summary>Where the 200,000 comes from</summary>
      <p>
        Well-aerated freshwater at room temperature holds about 8 to 9 milligrams of dissolved oxygen per liter.
        Take {DISSOLVED_OXYGEN_EXAMPLE_MG_L} mg. A mole of O₂ weighs about 32 grams, so that is {DISSOLVED_OXYGEN_EXAMPLE_MG_L} divided by 32,000 moles of O₂ in a liter.
        A liter of water is about 1,000 ÷ 18, or 55.6 moles of H₂O. Divide the moles of water by the moles of oxygen and you get about {count} water molecules for each dissolved O₂.
        Across 8–9 mg/L the crowd stays near 200,000. The two kinds of molecule stay themselves. They do not fuse into one compound.
      </p>
    </details>
  );
}
