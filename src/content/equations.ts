import type { SceneContent } from "./scenes";

export type SceneId = SceneContent["id"];

export const ELEMENTS = ["H", "O", "Cu", "C", "Cl"] as const;
export type ElementSymbol = (typeof ELEMENTS)[number];

export interface Species {
  id: string;
  label: string;
  plain: string;
  atoms: Partial<Record<ElementSymbol, number>>;
  /** Charge of one formula unit. An electron is −1. */
  charge: number;
}

export interface TermRef {
  id: string;
  /** Stoichiometric coefficient. One is left unwritten. */
  count?: number;
  /** Shown instead of the species label when the state symbol changes. */
  label?: string;
}

export interface BalancedEquation {
  id: string;
  left: TermRef[];
  right: TermRef[];
  reversible?: boolean;
  /** Shown after the line, for example "twice". */
  suffix?: string;
  /** One sentence in plain English. */
  reading: string;
  aside?: string;
}

export const SPECIES: Record<string, Species> = {
  o2: {
    id: "o2",
    label: "O₂",
    plain: "A molecule of oxygen: two oxygen atoms joined. (g) means the gas in air. (aq) means that same molecule dissolved in water. It is not the oxygen already inside H₂O.",
    atoms: { O: 2 },
    charge: 0,
  },
  h2o: {
    id: "h2o",
    label: "H₂O",
    plain: "Water. One oxygen atom held to two hydrogen atoms. (l) means liquid water.",
    atoms: { H: 2, O: 1 },
    charge: 0,
  },
  h3o: {
    id: "h3o",
    label: "H₃O⁺",
    plain: "A hydronium ion: a water molecule that has picked up H⁺. This is how a hydrogen ion actually sits in water. The charge is +1.",
    atoms: { H: 3, O: 1 },
    charge: 1,
  },
  oh: {
    id: "oh",
    label: "OH⁻",
    plain: "Hydroxide, a negative ion of oxygen and hydrogen. It is the partner piece when water splits, and it shows up again when oxygen is reduced in neutral water.",
    atoms: { H: 1, O: 1 },
    charge: -1,
  },
  co2: {
    id: "co2",
    label: "CO₂",
    plain: "Carbon dioxide. (g) is the gas in air. (aq) is that gas dissolved in water. It is the source of the weak acid in plain water, and of the carbon in green patina.",
    atoms: { C: 1, O: 2 },
    charge: 0,
  },
  h2co3: {
    id: "h2co3",
    label: "H₂CO₃",
    plain: "Carbonic acid, a weak acid made when carbon dioxide meets water. It lets go of H⁺ easily.",
    atoms: { H: 2, C: 1, O: 3 },
    charge: 0,
  },
  h: {
    id: "h",
    label: "H⁺",
    plain: "A hydrogen ion: hydrogen that has lost its electron, so the charge is +1. Plain water has very few. More come from carbonic acid, and many more from lemon juice or vinegar. In water it usually rides on H₂O as H₃O⁺. Equations often still write H⁺.",
    atoms: { H: 1 },
    charge: 1,
  },
  hco3: {
    id: "hco3",
    label: "HCO₃⁻",
    plain: "Bicarbonate, what is left of carbonic acid after it gives up H⁺. Charge −1.",
    atoms: { H: 1, C: 1, O: 3 },
    charge: -1,
  },
  cu: {
    id: "cu",
    label: "Cu",
    plain: "Copper metal in the bottle wall. (s) means solid. Only atoms at the surface, where air or water can touch them, take part.",
    atoms: { Cu: 1 },
    charge: 0,
  },
  cu2: {
    id: "cu2",
    label: "Cu²⁺",
    plain: "A copper ion with charge +2. (aq) means it is dissolved and wrapped in water. Inside an enzyme, the same charge sits on the copper the protein is holding.",
    atoms: { Cu: 1 },
    charge: 2,
  },
  cu1: {
    id: "cu1",
    label: "Cu⁺",
    plain: "A copper ion with charge +1. Enzymes flip copper between +2 and +1. Copper(I) is also the form that can split hydrogen peroxide.",
    atoms: { Cu: 1 },
    charge: 1,
  },
  e: {
    id: "e",
    label: "e⁻",
    plain: "An electron, the tiny negative particle atoms trade. Writing it on one side of a half-reaction makes the charges add up. It does not float off on its own. In the metal, electrons like these are the shared sea.",
    atoms: {},
    charge: -1,
  },
  hexaaqua: {
    id: "hexaaqua",
    label: "[Cu(H₂O)₆]²⁺",
    plain: "The dissolved copper ion surrounded by six water molecules. The oxygens point inward, because that end of water is slightly negative and the copper ion is positive.",
    atoms: { Cu: 1, H: 12, O: 6 },
    charge: 2,
  },
  cu2o: {
    id: "cu2o",
    label: "Cu₂O",
    plain: "Copper(I) oxide, the reddish-brown film. Two copper atoms for each oxygen. (s) means it is a solid layer on the metal, not the metal itself.",
    atoms: { Cu: 2, O: 1 },
    charge: 0,
  },
  cuo: {
    id: "cuo",
    label: "CuO",
    plain: "Copper(II) oxide, the black film. One copper for each oxygen, still a solid coating on top of the metal.",
    atoms: { Cu: 1, O: 1 },
    charge: 0,
  },
  patina: {
    id: "patina",
    label: "Cu₂(OH)₂CO₃",
    plain: "Basic copper carbonate, the green or blue-green crust. Mineral name: malachite. It is a layer built from copper, hydroxide, and carbonate.",
    atoms: { Cu: 2, O: 5, H: 2, C: 1 },
    charge: 0,
  },
  h2o2: {
    id: "h2o2",
    label: "H₂O₂",
    plain: "Hydrogen peroxide. It is a reactive oxygen molecule cells can make. It is not water: water is H₂O, this is H₂O₂.",
    atoms: { H: 2, O: 2 },
    charge: 0,
  },
  radical: {
    id: "radical",
    label: "•OH",
    plain: "A hydroxyl radical. The dot means an unpaired electron, which makes it eager to react. It is one kind of reactive oxygen species: an unstable oxygen fragment that can damage a cell.",
    atoms: { H: 1, O: 1 },
    charge: 0,
  },
  superoxide: {
    id: "superoxide",
    label: "O₂•⁻",
    plain: "Superoxide, an oxygen molecule carrying an extra electron. The dot marks that unpaired electron. Cells make a little of it during ordinary chemistry.",
    atoms: { O: 2 },
    charge: -1,
  },
  cl: {
    id: "cl",
    label: "Cl⁻",
    plain: "A chloride ion, the negative half of salt. Charge −1. It can hold copper in solution.",
    atoms: { Cl: 1 },
    charge: -1,
  },
  cucl4: {
    id: "cucl4",
    label: "[CuCl₄]²⁻",
    plain: "One copper ion held by four chlorides. The whole bundle has charge −2. It shows up when chloride is concentrated, as in a salt paste. With less salt, copper pairs with fewer chlorides, and still stays dissolved.",
    atoms: { Cu: 1, Cl: 4 },
    charge: -2,
  },
};

