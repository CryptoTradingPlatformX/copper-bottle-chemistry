import { illustrativeCopperMgPerL } from "../lib/chemistry";
import { COLORS, drawAtom, drawWater, halo, labelPill, letter } from "./draw";
import { bob, type Viz } from "./types";

interface LeachState {
  w: number;
  h: number;
}

const VERTS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export const leachingViz: Viz<LeachState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced, acidic, hours } = input;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    if (acidic && step >= 3) {
      bg.addColorStop(0, "#3d5a3a");
      bg.addColorStop(1, "#1c3330");
    } else {
      bg.addColorStop(0, "#245866");
      bg.addColorStop(1, "#12303a");
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const wallX = w * 0.12;
    for (let i = 0; i < 4; i++) {
      drawAtom(ctx, wallX, h * 0.3 + i * 28, 12, COLORS.cu);
      letter(ctx, wallX, h * 0.3 + i * 28, "Cu", "#3a2416", 8);
    }

    const cx = w * 0.56;
    const cy = h * 0.46;
    const leave = step === 0 && !reduced ? Math.min(1, time / 1.4) : 1;
    const ionX = wallX + 22 + (cx - wallX - 22) * leave;
    const ionY = h * 0.42 + (cy - h * 0.42) * leave;
    const rot = reduced ? 0.6 : time * 0.55;
    const reach = Math.min(w, h) * 0.2;

    if (leave > 0.85 && step >= 1) {
      const placed = VERTS.map(([x, y, z]) => {
        const xr = x * Math.cos(rot) - z * Math.sin(rot);
        const zr = x * Math.sin(rot) + z * Math.cos(rot);
        const perspective = 0.82 / (1.15 + zr * 0.35);
        return {
          x: cx + xr * reach * perspective,
          y: cy + y * reach * perspective + (reduced ? 0 : bob(time, 2)),
          z: zr,
          scale: perspective,
          out: Math.atan2(y, xr),
        };
      }).sort((a, b) => a.z - b.z);

      for (const water of placed) {
        if (water.z > -0.05) continue;
        drawWater(ctx, water.x, water.y, water.out, 0.62 * water.scale + 0.25);
      }
      halo(ctx, cx, cy, 26, "rgba(120, 190, 230, 0.25)");
      drawAtom(ctx, cx, cy, 18, COLORS.ion);
      letter(ctx, cx, cy, "Cu", "#f5fbff", 11);
      letter(ctx, cx + 18, cy - 16, "2+", "#f5fbff", 13);
      for (const water of placed) {
        if (water.z <= -0.05) continue;
        drawWater(ctx, water.x, water.y, water.out, 0.62 * water.scale + 0.25);
      }
      if (step >= 1) labelPill(ctx, cx, cy + reach + 28, "Oxygen points inward", { w, h });
    } else {
      halo(ctx, ionX, ionY, 20, "rgba(120, 190, 230, 0.2)");
      drawAtom(ctx, ionX, ionY, 16, COLORS.ion);
      letter(ctx, ionX, ionY, "Cu", "#f5fbff", 10);
      letter(ctx, ionX + 16, ionY - 14, "2+", "#f5fbff", 12);
      labelPill(ctx, w * 0.62, h * 0.16, "Cu²⁺ leaves the wall", { w, h });
    }

    const showCrowd = step >= 2;
    if (showCrowd) {
      const mg = illustrativeCopperMgPerL(hours, acidic ? "acid" : "water");
      const cap = acidic ? 9 : 4;
      const maxMg = acidic ? 2.7 : 0.42;
      const extras = Math.round((mg / maxMg) * cap);
      for (let i = 0; i < extras; i++) {
        const x = w * (0.28 + (i % 5) * 0.13);
        const y = h * (0.72 + Math.floor(i / 5) * 0.12);
        drawAtom(ctx, x, y, 8, COLORS.ion);
      }
      labelPill(
        ctx,
        w * 0.5,
        22,
        acidic ? "Acidic drink: many more ions" : "Plain water: a slow trickle",
        { w, h },
      );
    }

    if (acidic && step >= 3) {
      ctx.fillStyle = "#f2d15a";
      ctx.beginPath();
      ctx.ellipse(w * 0.86, h * 0.78, 22, 16, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d7e38a";
      ctx.beginPath();
      ctx.ellipse(w * 0.86, h * 0.78, 8, 14, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
