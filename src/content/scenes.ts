export interface SceneStep {
  title: string;
  caption: string;
  note?: string;
}

export interface SceneContent {
  id: "zoom" | "wall" | "oxidation" | "leach" | "tarnish" | "germs" | "body" | "clean";
  short: string;
  title: string;
  steps: SceneStep[];
}

export const SCENES: SceneContent[] = [
  {
    id: "zoom",
    short: "Zoom",
    title: "Zoom in",
    steps: [
      {
        title: "The bottle",
        caption:
          "A copper bottle is mostly water inside a thin metal wall. If that inside is lined with another metal or a coating, the water never meets copper and this chemistry barely happens. The scenes after this one are about a bare copper surface.",
      },
      {
        title: "Water is molecules",
        caption:
          "Zoom in and water is not a smooth stuff. It is a crowd of molecules, each one H₂O: one oxygen atom held to two hydrogen atoms. An atom is the smallest ordinary piece of an element. The molecules tumble, bump, and briefly stick. That stick is a hydrogen bond, a weak pull between a hydrogen on one molecule and the oxygen on another.",
      },
      {
        title: "Oxygen is a visitor",
        caption:
          "The oxygen you breathe is a separate molecule, O₂, dissolved among the water. Water is not one substance written H₂O+O₂. At room temperature, well-aerated water holds about 8–9 milligrams of dissolved oxygen per liter, roughly one O₂ for every 200,000 water molecules. This picture crowds one in so you can see it.",
        note: "Colder water holds a little more dissolved oxygen. Warmer water holds less. The molecules are not parked in fixed holes.",
      },
      {
        title: "It comes from the air",
        caption:
          "Dissolved O₂ crosses in at the surface, from the air. It then wanders through gaps that open and close as water molecules move. That wandering is called diffusion. No shaking is required. A bottle sitting on the counter is already busy at this size.",
      },
    ],
  },
  {
    id: "wall",
    short: "Wall",
    title: "The copper wall",
    steps: [
      {
        title: "A shared sea of electrons",
        caption:
          "Copper metal is a lattice: a repeating pattern of copper atoms. Their outer electrons are not glued to one atom. They are shared across the whole piece, a moving sea. That shared sea is why copper conducts electricity. An electron is the tiny negative piece of an atom.",
      },
      {
        title: "Only the surface reacts",
        caption:
          "Water can react only with copper it can touch. That is the surface, a layer about one atom thick in this picture. Atoms deeper in the wall have copper neighbors, not water. The reaction is real, and it is slow.",
      },
      {
        title: "Still does not mean stopped",
        caption:
          "Leave the bottle alone. The water as a whole does not travel, but every molecule keeps jittering with heat. That random motion brings dissolved oxygen to the wall. Sloshing is extra, bulk motion. The jitter happens either way. Try the switch.",
      },
    ],
  },
  {
    id: "oxidation",
    short: "Oxidation",
    title: "Oxidation",
    steps: [
      {
        title: "Oxygen arrives",
        caption:
          "An O₂ molecule reaches the copper. The next event is an electron trade. Chemists split it into two half-reactions, the two sides of one trade. Oxidation, in this story, means copper atoms lose electrons.",
      },
      {
        title: "Copper gives electrons",
        caption:
          "Each surface copper atom can let go of two electrons and become an ion, written Cu²⁺. An ion is an atom or molecule with an electric charge. The half-reaction is Cu → Cu²⁺ + 2e⁻, and it happens twice, so two copper atoms release four electrons.",
      },
      {
        title: "Oxygen becomes water",
        caption:
          "The four electrons and four H⁺ ions turn that oxygen into two water molecules: O₂ + 4H⁺ + 4e⁻ → 2H₂O. Put together, 2Cu + O₂ + 4H⁺ → 2Cu²⁺ + 2H₂O. Tap any term to see what it is and where it came from.",
      },
      {
        title: "A thin film often forms first",
        caption:
          "The H⁺ in that equation is scarce in plain water. A little comes from water itself, which splits a tiny fraction of its molecules into H⁺ and OH⁻. More comes when carbon dioxide dissolves and makes carbonic acid, a weak acid. In neutral water, much of the copper first becomes an oxide film on the surface. Ions leave that film slowly.",
        note: "The H⁺ equation is the acidic way to count the electrons. In neutral water, oxygen often ends as hydroxide, OH⁻, a negative ion of oxygen and hydrogen. Either way, electrons leave copper and finish on oxygen.",
      },
    ],
  },
  {
    id: "leach",
    short: "Leaching",
    title: "Leaching",
    steps: [
      {
        title: "An ion steps off the wall",
        caption:
          "Some Cu²⁺ leaves the surface and enters the water. This is leaching: metal moving into the liquid as ions. Each ion drawn here stands for a huge number of real ones. Even so, next to the water around them, the amount is small.",
      },
      {
        title: "A shell of six waters",
        caption:
          "Water molecules wrap the ion immediately. Six of them settle as [Cu(H₂O)₆]²⁺, an octahedron, like two pyramids joined at the base. The oxygen end of each water points at the copper, because that end is slightly negative and the ion is positive. The pale blue is the color of this cluster when copper is concentrated. At bottle levels the water looks clear.",
      },
      {
        title: "Hours, and two comparison lines",
        caption:
          "Over hours of standing, plain water picks up more copper, usually staying well under 1 mg/L. Two lines to compare with: the U.S. EPA action level is 1.3 mg/L, and the WHO drinking-water guideline is 2 mg/L. The curves are a sketch of the pattern, not a measurement of your bottle.",
        note: "The EPA figure is the copper action level for public water systems. If the 90th percentile of tap samples exceeds it, the system must act on corrosion. It is not a law written for bottles. The WHO figure is a health guideline, set to limit stomach upset and to leave room under the 10 mg per day upper intake. Staining of sinks can start above about 1 mg/L, and a bitter taste above about 2.5 mg/L. Your water, temperature, and surface change the real number.",
      },
      {
        title: "Acid is a different story",
        caption:
          "Lemon water, vinegar, and juice bring far more H⁺. The surface reaction speeds up, and the sketch climbs past both comparison lines. Acidic drinks can taste metallic and can carry much more copper. Do not store them in bare copper.",
      },
    ],
  },
  {
    id: "tarnish",
    short: "Tarnish",
    title: "Tarnish",
    steps: [
      {
        title: "The metal underneath",
        caption:
          "Fresh copper is the warm metallic color. When a bottle looks brown, black, or green, you are usually looking at a coating that grew on top. The metal is still there, underneath.",
      },
      {
        title: "Brown is copper(I) oxide",
        caption:
          "The first film is copper(I) oxide, Cu₂O, also called cuprite. It is reddish brown. Oxygen has already combined with surface copper. The brown you see is that oxide layer, not the copper metal itself.",
      },
      {
        title: "Black is copper(II) oxide",
        caption:
          "Given more time and oxygen, some of the film becomes copper(II) oxide, CuO, also called tenorite. It looks black. It is still a layer. Wipe nothing yet: the next scene of color is green.",
      },
      {
        title: "Green patina",
        caption:
          "Water and carbon dioxide add a green or blue-green crust, basic copper carbonate, Cu₂(OH)₂CO₃, the mineral malachite. Patina means that colored crust. Stacked in time: copper metal, then brown Cu₂O, then black CuO, then green patina.",
      },
    ],
  },
  {
    id: "germs",
    short: "Germs",
    title: "Why people say it kills germs",
    steps: [
      {
        title: "A real effect with an old name",
        caption:
          "Copper ions and copper surfaces can inactivate bacteria. The name for a toxic effect from a very small dose of metal is the oligodynamic effect (oh-li-go-dye-NAM-ik). On dry copper surfaces, this contact killing is well established, including on hospital touch surfaces.",
      },
      {
        title: "Three things happen at once",
        caption:
          "Copper damages the cell membrane, the soft boundary of the cell. It helps make reactive oxygen species, unstable oxygen-containing molecules that tear at cell parts. And it sticks to enzymes, the proteins that do a cell's jobs, so those enzymes lose their shape and stop.",
      },
      {
        title: "A bottle is the modest version",
        caption:
          "In laboratory studies, water stored for many hours in a copper pot ended with fewer added bacteria. The effect in a bottle is real and modest. It is slower than contact killing on a dry surface, and it does not make unsafe water safe. Water you drink should already be safe to drink.",
      },
    ],
  },
  {
    id: "body",
    short: "Body",
    title: "Into your body",
    steps: [
      {
        title: "You need some, mostly from food",
        caption:
          "Copper is an essential nutrient. For adults the recommended amount is 0.9 mg a day, and the upper limit from food and supplements is 10 mg a day. Most of it comes from food: shellfish, liver, nuts, seeds, cocoa, and beans. In the U.S., adult women average about 1.1 mg a day from food, and men about 1.4 mg.",
      },
      {
        title: "A door, then a carrier",
        caption:
          "Cells lining the gut take copper in through a protein door called CTR1. Before it passes, copper is converted to a +1 ion. The liver loads most of the copper in blood onto a carrier protein, ceruloplasmin. When the diet is already rich in copper, the gut absorbs a smaller share.",
      },
      {
        title: "Used by enzymes, extra leaves in bile",
        caption:
          "Cytochrome c oxidase uses copper in the last step of how cells turn food energy into a form they can spend. SOD1, a copper-and-zinc enzyme, helps defuse reactive oxygen. Extra copper leaves mainly in bile, a liquid the liver sends into the gut. A bottle of plain water adds a small amount next to food. It is not a treatment.",
        note: "Example, not a measurement: 0.2 mg of copper in one liter of water is 0.2 mg, a fraction of a day's food and far under the 10 mg upper limit. Acidic drinks stored a long time can add more. People with Wilson disease cannot clear copper in the usual way and should follow their clinician, not this page.",
      },
    ],
  },
  {
    id: "clean",
    short: "Cleaning",
    title: "Cleaning with lemon and salt",
    steps: [
      {
        title: "Lemon supplies acid and a claw",
        caption:
          "Citric acid in lemon juice does two chemical jobs. It supplies H⁺, which dissolves oxide and the green crust, and the citrate left behind chelates copper. Chelate means the molecule grips a metal ion with more than one arm, like a claw, and keeps it dissolved.",
      },
      {
        title: "Salt brings chloride",
        caption:
          "Salt supplies chloride ions, Cl⁻. They form soluble partnerships with copper, so tarnish can leave the surface and enter the liquid. Acid plus chloride is why lemon and salt together lift the film. Rubbing also scrapes it loose. The picture shows the chemistry.",
      },
      {
        title: "Brown, black, and green all yield",
        caption:
          "The mix works on brown Cu₂O, black CuO, and green Cu₂(OH)₂CO₃. Under the film is copper metal again. Rinse the bottle thoroughly. The cleaning liquid now contains acid, salt, and dissolved copper, and it is not for drinking.",
      },
    ],
  },
];

export const SCENE_IDS = SCENES.map((scene) => scene.id);
