import { COLORS, drawAtom, drawMolecule, labelPill, letter, microscope, roundRect } from "./draw";
import { bob, progress, type Viz } from "./types";

interface GermState {
  w: number;
  h: number;
}

export const germsViz: Viz<GermState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced } = input;
    microscope(ctx, w, h);
    const u = reduced ? 1 : progress(time, 2.6);
    const surface = h * 0.78;
    ctx.fillStyle = "rgba(196, 112, 58, 0.25)";
    ctx.fillRect(0, surface, w, h - surface);
    for (let i = 0; i < 8; i++) {
      drawAtom(ctx, 24 + i * ((w - 20) / 8), surface + 22, 12, COLORS.cu);
    }
    for (let i = 0; i < (step >= 1 ? 5 : 2); i++) {
      const x = w * (0.15 + i * 0.16);
      const y = surface - 10 - (1 - u) * 20 - (i % 2) * 8;
      drawAtom(ctx, x, y, 7, COLORS.ion);
      if (i === 0) letter(ctx, x, y, "Cu", "#f5fbff", 8);
    }

    const bx = w * 0.5;
    const by = h * 0.4 + (reduced ? 0 : bob(time, 3));
    const bw = Math.min(w * 0.62, 280);
    const bh = Math.min(h * 0.36, 150);

    const membraneGap = step >= 1 && u > 0.35;
    ctx.fillStyle = "rgba(186, 230, 196, 0.9)";
    roundRect(ctx, bx - bw / 2, by - bh / 2, bw, bh, bh / 2);
    ctx.fill();
    ctx.strokeStyle = membraneGap ? "#c45b4a" : "#2f6d55";
    ctx.lineWidth = 6;
    ctx.stroke();
    if (membraneGap) {
      ctx.strokeStyle = "#1a3c46";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(bx - bw * 0.28, by - bh * 0.28, 10, 0.2, 2.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + bw * 0.22, by + bh * 0.2, 12, 3.4, 5.6);
      ctx.stroke();
    }

    const enzymes = [
      { x: bx - 30, y: by - 8, broken: false },
      { x: bx + 24, y: by + 16, broken: step >= 1 },
      { x: bx - 8, y: by + 28, broken: false },
    ];
    for (const enzyme of enzymes) {
      ctx.save();
      ctx.translate(enzyme.x, enzyme.y);
      if (enzyme.broken && u > 0.55) ctx.rotate(0.5);
      ctx.fillStyle = enzyme.broken && u > 0.55 ? "#d98b7a" : "#f2d48a";
      roundRect(ctx, -16, -10, 32, 20, 8);
      ctx.fill();
      ctx.restore();
      if (enzyme.broken && u > 0.55) {
        drawAtom(ctx, enzyme.x + 18, enzyme.y - 12, 6, COLORS.ion);
      }
    }

    if (step >= 1 && u > 0.2) {
      const scale = w < 520 ? 0.58 : 0.7;
      drawMolecule(ctx, "h2o2", w * 0.82, h * 0.16, { scale, mode: input.detail, caption: "H₂O₂" });
      drawMolecule(ctx, "radical", w * 0.82, h * 0.38, { scale, mode: input.detail, caption: "•OH" });
      labelPill(ctx, w * 0.22, by, "Membrane gaps", { w, h });
      labelPill(ctx, bx + 10, by + bh * 0.42, "Enzyme bent by copper", { w, h });
    }

    if (step === 0) labelPill(ctx, w * 0.5, 24, "Copper surface meets a bacterium", { w, h });
    if (step >= 2) {
      const meter = (y: number, label: string, fill: number) => {
        ctx.fillStyle = "rgba(255,250,244,0.9)";
        roundRect(ctx, 16, y, w - 32, 28, 14);
        ctx.fill();
        ctx.fillStyle = "#c4784a";
        roundRect(ctx, 18, y + 2, (w - 36) * fill, 24, 12);
        ctx.fill();
        ctx.fillStyle = "#2a2420";
        ctx.font = `600 ${w < 460 ? 11 : 13}px "Atkinson Hyperlegible", sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 28, y + 14);
      };
      meter(h - 78, "Dry copper surface: strong", 0.92);
      meter(h - 44, "Water in a bottle: milder", 0.38);
    }
  },
};
