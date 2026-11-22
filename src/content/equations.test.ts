import { describe, expect, it } from "vitest";
import { SCENES } from "./scenes";
import { SCENE_EQUATIONS, SPECIES, balanceProblems, tally } from "./equations";

const ALL = Object.values(SCENE_EQUATIONS).flat();

describe("scene equations", () => {
  it("gives every scene at least one equation", () => {
    expect(Object.keys(SCENE_EQUATIONS)).toEqual(SCENES.map((scene) => scene.id));
    for (const scene of SCENES) {
      expect(SCENE_EQUATIONS[scene.id].length).toBeGreaterThan(0);
    }
  });

  it("balances atoms and charge on every line", () => {
    expect(ALL.flatMap(balanceProblems)).toEqual([]);
  });

  it("keeps the acidic copper oxidation overall reaction", () => {
    const overall = SCENE_EQUATIONS.oxidation.find((equation) => equation.id === "overall-acid");
    expect(overall).toBeDefined();
    const left = tally(overall!.left);
    const right = tally(overall!.right);
    expect(left).toEqual({ atoms: { H: 4, O: 2, Cu: 2, C: 0, Cl: 0 }, charge: 4 });
    expect(right).toEqual({ atoms: { H: 4, O: 2, Cu: 2, C: 0, Cl: 0 }, charge: 4 });
  });

  it("checks the less obvious charges by hand", () => {
    const fenton = SCENE_EQUATIONS.germs[0];
    expect(tally(fenton.left).charge).toBe(1);
    expect(tally(fenton.right).charge).toBe(1);

    const complex = SCENE_EQUATIONS.clean.find((equation) => equation.id === "chloro-complex");
    expect(tally(complex!.right).charge).toBe(-2);
    expect(tally(complex!.left).atoms.Cl).toBe(4);

    const patina = SCENE_EQUATIONS.clean.find((equation) => equation.id === "clean-patina");
    expect(tally(patina!.left).atoms).toEqual(tally(patina!.right).atoms);
    expect(tally(patina!.left).charge).toBe(4);

    const hydration = SCENE_EQUATIONS.leach[0];
    expect(tally(hydration.left).atoms.H).toBe(12);
    expect(tally(hydration.right).atoms.O).toBe(6);
    expect(SPECIES.hexaaqua.charge).toBe(2);
  });

  it("gives each line a one-sentence reading and a known species", () => {
    for (const equation of ALL) {
      expect(equation.reading.endsWith(".")).toBe(true);
      expect(equation.reading.length).toBeLessThan(180);
      for (const term of [...equation.left, ...equation.right]) {
        expect(SPECIES[term.id]).toBeDefined();
        expect(SPECIES[term.id].plain.length).toBeGreaterThan(40);
      }
    }
  });
});
