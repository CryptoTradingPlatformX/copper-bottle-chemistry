export const ATOM_ELEMENTS = ["H", "O", "Cu", "C", "Cl"] as const;
export type AtomElement = (typeof ATOM_ELEMENTS)[number];
export type AtomDetail = "all" | "simplified";

export interface SketchAtom {
  id: string;
  element: AtomElement;
  x: number;
  y: number;
  /** In simplified mode this hydrogen is written on `host` instead of drawn as its own sphere. */
  host?: string;
}

export interface SketchBond {
  a: string;
  b: string;
  order?: 1 | 2;
}

export interface MoleculeSketch {
  id: string;
  /** Counts must match the atoms below. Parentheses and unicode subscripts are allowed. */
  formula: string;
  atoms: SketchAtom[];
  bonds: SketchBond[];
  /** Simplified label on a heavy atom, such as OH or CH₂. The H count in the label must match hosted hydrogens. */
  simplifiedLabels?: Record<string, string>;
  mark?: string;
}

const SUB: Record<string, string> = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};

export function emptyCounts(): Record<AtomElement, number> {
  return { H: 0, O: 0, Cu: 0, C: 0, Cl: 0 };
}

/** Element totals for a formula such as Cu2(OH)2CO3 or [Cu(H2O)6]. */
export function parseFormula(formula: string): Record<AtomElement, number> {
  const source = formula
    .replace(/[₀-₉]/g, (ch) => SUB[ch] ?? ch)
    .replace(/[•⁺⁻+−\-\s]/g, "")
    .replaceAll("[", "")
    .replaceAll("]", "");
  const counts = emptyCounts();

  function absorb(text: string, multiplier: number, origin: string): void {
    let i = 0;
    while (i < text.length) {
      if (text[i] === "(") {
        let depth = 1;
        let j = i + 1;
        while (j < text.length && depth > 0) {
          if (text[j] === "(") depth += 1;
          else if (text[j] === ")") depth -= 1;
          j += 1;
        }
        if (depth !== 0) throw new Error(`Unbalanced parentheses in ${origin}`);
        const inner = text.slice(i + 1, j - 1);
        let k = j;
        let digits = "";
        while (k < text.length && text[k] >= "0" && text[k] <= "9") {
          digits += text[k];
          k += 1;
        }
        absorb(inner, multiplier * (digits ? Number(digits) : 1), origin);
        i = k;
        continue;
      }
      const pair = text.slice(i, i + 2);
      let element: AtomElement;
      let next: number;
      if (pair === "Cu" || pair === "Cl") {
        element = pair;
        next = i + 2;
      } else if (text[i] === "H" || text[i] === "O" || text[i] === "C") {
        element = text[i] as AtomElement;
        next = i + 1;
      } else {
        throw new Error(`Cannot read ${origin} near "${text[i] ?? ""}"`);
      }
      let digits = "";
      while (next < text.length && text[next] >= "0" && text[next] <= "9") {
        digits += text[next];
        next += 1;
      }
      counts[element] += (digits ? Number(digits) : 1) * multiplier;
      i = next;
    }
  }

  absorb(source, 1, formula);
  return counts;
}

export function hydrogensInLabel(label: string): number {
  const text = label.replace(/[₀-₉]/g, (ch) => SUB[ch] ?? ch);
  let total = 0;
  for (const match of text.matchAll(/H(\d*)/g)) {
    total += match[1] ? Number(match[1]) : 1;
  }
  return total;
}

export function countAtoms(atoms: { element: AtomElement }[]): Record<AtomElement, number> {
  const counts = emptyCounts();
  for (const atom of atoms) counts[atom.element] += 1;
  return counts;
}

const h2o: MoleculeSketch = {
  id: "h2o",
  formula: "H2O",
  atoms: [
    { id: "o", element: "O", x: 0, y: 0 },
    { id: "h1", element: "H", x: Math.cos(-0.912) * 18, y: Math.sin(-0.912) * 18 },
    { id: "h2", element: "H", x: Math.cos(0.912) * 18, y: Math.sin(0.912) * 18 },
  ],
  bonds: [
    { a: "o", b: "h1" },
    { a: "o", b: "h2" },
  ],
};

