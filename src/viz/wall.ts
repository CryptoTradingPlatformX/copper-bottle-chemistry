import { COLORS, drawAtom, drawOxygen, drawWater, halo, labelPill, letter, microscope } from "./draw";
import { contain, grid, integrate, makeMolecule, separate, type Molecule, type Viz } from "./types";

interface WallState {
  waters: Molecule[];
  oxygen: Molecule;
  electrons: Molecule[];
  w: number;
  h: number;
}

function build(w: number, h: number): WallState {
  const points = grid(w < 520 ? 8 : 12, w, h, h * 0.12, h * 0.48);
  const electrons: Molecule[] = [];
  for (let i = 0; i < (w < 520 ? 18 : 28); i++) {
    electrons.push(makeMolecule(w * (0.08 + ((i * 0.17) % 0.84)), h * (0.62 + (i % 5) * 0.06), i));
  }
  return {
    waters: points.map((p, i) => makeMolecule(p.x, p.y, i)),
    oxygen: makeMolecule(w * 0.3, h * 0.28, 2),
    electrons,
    w,
    h,
  };
}

function lattice(w: number, h: number): { x: number; y: number; surface: boolean }[] {
  const spacing = Math.min(42, w / 8);
  const cols = Math.floor((w - 24) / spacing);
  const surfaceY = h * 0.56;
  const rows = Math.max(2, Math.floor((h - surfaceY - 16) / (spacing * 0.86)));
  const points = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({
        x: 20 + c * spacing + (r % 2 ? spacing / 2 : 0),
        y: surfaceY + r * spacing * 0.86,
        surface: r === 0,
      });
    }
  }
  return points;
}

export const wallViz: Viz<WallState> = {
  create: build,
  resize(state, w, h) {
    const sx = w / state.w;
    const sy = h / state.h;
    for (const m of [...state.waters, state.oxygen, ...state.electrons]) {
      m.x *= sx;
      m.y *= sy;
    }
    state.w = w;
    state.h = h;
  },
  tick(state, input) {
    const flow = input.sloshed ? Math.sin(input.time * 1.2) * 46 : 0;
    for (const water of state.waters) {
      integrate(water, input.dt, input.sloshed ? 40 : 58);
      water.x += flow * input.dt;
      contain(water, 0, 0, input.w, input.h * 0.52, 18);
    }
    separate(state.waters, 54);
    for (const water of state.waters) contain(water, 0, 0, input.w, input.h * 0.52, 18);
    integrate(state.oxygen, input.dt, 36);
    state.oxygen.x += flow * input.dt;
    contain(state.oxygen, 0, 0, input.w, input.h * 0.5, 20);
    for (const electron of state.electrons) {
      integrate(electron, input.dt, 90);
      contain(electron, 0, input.h * 0.54, input.w, input.h, 8);
    }
  },
  draw(ctx, state, input) {
    microscope(ctx, input.w, input.h);
    const atoms = lattice(input.w, input.h);
    const surfaceY = input.h * 0.56;
    ctx.fillStyle = "rgba(180, 96, 52, 0.18)";
    ctx.fillRect(0, surfaceY - 8, input.w, input.h);
    const ox = input.sloshed ? Math.sin(input.time * 1.2) * 16 : 0;

    for (const water of state.waters) drawWater(ctx, water.x + ox, water.y, water.angle, 0.9);
    halo(ctx, state.oxygen.x + ox, state.oxygen.y, 22, "rgba(243,212,138,0.16)");
    drawOxygen(ctx, state.oxygen.x + ox, state.oxygen.y, state.oxygen.angle, 0.9);

    for (const atom of atoms) {
      drawAtom(ctx, atom.x, atom.y, atom.surface ? 15 : 13, atom.surface && input.step >= 1 ? "#f0b56d" : COLORS.cu);
      if (atom.surface) letter(ctx, atom.x, atom.y, "Cu", "#3a2416", 9);
    }
    for (const electron of state.electrons) {
      drawAtom(ctx, electron.x, electron.y, 3.4, COLORS.electron);
    }

    if (input.step >= 1) {
      ctx.strokeStyle = "rgba(255, 236, 210, 0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(12, surfaceY - 16);
      ctx.lineTo(input.w - 12, surfaceY - 16);
      ctx.stroke();
      ctx.setLineDash([]);
      labelPill(ctx, input.w * 0.5, surfaceY - 36, "Reaction only along this surface", { w: input.w, h: input.h });
    }
    if (input.step === 0) labelPill(ctx, input.w * 0.5, 24, "Shared electrons move through the metal", { w: input.w, h: input.h });
    if (input.step >= 2) {
      labelPill(
        ctx,
        input.w * 0.5,
        24,
        input.sloshed ? "Sloshing moves the bulk" : "Still bottle, molecules still move",
        { w: input.w, h: input.h },
      );
    }
  },
};