export const SCENE_EQUATIONS: Record<SceneId, BalancedEquation[]> = {
  zoom: [
    {
      id: "dissolve-o2",
      reversible: true,
      left: [{ id: "o2", label: "O₂(g)" }],
      right: [{ id: "o2", label: "O₂(aq)" }],
      reading: "Oxygen gas from the air dissolves into the water, and it can leave again.",
    },
    {
      id: "water-split",
      reversible: true,
      left: [{ id: "h2o", count: 2, label: "H₂O(l)" }],
      right: [
        { id: "h3o", label: "H₃O⁺(aq)" },
        { id: "oh", label: "OH⁻(aq)" },
      ],
      reading: "A tiny share of water molecules split into a positive ion and a negative ion.",
    },
    {
      id: "carbonic-form",
      reversible: true,
      left: [
        { id: "co2", label: "CO₂(aq)" },
        { id: "h2o", label: "H₂O(l)" },
      ],
      right: [{ id: "h2co3", label: "H₂CO₃(aq)" }],
      reading: "Dissolved carbon dioxide and water make a little carbonic acid.",
    },
    {
      id: "carbonic-split",
      reversible: true,
      left: [{ id: "h2co3", label: "H₂CO₃(aq)" }],
      right: [
        { id: "h", label: "H⁺(aq)" },
        { id: "hco3", label: "HCO₃⁻(aq)" },
      ],
      reading: "That weak acid lets go of H⁺, which is scarce in plain water but real.",
    },
  ],
  wall: [
    {
      id: "copper-half",
      left: [{ id: "cu", label: "Cu(s)" }],
      right: [
        { id: "cu2", label: "Cu²⁺(aq)" },
        { id: "e", count: 2 },
      ],
      reading: "A surface copper atom can give two electrons to the shared sea and become an ion.",
      aside: "This is only half of a reaction. The electrons do not vanish. Dissolved oxygen takes them up in the next scene.",
    },
  ],
  oxidation: [
    {
      id: "anode",
      suffix: "twice",
      left: [{ id: "cu", label: "Cu(s)" }],
      right: [
        { id: "cu2", label: "Cu²⁺(aq)" },
        { id: "e", count: 2 },
      ],
      reading: "Each copper atom gives up two electrons. This half happens twice, so four electrons leave.",
    },
    {
      id: "cathode-acid",
      left: [
        { id: "o2", label: "O₂(aq)" },
        { id: "h", count: 4, label: "H⁺(aq)" },
        { id: "e", count: 4 },
      ],
      right: [{ id: "h2o", count: 2, label: "H₂O(l)" }],
      reading: "Dissolved oxygen takes those four electrons, plus four H⁺ ions, and becomes water.",
    },
    {
      id: "overall-acid",
      left: [
        { id: "cu", count: 2, label: "Cu(s)" },
        { id: "o2", label: "O₂(aq)" },
        { id: "h", count: 4, label: "H⁺(aq)" },
      ],
      right: [
        { id: "cu2", count: 2, label: "Cu²⁺(aq)" },
        { id: "h2o", count: 2, label: "H₂O(l)" },
      ],
      reading: "Together, copper metal, dissolved oxygen, and acid make copper ions and water.",
    },
    {
      id: "overall-neutral",
      left: [
        { id: "cu", count: 2, label: "Cu(s)" },
        { id: "o2", label: "O₂(aq)" },
        { id: "h2o", count: 2, label: "H₂O(l)" },
      ],
      right: [
        { id: "cu2", count: 2, label: "Cu²⁺(aq)" },
        { id: "oh", count: 4, label: "OH⁻(aq)" },
      ],
      reading: "In neutral water, oxygen more often becomes hydroxide, which helps copper stay on the surface as an oxide.",
    },
  ],
  leach: [
    {
      id: "hydration",
      left: [
        { id: "cu2", label: "Cu²⁺(aq)" },
        { id: "h2o", count: 6, label: "H₂O(l)" },
      ],
      right: [{ id: "hexaaqua", label: "[Cu(H₂O)₆]²⁺(aq)" }],
      reading: "As soon as the ion leaves the wall, six water molecules lock on around it.",
    },
    {
      id: "acid-oxide",
      left: [
        { id: "cuo", label: "CuO(s)" },
        { id: "h", count: 2, label: "H⁺(aq)" },
      ],
      right: [
        { id: "cu2", label: "Cu²⁺(aq)" },
        { id: "h2o", label: "H₂O(l)" },
      ],
      reading: "Acid, as in lemon water or vinegar, dissolves the oxide and frees many more copper ions.",
    },
  ],
  tarnish: [
    {
      id: "cuprite",
      left: [
        { id: "cu", count: 4, label: "Cu(s)" },
        { id: "o2", label: "O₂(g)" },
      ],
      right: [{ id: "cu2o", count: 2, label: "Cu₂O(s)" }],
      reading: "Oxygen turns surface copper into reddish-brown copper(I) oxide.",
    },
    {
      id: "tenorite",
      left: [
        { id: "cu2o", count: 2, label: "Cu₂O(s)" },
        { id: "o2", label: "O₂(g)" },
      ],
      right: [{ id: "cuo", count: 4, label: "CuO(s)" }],
      reading: "More oxygen turns that brown film into black copper(II) oxide.",
    },
    {
      id: "malachite",
      left: [
        { id: "cuo", count: 2, label: "CuO(s)" },
        { id: "co2", label: "CO₂(g)" },
        { id: "h2o", label: "H₂O(l)" },
      ],
      right: [{ id: "patina", label: "Cu₂(OH)₂CO₃(s)" }],
      reading: "Carbon dioxide and water convert black oxide into the green patina.",
      aside: "Real films also grow from dissolved ions, and the layers mix. These three lines are the simple stack.",
    },
  ],
  germs: [
    {
      id: "fenton-like",
      left: [
        { id: "cu1", label: "Cu⁺" },
        { id: "h2o2" },
      ],
      right: [
        { id: "cu2", label: "Cu²⁺" },
        { id: "oh" },
        { id: "radical" },
      ],
      reading: "One proposed step: copper(I) splits hydrogen peroxide into hydroxide and a damaging radical.",
      aside: "This is one suggested mechanism, not the whole effect. Membrane damage and enzymes stopped by copper matter too. It is well established on dry copper surfaces, and milder in a bottle.",
    },
  ],
  body: [
    {
      id: "enzyme-switch",
      reversible: true,
      left: [
        { id: "cu2", label: "Cu²⁺" },
        { id: "e" },
      ],
      right: [{ id: "cu1", label: "Cu⁺" }],
      reading: "Copper enzymes flip the ion between +2 and +1. That one-electron switch is the tool they use.",
    },
    {
      id: "sod",
      left: [
        { id: "superoxide", count: 2 },
        { id: "h", count: 2, label: "H⁺" },
      ],
      right: [
        { id: "h2o2" },
        { id: "o2" },
      ],
      reading: "SOD1 uses that copper switch to turn two superoxide radicals into hydrogen peroxide and ordinary oxygen.",
    },
    {
      id: "cytochrome",
      left: [
        { id: "o2" },
        { id: "h", count: 4, label: "H⁺" },
        { id: "e", count: 4 },
      ],
      right: [{ id: "h2o", count: 2 }],
      reading: "Cytochrome c oxidase uses copper for the last step of how a cell turns food energy into a form it can spend.",
    },
  ],
  clean: [
    {
      id: "clean-cuo",
      left: [
        { id: "cuo", label: "CuO(s)" },
        { id: "h", count: 2, label: "H⁺" },
      ],
      right: [
        { id: "cu2" },
        { id: "h2o" },
      ],
      reading: "Acid from the lemon dissolves black copper oxide into a copper ion and water.",
    },
    {
      id: "clean-cu2o",
      left: [
        { id: "cu2o", label: "Cu₂O(s)" },
        { id: "h", count: 2, label: "H⁺" },
      ],
      right: [
        { id: "cu2" },
        { id: "cu", label: "Cu(s)" },
        { id: "h2o" },
      ],
      reading: "Brown copper(I) oxide also yields to acid: one ion dissolves, and one copper atom returns to the metal.",
    },
    {
      id: "clean-patina",
      left: [
        { id: "patina", label: "Cu₂(OH)₂CO₃(s)" },
        { id: "h", count: 4, label: "H⁺" },
      ],
      right: [
        { id: "cu2", count: 2 },
        { id: "co2", label: "CO₂(g)" },
        { id: "h2o", count: 3 },
      ],
      reading: "The same acid dissolves the green crust into copper ions, carbon dioxide, and water.",
    },
    {
      id: "chloro-complex",
      left: [
        { id: "cu2" },
        { id: "cl", count: 4, label: "Cl⁻" },
      ],
      right: [{ id: "cucl4" }],
      reading: "Chloride from the salt grabs the dissolved copper and keeps it in the liquid.",
      aside: "Four chlorides per copper ion need a salty paste. Fewer chlorides can hold copper too. Citrate from the lemon grips copper as well, which is the chelate.",
    },
  ],
};

