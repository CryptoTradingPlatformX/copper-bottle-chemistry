import { COLORS, drawAtom, drawCO2, drawOxygen, drawWater, labelPill, letter, microscope } from "./draw";
import { bob, progress, type Viz } from "./types";

interface OxState {
  w: number;
  h: number;
}

function copperRow(w: number, y: number, n: number) {
  const gap = Math.min(48, (w - 40) / n);
  const start = w / 2 - ((n - 1) * gap) / 2;
  return Array.from({ length: n }, (_, i) => ({ x: start + i * gap, y, hot: i === Math.floor(n / 2) - 1 || i === Math.floor(n / 2) }));
}

export const oxidationViz: Viz<OxState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced } = input;
    microscope(ctx, w, h);
    const u = reduced ? 1 : progress(time, 3.4);
    const idle = reduced ? 0 : bob(time, 3);
    const surface = h * 0.68;
    const row = copperRow(w, surface + Math.min(36, h * 0.08), w < 460 ? 5 : 7);
    const hot = row.filter((atom) => atom.hot);
    const targetX = w * 0.5;
    const o2y = step === 0 ? h * 0.3 + (surface - h * 0.46) * u : surface - 52 + idle;

    ctx.globalAlpha = 0.45;
    drawWater(ctx, w * 0.18, h * 0.28 + idle, 0.4, 0.75);
    drawWater(ctx, w * 0.82, h * 0.34 - idle, 1.4, 0.75);
    drawWater(ctx, w * 0.22, h * 0.5, 2.1, 0.7);
    ctx.globalAlpha = 1;

    const film = step >= 3 ? u : 0;
    if (film > 0) {
      ctx.fillStyle = COLORS.cu2o;
      ctx.fillRect(0, surface - 8 - 10 * film, w, 10 * film + 8);
    }

    for (const atom of row) {
      const rising = atom.hot && step >= 1 ? 18 * (step === 1 ? u : 1) : 0;
      const color = atom.hot && step >= 1 && u > 0.45 ? COLORS.ion : COLORS.cu;
      drawAtom(ctx, atom.x, atom.y - rising, 16, color);
      letter(ctx, atom.x, atom.y - rising, "Cu", color === COLORS.ion ? "#f7fbff" : "#3a2416", 10);
      if (atom.hot && step >= 1 && u > 0.45) {
        letter(ctx, atom.x + 16, atom.y - rising - 12, "2+", "#f7fbff", 12);
      }
    }
    const lower = copperRow(w, surface + Math.min(78, h * 0.18), w < 460 ? 5 : 7);
    for (const atom of lower) {
      drawAtom(ctx, atom.x + 12, atom.y, 13, COLORS.cuDeep);
    }

    const showProducts = step >= 2 && u > 0.62;
    if (!showProducts) {
      drawOxygen(ctx, targetX, o2y, 0.4 + time * 0.3, 1.05);
    } else {
      drawWater(ctx, targetX - 28, o2y + idle, -0.6, 0.95);
      drawWater(ctx, targetX + 30, o2y - idle, 0.8, 0.95);
    }

    if (step >= 1) {
      hot.forEach((atom, index) => {
        for (let e = 0; e < 2; e++) {
          const startX = atom.x + (e === 0 ? -6 : 6);
          const startY = atom.y - 10;
          const endX = targetX + (index === 0 ? -10 : 10) + (e === 0 ? -6 : 6);
          const endY = o2y + 8;
          const t = step === 1 ? u : 1;
          drawAtom(ctx, startX + (endX - startX) * t, startY + (endY - startY) * t, 3.5, COLORS.electron);
        }
      });
    }

    if (step >= 2 && !showProducts) {
      const protons = [
        { x: w * 0.12, y: h * 0.22 },
        { x: w * 0.88, y: h * 0.2 },
        { x: w * 0.16, y: h * 0.48 },
        { x: w * 0.84, y: h * 0.46 },
      ];
      protons.forEach((proton) => {
        const x = proton.x + (targetX - proton.x) * u;
        const y = proton.y + (o2y - proton.y) * u;
        drawAtom(ctx, x, y, 8, COLORS.h);
        letter(ctx, x, y, "H", "#3a342e", 9);
        letter(ctx, x + 10, y - 10, "+", "#fffaf6", 11);
      });
    }

    if (step >= 3) {
      drawWater(ctx, w * 0.16, h * 0.16, 0.2, 0.72);
      drawAtom(ctx, w * 0.16 + 20, h * 0.1, 7, COLORS.h);
      letter(ctx, w * 0.16 + 20, h * 0.1, "H", "#3a342e", 8);
      labelPill(ctx, w * 0.18, h * 0.28, "A little H⁺ from water", { w, h });
      drawCO2(ctx, w * 0.82, h * 0.16, 0.1, 0.7);
      labelPill(ctx, w * 0.78, h * 0.28, "CO₂ makes a weak acid", { w, h });
      if (film > 0.4) labelPill(ctx, w * 0.5, surface - 28, "Oxide film on the metal", { w, h });
    } else if (step === 0) {
      labelPill(ctx, w * 0.5, 22, "Dissolved oxygen reaches copper", { w, h });
    } else if (step === 1) {
      labelPill(ctx, w * 0.5, 22, "Cu → Cu²⁺ + 2e⁻, twice", { w, h });
    } else if (showProducts) {
      labelPill(ctx, w * 0.5, 22, "Two new water molecules", { w, h });
    } else {
      labelPill(ctx, w * 0.5, 22, "O₂ + 4H⁺ + 4e⁻", { w, h });
    }
  },
};