const h3o: MoleculeSketch = {
  id: "h3o",
  formula: "H3O",
  mark: "+",
  atoms: [
    { id: "o", element: "O", x: 0, y: 0 },
    ...([0, 1, 2] as const).map((index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3;
      return { id: `h${index}`, element: "H" as const, x: Math.cos(angle) * 18, y: Math.sin(angle) * 18 };
    }),
  ],
  bonds: [
    { a: "o", b: "h0" },
    { a: "o", b: "h1" },
    { a: "o", b: "h2" },
  ],
};

const oh: MoleculeSketch = {
  id: "oh",
  formula: "OH",
  mark: "−",
  atoms: [
    { id: "o", element: "O", x: 0, y: 0 },
    { id: "h", element: "H", x: 18, y: 0 },
  ],
  bonds: [{ a: "o", b: "h" }],
};

const radical: MoleculeSketch = {
  id: "radical",
  formula: "OH",
  mark: "•",
  atoms: [
    { id: "o", element: "O", x: 0, y: 0 },
    { id: "h", element: "H", x: 18, y: -2 },
  ],
  bonds: [{ a: "o", b: "h" }],
};

const h2o2: MoleculeSketch = {
  id: "h2o2",
  formula: "H2O2",
  atoms: [
    { id: "h1", element: "H", x: -28, y: -8 },
    { id: "o1", element: "O", x: -12, y: 4 },
    { id: "o2", element: "O", x: 12, y: -4 },
    { id: "h2", element: "H", x: 28, y: 8 },
  ],
  bonds: [
    { a: "h1", b: "o1" },
    { a: "o1", b: "o2" },
    { a: "o2", b: "h2" },
  ],
};

const superoxide: MoleculeSketch = {
  id: "superoxide",
  formula: "O2",
  mark: "•−",
  atoms: [
    { id: "o1", element: "O", x: -12, y: 0 },
    { id: "o2", element: "O", x: 12, y: 0 },
  ],
  bonds: [{ a: "o1", b: "o2" }],
};

function carbonic(withSecondHydrogen: boolean): MoleculeSketch {
  const atoms: SketchAtom[] = [
    { id: "c", element: "C", x: 0, y: 0 },
    { id: "o2", element: "O", x: 0, y: -20 },
    { id: "oL", element: "O", x: -18, y: 14 },
    { id: "hL", element: "H", x: -32, y: 24 },
    { id: "oR", element: "O", x: 18, y: 14 },
  ];
  const bonds: SketchBond[] = [
    { a: "c", b: "o2", order: 2 },
    { a: "c", b: "oL" },
    { a: "oL", b: "hL" },
    { a: "c", b: "oR" },
  ];
  if (withSecondHydrogen) {
    atoms.push({ id: "hR", element: "H", x: 32, y: 24 });
    bonds.push({ a: "oR", b: "hR" });
  }
  return {
    id: withSecondHydrogen ? "h2co3" : "hco3",
    formula: withSecondHydrogen ? "H2CO3" : "HCO3",
    mark: withSecondHydrogen ? undefined : "−",
    atoms,
    bonds,
  };
}

const patina: MoleculeSketch = {
  id: "patina",
  formula: "Cu2(OH)2CO3",
  atoms: [
    { id: "c", element: "C", x: 0, y: 6 },
    { id: "oC", element: "O", x: 0, y: -16 },
    { id: "oL", element: "O", x: -18, y: 18 },
    { id: "oR", element: "O", x: 18, y: 18 },
    { id: "ohL", element: "O", x: -42, y: -4 },
    { id: "hL", element: "H", x: -58, y: -16 },
    { id: "ohR", element: "O", x: 42, y: -4 },
    { id: "hR", element: "H", x: 58, y: -16 },
    { id: "cuL", element: "Cu", x: -36, y: -28 },
    { id: "cuR", element: "Cu", x: 36, y: -28 },
  ],
  bonds: [
    { a: "c", b: "oC", order: 2 },
    { a: "c", b: "oL" },
    { a: "c", b: "oR" },
    { a: "ohL", b: "hL" },
    { a: "ohR", b: "hR" },
    { a: "cuL", b: "ohL" },
    { a: "cuR", b: "ohR" },
    { a: "cuL", b: "oL" },
    { a: "cuR", b: "oR" },
  ],
};

