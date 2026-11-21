# Copper Bottle Chemistry

A static, mobile-friendly tour of what is happening, molecule by molecule, inside a copper water bottle. Made for people who last took chemistry a long time ago.

Live site: [https://cryptotradingplatformx.github.io/copper-bottle-chemistry/](https://cryptotradingplatformx.github.io/copper-bottle-chemistry/)

The pictures move in the browser. There is no backend and no API key. Pause a scene or step through its captions. If your device asks for reduced motion, the scenes hold still and Play walks the captions instead.

## Scenes

1. **Zoom in.** Water is H₂O molecules with hydrogen bonds. Dissolved oxygen is a separate O₂ molecule from the air, about 8–9 mg/L at room temperature, roughly one O₂ for every 200,000 water molecules. The ratio is calculated on the page.
2. **The copper wall.** A metal lattice and a shared sea of electrons. The reaction is only at the surface, and molecules keep moving in a bottle that is sitting still.
3. **Oxidation.** Cu → Cu²⁺ + 2e⁻ (twice) and O₂ + 4H⁺ + 4e⁻ → 2H₂O, overall 2Cu + O₂ + 4H⁺ → 2Cu²⁺ + 2H₂O. Each term explains itself. H⁺ comes from water’s own tiny split and from dissolved CO₂. In neutral water, surface oxides often form first.
4. **Leaching.** Hydrated [Cu(H₂O)₆]²⁺, then an illustrative sketch of concentration over hours compared with the EPA action level (1.3 mg/L) and the WHO guideline (2 mg/L). Acidic drinks are a different, faster story. The curves are a teaching sketch, not a measurement.
5. **Tarnish.** Cu₂O (reddish brown), CuO (black), then green Cu₂(OH)₂CO₃. The color you see is the film, not the metal.
6. **Germs.** The oligodynamic effect: membranes, reactive oxygen species, and enzymes. Strong on dry copper surfaces, real but modest in a bottle. Water should already be safe.
7. **Into your body.** RDA 0.9 mg/day, upper limit 10 mg/day, CTR1, ceruloplasmin, cytochrome c oxidase, SOD1, and exit in bile. Food is the main source. No treatment claims.
8. **Cleaning.** Citric acid supplies H⁺ and chelates copper; chloride helps dissolve brown, black, and green films. Rinse afterward.

Atom colors: copper, oxygen, hydrogen, carbon, chlorine, plus electrons.

## Develop

```bash
npm install
npm test
npm run dev
```

The Vite base path is `/copper-bottle-chemistry/`. Production build:

```bash
npm run build
npm run preview
```

## Deploy

GitHub Pages is configured with `build_type=workflow`. `.github/workflows/ci.yml` runs tests and `npm run build` on pull requests and on pushes to `main`. A push to `main` uploads `dist` with `actions/upload-pages-artifact` and deploys it with `actions/deploy-pages`.

## Disclaimer

This is educational, not medical, nutritional, or water-safety advice. It cannot tell you how much copper is in a particular bottle. Do not store acidic drinks in bare copper.