export interface Tally {
  atoms: Record<ElementSymbol, number>;
  charge: number;
}

export function tally(terms: TermRef[]): Tally {
  const atoms = { H: 0, O: 0, Cu: 0, C: 0, Cl: 0 };
  let charge = 0;
  for (const term of terms) {
    const species = SPECIES[term.id];
    if (!species) throw new Error(`Unknown species ${term.id}`);
    const count = term.count ?? 1;
    for (const element of ELEMENTS) {
      atoms[element] += (species.atoms[element] ?? 0) * count;
    }
    charge += species.charge * count;
  }
  return { atoms, charge };
}

export function balanceProblems(equation: BalancedEquation): string[] {
  const problems: string[] = [];
  let left: Tally;
  let right: Tally;
  try {
    left = tally(equation.left);
    right = tally(equation.right);
  } catch (error) {
    return [`${equation.id}: ${error instanceof Error ? error.message : "tally failed"}`];
  }
  for (const element of ELEMENTS) {
    if (left.atoms[element] !== right.atoms[element]) {
      problems.push(`${equation.id} ${element}: ${left.atoms[element]} ≠ ${right.atoms[element]}`);
    }
  }
  if (left.charge !== right.charge) {
    problems.push(`${equation.id} charge: ${left.charge} ≠ ${right.charge}`);
  }
  if (!equation.reading.trim() || equation.reading.includes("\n")) {
    problems.push(`${equation.id} needs a one-line reading`);
  }
  return problems;
}

export function equationsFor(sceneId: SceneId): BalancedEquation[] {
  return SCENE_EQUATIONS[sceneId];
}
