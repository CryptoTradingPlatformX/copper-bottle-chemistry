import { describe, expect, it } from "vitest";
import {
  COPPER_INTAKE_MEN_MG,
  COPPER_INTAKE_WOMEN_MG,
  COPPER_RDA_MG,
  COPPER_UL_MG,
  DISSOLVED_OXYGEN_EXAMPLE_MG_L,
  EPA_COPPER_ACTION_LEVEL_MG_L,
  HYDRATION_WATERS,
  WHO_COPPER_GUIDELINE_MG_L,
  formatCount,
  halfReactionsBalance,
  illustrativeCopperMgPerL,
  overallReactionIsBalanced,
  plainWaterBand,
  waterMoleculesPerDissolvedOxygen,
} from "./chemistry";
import { SCENES } from "../content/scenes";
import { SOURCES } from "../content/sources";
import { VIZ_IDS } from "../viz/registry";

describe("dissolved oxygen ratio", () => {
  it("is about one O2 per 200,000 waters at room temperature", () => {
    const mid = waterMoleculesPerDissolvedOxygen(DISSOLVED_OXYGEN_EXAMPLE_MG_L);
    expect(mid).toBeGreaterThan(190_000);
    expect(mid).toBeLessThan(230_000);
    const coldSide = waterMoleculesPerDissolvedOxygen(9);
    const warmSide = waterMoleculesPerDissolvedOxygen(8);
    expect(coldSide).toBeGreaterThan(180_000);
    expect(warmSide).toBeLessThan(240_000);
    expect(coldSide).toBeLessThan(mid);
    expect(warmSide).toBeGreaterThan(mid);
  });

  it("formats the example count with commas", () => {
    expect(formatCount(waterMoleculesPerDissolvedOxygen(8.5))).toMatch(/^2\d{2},\d{3}$/);
  });
});

describe("reference limits", () => {
  it("locks the public numbers used in the captions", () => {
    expect(EPA_COPPER_ACTION_LEVEL_MG_L).toBe(1.3);
    expect(WHO_COPPER_GUIDELINE_MG_L).toBe(2);
    expect(COPPER_RDA_MG).toBe(0.9);
    expect(COPPER_UL_MG).toBe(10);
    expect(COPPER_INTAKE_WOMEN_MG).toBe(1.1);
    expect(COPPER_INTAKE_MEN_MG).toBe(1.4);
    expect(HYDRATION_WATERS).toBe(6);
  });
});

describe("oxidation accounting", () => {
  it("balances electrons and atoms", () => {
    expect(halfReactionsBalance()).toBe(true);
    expect(overallReactionIsBalanced()).toBe(true);
  });
});

describe("illustrative leaching sketch", () => {
  it("keeps plain water under 1 mg/L and lets acid cross both lines", () => {
    expect(illustrativeCopperMgPerL(0, "water")).toBe(0);
    expect(illustrativeCopperMgPerL(16, "water")).toBeLessThan(1);
    expect(illustrativeCopperMgPerL(16, "water")).toBeLessThan(EPA_COPPER_ACTION_LEVEL_MG_L);
    expect(illustrativeCopperMgPerL(8, "acid")).toBeGreaterThan(WHO_COPPER_GUIDELINE_MG_L);
    for (const hours of [1, 4, 8, 12, 16]) {
      expect(illustrativeCopperMgPerL(hours, "acid")).toBeGreaterThan(
        illustrativeCopperMgPerL(hours, "water"),
      );
      expect(illustrativeCopperMgPerL(hours, "water")).toBeGreaterThan(
        illustrativeCopperMgPerL(hours - 1, "water"),
      );
      const band = plainWaterBand(hours);
      expect(band.low).toBeLessThanOrEqual(illustrativeCopperMgPerL(hours, "water"));
      expect(band.high).toBeGreaterThan(illustrativeCopperMgPerL(hours, "water"));
      expect(band.high).toBeLessThan(1);
    }
  });
});

describe("story content", () => {
  it("has a visualization and at least three captioned steps per scene", () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([...VIZ_IDS]);
    for (const scene of SCENES) {
      expect(scene.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of scene.steps) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.caption.length).toBeGreaterThan(40);
      }
    }
  });

  it("covers the chemistry the tour promises", () => {
    const text = SCENES.flatMap((scene) =>
      scene.steps.map((step) => `${step.title} ${step.caption} ${step.note ?? ""}`),
    )
      .join("\n")
      .toLowerCase();
    for (const phrase of [
      "hydrogen bond",
      "200,000",
      "diffusion",
      "lattice",
      "2cu + o₂ + 4h⁺",
      "carbonic acid",
      "[cu(h₂o)₆]²⁺",
      "1.3 mg/l",
      "2 mg/l",
      "cu₂o",
      "cuo",
      "cu₂(oh)₂co₃",
      "oligodynamic",
      "ctr1",
      "ceruloplasmin",
      "cytochrome c oxidase",
      "sod1",
      "bile",
      "chelate",
      "wilson",
    ]) {
      expect(text).toContain(phrase);
    }
  });

  it("cites the primary public sources", () => {
    const hrefs = SOURCES.map((source) => source.href).join(" ");
    expect(hrefs).toContain("epa.gov");
    expect(hrefs).toContain("who.int");
    expect(hrefs).toContain("ods.od.nih.gov");
    expect(SOURCES.length).toBeGreaterThanOrEqual(6);
  });
});
