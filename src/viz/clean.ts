import { COLORS, drawAtom, drawMolecule, labelPill, letter, roundRect } from "./draw";
import { progress, type Viz } from "./types";

interface CleanState {
  w: number;
  h: number;
}

export const cleanViz: Viz<CleanState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced } = input;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#f4efe4");
    bg.addColorStop(1, "#d5ebe6");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const u = reduced ? 1 : progress(time, 3.2);
    const dissolve = step === 2 ? u : step === 1 ? u * 0.45 : u * 0.25;
    const columns = [
      { color: COLORS.cu2o, name: "Brown" },
      { color: COLORS.cuo, name: "Black" },
      { color: COLORS.patina, name: "Green" },
    ];
    const gap = w / 4;
    columns.forEach((column, index) => {
      const x = gap * (index + 0.55);
      const metalTop = h * 0.58;
      const film = (1 - dissolve) * 34;
      ctx.fillStyle = "#d4844c";
      roundRect(ctx, x, metalTop, gap * 0.7, h * 0.28, 12);
      ctx.fill();
      if (film > 1) {
        ctx.fillStyle = column.color;
        roundRect(ctx, x, metalTop - film, gap * 0.7, film, 8);
        ctx.fill();
      }
      ctx.fillStyle = "#2a2420";
      ctx.font = `600 ${w < 460 ? 11 : 13}px "Atkinson Hyperlegible", sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(column.name, x + gap * 0.35, h * 0.92);
      if (dissolve > 0.5) {
        drawAtom(ctx, x + gap * 0.35, metalTop - 20 - index * 8, 7, COLORS.ion);
      }
    });

    ctx.fillStyle = "#f0d34a";
    ctx.beginPath();
    ctx.ellipse(w * 0.18, h * 0.22, 34, 24, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dce7a4";
    ctx.beginPath();
    ctx.ellipse(w * 0.18, h * 0.22, 10, 20, 0.6, 0, Math.PI * 2);
    ctx.fill();

    const citricScale = Math.min(w < 520 ? 0.42 : 0.5, (w * 0.62) / 250);
    drawMolecule(ctx, "citric", w * (step === 0 ? 0.64 : 0.28), h * 0.2, {
      scale: citricScale,
      mode: input.detail,
      caption: "Citric acid, C₆H₈O₇",
      ink: "dark",
    });
    if (step >= 1) {
      for (let i = 0; i < 4; i++) {
        const x = w * (0.42 + i * 0.1);
        drawAtom(ctx, x, h * 0.18 + (i % 2) * 16, 9, COLORS.cl);
        letter(ctx, x, h * 0.18 + (i % 2) * 16, "Cl", "#10241c", 8);
      }
      labelPill(ctx, w * 0.62, h * 0.38, step === 1 ? "Chloride helps it dissolve" : "All three films come off", { w, h });
    }
  },
};
