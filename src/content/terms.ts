export interface TermInfo {
  id: string;
  label: string;
  plain: string;
}

export const OXIDATION_TERMS: TermInfo[] = [
  {
    id: "cu",
    label: "Cu",
    plain: "Copper metal from the bottle wall. Only atoms at the surface, where water can reach them, take part. A 2 in front means two of those atoms.",
  },
  {
    id: "o2",
    label: "O₂",
    plain: "One molecule of oxygen that dissolved from the air. It is not the oxygen already inside H₂O. It is a separate visitor in the water.",
  },
  {
    id: "h",
    label: "H⁺",
    plain: "A hydrogen ion: hydrogen that has lost its electron and so carries a positive charge. Plain water has very few. Some come from water splitting a tiny share of itself into H⁺ and OH⁻. Others come from carbonic acid, made when carbon dioxide from air dissolves.",
  },
  {
    id: "cu2",
    label: "Cu²⁺",
    plain: "A copper ion with charge +2, because the atom gave away two electrons. This is the form that can leave the wall and drift into the water, wrapped in water molecules.",
  },
  {
    id: "h2o",
    label: "H₂O",
    plain: "Water. In this reaction, two new water molecules are assembled from oxygen, hydrogen ions, and electrons.",
  },
  {
    id: "e",
    label: "e⁻",
    plain: "An electron, the tiny negative particle copper gives up. Two copper atoms release four electrons, and the oxygen side of the trade takes all four.",
  },
];

export const LEGEND = [
  { symbol: "Cu", name: "copper", color: "#e39b5b", ink: "#3a2416" },
  { symbol: "O", name: "oxygen", color: "#ef6b57", ink: "#fffaf6" },
  { symbol: "H", name: "hydrogen", color: "#f7f4ee", ink: "#3a342e" },
  { symbol: "C", name: "carbon", color: "#4a5160", ink: "#fffaf6" },
  { symbol: "Cl", name: "chlorine", color: "#3dbe86", ink: "#10241c" },
] as const;
