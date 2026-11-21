export interface Source {
  title: string;
  detail: string;
  href: string;
}

export const SOURCES: Source[] = [
  {
    title: "U.S. EPA, Lead and Copper Rule",
    detail:
      "Copper action level 1.3 mg/L, as the 90th percentile of tap samples. 40 CFR §141.80(c). The rule is about corrosion control in public water systems.",
    href: "https://www.epa.gov/dwreginfo/lead-and-copper-rule",
  },
  {
    title: "Electronic Code of Federal Regulations, 40 CFR §141.80",
    detail: "The regulatory text for the lead and copper action levels.",
    href: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-D/part-141/subpart-I#p-141.80(c)",
  },
  {
    title: "World Health Organization, copper chemical fact sheet (2022 compilation)",
    detail:
      "Guideline value 2 mg/L, set against acute gastrointestinal effects, with room under the 10 mg/day upper intake. Notes staining above 1 mg/L and bitter taste above about 2.5 mg/L.",
    href: "https://cdn.who.int/media/docs/default-source/wash-documents/water-safety-and-quality/chemical-fact-sheets-2022/copper-fact-sheet-2022.pdf",
  },
  {
    title: "WHO, Copper in Drinking-water",
    detail: "Background document for the drinking-water guideline, including corrosion of copper plumbing.",
    href: "https://cdn.who.int/media/docs/default-source/wash-documents/wash-chemicals/copper.pdf",
  },
  {
    title: "NIH Office of Dietary Supplements, Copper — Health Professional Fact Sheet",
    detail:
      "Adult RDA 900 micrograms (0.9 mg), upper limit 10 mg, food sources, average intakes, ceruloplasmin, biliary excretion, and Wilson disease.",
    href: "https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/",
  },
  {
    title: "Institute of Medicine, Dietary Reference Intakes, copper chapter",
    detail:
      "RDA 900 μg/day and UL 10 mg/day for adults. Describes ceruloplasmin, cytochrome c oxidase, copper/zinc superoxide dismutase, and biliary excretion.",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK222312/",
  },
  {
    title: "U.S. EPA, Optimal Corrosion Control Treatment Evaluation Technical Recommendations",
    detail:
      "Well-aerated water typically holds about 8 or 9 mg/L dissolved oxygen, and dissolved oxygen affects copper corrosion. Copper scales commonly include cuprite (Cu₂O), tenorite (CuO), and malachite (Cu₂(OH)₂CO₃).",
    href: "https://www.epa.gov/sites/default/files/2019-07/documents/occtmarch2016updated.pdf",
  },
  {
    title: "Grass, Rensing, and Solioz, Metallic Copper as an Antimicrobial Surface",
    detail:
      "Applied and Environmental Microbiology, 2011. Review of contact killing on copper surfaces: membrane damage, oxidative stress, and prior EPA registration of copper alloys as antimicrobial materials.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3067274/",
  },
  {
    title: "Sudha and colleagues, storing drinking-water in copper pots",
    detail:
      "Journal of Health, Population and Nutrition, 2012. Laboratory study of bacteria added to water kept in copper pots. It is not a method for treating unsafe water.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3312355/",
  },
  {
    title: "Human CTR1 review",
    detail:
      "CTR1 (SLC31A1) is the high-affinity copper importer. The NIH fact sheet describes intestinal absorption and ceruloplasmin; the transporter's name and role are reviewed in the cell-biology literature.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12731240/",
  },
];

export const DISCLAIMER =
  "This is an educational picture of chemistry. It is not medical, nutritional, or water-safety advice, and it cannot tell you the copper level in your bottle. Acidic drinks do not belong in bare copper. People with a disorder of copper handling, including Wilson disease, should follow their clinician. Drink water that is already safe.";
