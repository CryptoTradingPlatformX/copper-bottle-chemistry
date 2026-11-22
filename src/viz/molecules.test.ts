import { describe, expect, it } from "vitest";
import {
  HYDRATION_LIGANDS,
  MOLECULES,
  countAtoms,
  parseFormula,
  representedCounts,
  type AtomElement,
} from "./molecules";

const ALL = Object.values(MOLECULES);

describe("drawn molecules", () => {
  it("matches every sketch to its formula, hydrogen included", () => {
    for (const molecule of ALL) {
      expect(countAtoms(molecule.atoms), molecule.id).toEqual(parseFormula(molecule.formula));
    }
  });

  it("keeps the same atom count when simplified labels stand in for hydrogens", () => {
    for (const molecule of ALL) {
      const formula = parseFormula(molecule.formula);
      expect(representedCounts(molecule.id, "all"), `${molecule.id} all`).toEqual(formula);
      expect(representedCounts(molecule.id, "simplified"), `${molecule.id} simplified`).toEqual(formula);
    }
  });

  it("only folds hydrogens into labels, and only onto an atom that is still drawn", () => {
    for (const molecule of ALL) {
      const ids = new Set(molecule.atoms.map((atom) => atom.id));
      for (const atom of molecule.atoms) {
        if (!atom.host) continue;
        expect(atom.element, atom.id).toBe("H");
        expect(ids.has(atom.host), atom.host).toBe(true);
      }
      for (const [host, label] of Object.entries(molecule.simplifiedLabels ?? {})) {
        const hosted = molecule.atoms.filter((atom) => atom.host === host);
        const fromLabel = label.replace(/₂/g, "2").match(/H(\d*)/g)?.reduce((sum, part) => {
          const digits = part.slice(1);
          return sum + (digits ? Number(digits) : 1);
        }, 0);
        expect(hosted.length, `${molecule.id} ${host}`).toBe(fromLabel ?? 0);
        expect(hosted.every((atom) => atom.element === "H")).toBe(true);
      }
    }
  });

  it("builds the hydration shell from six complete waters", () => {
    const water = parseFormula(MOLECULES.h2o.formula);
    const shell: Record<AtomElement, number> = { H: 0, O: 0, Cu: 1, C: 0, Cl: 0 };
    (Object.keys(water) as AtomElement[]).forEach((element) => {
      shell[element] += water[element] * HYDRATION_LIGANDS;
    });
    expect(water.H).toBe(2);
    expect(shell).toEqual(parseFormula("[Cu(H2O)6]"));
    expect(parseFormula("Cu2(OH)2CO3")).toEqual(countAtoms(MOLECULES.patina.atoms));
    expect(parseFormula("C6H8O7")).toEqual(countAtoms(MOLECULES.citric.atoms));
  });
});
