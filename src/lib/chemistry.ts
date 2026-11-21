/** Molar masses rounded so the on-page arithmetic matches this function. */
const O2_MOLAR_MASS_G = 32;
const H2O_MOLAR_MASS_G = 18;
const WATER_GRAMS_PER_LITER = 1000;

/** EPA Lead and Copper Rule action level, 40 CFR §141.80(c). Milligrams per liter. */
export const EPA_COPPER_ACTION_LEVEL_MG_L = 1.3;

/** WHO Guidelines for Drinking-water Quality guideline value. Milligrams per liter. */
export const WHO_COPPER_GUIDELINE_MG_L = 2;

/** Adult RDA, NIH Office of Dietary Supplements / Food and Nutrition Board. */
export const COPPER_RDA_MG = 0.9;

/** Adult tolerable upper intake level from food and supplements. */
export const COPPER_UL_MG = 10;

/** NIH ODS: average U.S. adult intake from food. */
export const COPPER_INTAKE_WOMEN_MG = 1.1;
export const COPPER_INTAKE_MEN_MG = 1.4;

/** Midpoint of the "about 8–9 mg/L" room-temperature range used on the page. */
export const DISSOLVED_OXYGEN_EXAMPLE_MG_L = 8.5;

/** Water molecules coordinated to aqueous Cu²⁺. */
export const HYDRATION_WATERS = 6;

/**
 * How many water molecules share a liter with one dissolved O₂ molecule.
 * Dissolved oxygen is a separate molecule, not part of H₂O.
 */
export function waterMoleculesPerDissolvedOxygen(doMgPerL: number): number {
  if (doMgPerL <= 0) return Infinity;
  const molesOxygen = doMgPerL / 1000 / O2_MOLAR_MASS_G;
  const molesWater = WATER_GRAMS_PER_LITER / H2O_MOLAR_MASS_G;
  return molesWater / molesOxygen;
}

export function formatCount(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type Drink = "water" | "acid";

/**
 * Illustrative copper concentration versus standing time.
 * This is a teaching sketch of the pattern, not a measurement.
 * Plain water stays under 1 mg/L. An acidic drink climbs past the reference lines.
 */
export function illustrativeCopperMgPerL(hours: number, drink: Drink): number {
  const h = Math.max(0, hours);
  if (drink === "water") return 0.42 * (1 - Math.exp(-h / 7));
  return 2.7 * (1 - Math.exp(-h / 3.5));
}

/** A wide illustrative band around the plain-water sketch. Still under 1 mg/L. */
export function plainWaterBand(hours: number): { low: number; high: number } {
  const mid = illustrativeCopperMgPerL(hours, "water");
  return {
    low: mid * 0.35,
    high: Math.min(0.9, 0.08 + mid * 1.8),
  };
}

/** Anode half-reaction releases 2 electrons. It must run twice to feed the cathode. */
export function halfReactionsBalance(): boolean {
  const electronsFromCopper = 2 * 2;
  const electronsUsedByOxygen = 4;
  return electronsFromCopper === electronsUsedByOxygen;
}

export function overallReactionIsBalanced(): boolean {
  const left = { cu: 2, o: 2, h: 4, charge: 4 };
  const right = { cu: 2, o: 2, h: 4, charge: 4 };
  return (
    left.cu === right.cu &&
    left.o === right.o &&
    left.h === right.h &&
    left.charge === right.charge
  );
}

export function formatMg(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}
