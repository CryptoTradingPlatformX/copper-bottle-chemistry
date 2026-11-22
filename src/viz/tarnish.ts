import { COLORS, drawAtom, drawCO2, drawMolecule, drawOxygen, drawWater, labelPill, letter, roundRect } from "./draw";
import { progress, type Viz } from "./types";

interface TarnishState {
  w: number;
  h: number;
}

export const tarnishViz: Viz<TarnishState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced } = input;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#d5ecee");
    sky.addColorStop(0.42, "#8fb8c4");
    sky.addColorStop(1, "#1d3338");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const u = reduced ? 1 : progress(time, 1.6);
    const left = w * 0.1;
    const right = w * 0.68;
    const base = h * 0.84;
    const metalTop = h * 0.56;
    const cu2o = step >= 1 ? (step === 1 ? 10 + 12 * u : 22) : 0;
    const cuo = step >= 2 ? (step === 2 ? 6 + 10 * u : 16) : 0;
    const patina = step >= 3 ? 8 + 16 * u : 0;

    roundRect(ctx, left, metalTop, right - left, base - metalTop, 16);
    const metal = ctx.createLinearGradient(left, metalTop, right, base);
    metal.addColorStop(0, "#f0c09a");
    metal.addColorStop(0.5, "#d4844c");
    metal.addColorStop(1, "#8d4a2b");
    ctx.fillStyle = metal;
    ctx.fill();

    const stackTop = metalTop - cu2o - cuo - patina;
    if (cu2o) {
      ctx.fillStyle = COLORS.cu2o;
      ctx.fillRect(left, metalTop - cu2o - cuo - patina, right - left, cu2o);
    }
    if (cuo) {
      ctx.fillStyle = COLORS.cuo;
      ctx.fillRect(left, metalTop - cuo - patina, right - left, cuo);
    }
    if (patina) {
      ctx.fillStyle = COLORS.patina;
      roundRect(ctx, left, stackTop, right - left, patina, 10);
      ctx.fill();
    }

    for (let i = 0; i < 5; i++) {
      const x = left + 24 + i * ((right - left - 36) / 4);
      drawAtom(ctx, x, metalTop + 28, 11, COLORS.cu);
      letter(ctx, x, metalTop + 28, "Cu", "#3a2416", 8);
    }

    if (step === 0) {
      drawOxygen(ctx, w * 0.38, h * 0.18, 0.2, 0.8);
      labelPill(ctx, w * 0.4, h * 0.08, "Bare copper metal", { w, h });
    }
    if (step === 1) {
      drawOxygen(ctx, w * 0.4, stackTop - 30, time * 0.4, 0.85);
      labelPill(ctx, w * 0.42, h * 0.12, "Cu₂O, reddish brown", { w, h });
    }
    if (step === 2) {
      drawOxygen(ctx, w * 0.36, stackTop - 28, 0.6, 0.8);
      labelPill(ctx, w * 0.42, h * 0.12, "CuO, black", { w, h });
    }
    if (step >= 3) {
      drawCO2(ctx, w * 0.16, Math.max(28, stackTop - 78), 0.4, 0.5);
      drawWater(ctx, w * 0.16, Math.max(78, stackTop - 36), 0.2, 0.55);
      drawMolecule(ctx, "patina", w * 0.42, Math.max(78, stackTop - 46), {
        scale: w < 520 ? 0.48 : 0.58,
        mode: input.detail,
        caption: "Cu₂(OH)₂CO₃",
        ink: "dark",
      });
    }

    const swatch = (y: number, color: string, text: string, on: boolean) => {
      ctx.fillStyle = color;
      roundRect(ctx, w * 0.74, y, 18, 18, 5);
      ctx.fill();
      if (on) {
        ctx.strokeStyle = "#1b2428";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = on ? "#1c2428" : "#4d453f";
      ctx.font = `${on ? 700 : 600} ${w < 460 ? 12 : 13}px "Atkinson Hyperlegible", sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w * 0.74 + 24, y + 9);
    };
    swatch(h * 0.16, "#e39b5b", "Metal", step === 0);
    swatch(h * 0.16 + 28, COLORS.cu2o, "Cu₂O", step === 1);
    swatch(h * 0.16 + 56, "#3a342e", "CuO", step === 2);
    swatch(h * 0.16 + 84, COLORS.patina, "Patina", step >= 3);

    labelPill(ctx, (left + right) / 2, base + 8, "What you see is the top layer", { w, h });
  },
};