/** Citric acid, HO2CCH2C(OH)(CO2H)CH2CO2H. Eight hydrogens, none left out. */
const citric: MoleculeSketch = {
  id: "citric",
  formula: "C6H8O7",
  simplifiedLabels: {
    c2: "CH₂",
    c4: "CH₂",
    oAlc: "OH",
    o1h: "OH",
    o5h: "OH",
    o6h: "OH",
  },
  atoms: [
    { id: "c2", element: "C", x: -42, y: 0 },
    { id: "c3", element: "C", x: 0, y: 0 },
    { id: "c4", element: "C", x: 42, y: 0 },
    { id: "c1", element: "C", x: -84, y: 26 },
    { id: "c5", element: "C", x: 84, y: 26 },
    { id: "c6", element: "C", x: 0, y: 46 },
    { id: "oAlc", element: "O", x: 0, y: -34 },
    { id: "hAlc", element: "H", x: 0, y: -52, host: "oAlc" },
    { id: "h2a", element: "H", x: -42, y: -20, host: "c2" },
    { id: "h2b", element: "H", x: -58, y: 12, host: "c2" },
    { id: "h4a", element: "H", x: 42, y: -20, host: "c4" },
    { id: "h4b", element: "H", x: 58, y: 12, host: "c4" },
    { id: "o1", element: "O", x: -104, y: 46 },
    { id: "o1h", element: "O", x: -104, y: 8 },
    { id: "h1", element: "H", x: -122, y: 0, host: "o1h" },
    { id: "o5", element: "O", x: 104, y: 46 },
    { id: "o5h", element: "O", x: 104, y: 8 },
    { id: "h5", element: "H", x: 122, y: 0, host: "o5h" },
    { id: "o6", element: "O", x: 22, y: 68 },
    { id: "o6h", element: "O", x: -22, y: 68 },
    { id: "h6", element: "H", x: -38, y: 82, host: "o6h" },
  ],
  bonds: [
    { a: "c2", b: "c3" },
    { a: "c3", b: "c4" },
    { a: "c2", b: "c1" },
    { a: "c4", b: "c5" },
    { a: "c3", b: "c6" },
    { a: "c3", b: "oAlc" },
    { a: "oAlc", b: "hAlc" },
    { a: "c2", b: "h2a" },
    { a: "c2", b: "h2b" },
    { a: "c4", b: "h4a" },
    { a: "c4", b: "h4b" },
    { a: "c1", b: "o1", order: 2 },
    { a: "c1", b: "o1h" },
    { a: "o1h", b: "h1" },
    { a: "c5", b: "o5", order: 2 },
    { a: "c5", b: "o5h" },
    { a: "o5h", b: "h5" },
    { a: "c6", b: "o6", order: 2 },
    { a: "c6", b: "o6h" },
    { a: "o6h", b: "h6" },
  ],
};

export const MOLECULES: Record<string, MoleculeSketch> = {
  h2o,
  h3o,
  oh,
  radical,
  h2o2,
  superoxide,
  h2co3: carbonic(true),
  hco3: carbonic(false),
  patina,
  citric,
};

export const HYDRATION_LIGANDS = 6;

export interface VisibleAtom {
  id: string;
  element: AtomElement;
  x: number;
  y: number;
  label: string;
}

export function visibleAtoms(id: string, mode: AtomDetail): VisibleAtom[] {
  const sketch = MOLECULES[id];
  if (!sketch) throw new Error(`Unknown molecule ${id}`);
  return sketch.atoms
    .filter((atom) => mode === "all" || !atom.host)
    .map((atom) => ({
      id: atom.id,
      element: atom.element,
      x: atom.x,
      y: atom.y,
      label: mode === "simplified" ? (sketch.simplifiedLabels?.[atom.id] ?? atom.element) : atom.element,
    }));
}

export function visibleBonds(id: string, mode: AtomDetail): SketchBond[] {
  const sketch = MOLECULES[id];
  const hidden = new Set(sketch.atoms.filter((atom) => mode === "simplified" && atom.host).map((atom) => atom.id));
  return sketch.bonds.filter((bond) => !hidden.has(bond.a) && !hidden.has(bond.b));
}

/** Atoms a drawing of this molecule stands for, including hydrogens written into OH or CH₂. */
export function representedCounts(id: string, mode: AtomDetail): Record<AtomElement, number> {
  const counts = emptyCounts();
  for (const atom of visibleAtoms(id, mode)) {
    counts[atom.element] += 1;
    const labeledH = hydrogensInLabel(atom.label);
    counts.H += atom.element === "H" ? labeledH - 1 : labeledH;
  }
  return counts;
}

export function rotate(x: number, y: number, angle: number): { x: number; y: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}
