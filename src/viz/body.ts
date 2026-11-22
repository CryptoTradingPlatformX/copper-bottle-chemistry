import { COLORS, drawAtom, drawMolecule, labelPill, letter, roundRect } from "./draw";
import { bob, type Viz } from "./types";

interface BodyState {
  w: number;
  h: number;
}

export const bodyViz: Viz<BodyState> = {
  create: () => ({ w: 1, h: 1 }),
  resize(state, w, h) {
    state.w = w;
    state.h = h;
  },
  tick() {},
  draw(ctx, _state, input) {
    const { w, h, step, time, reduced } = input;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#f7f1e8");
    bg.addColorStop(1, "#e7f3f4");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const float = reduced ? 0 : bob(time, 2);
    const wide = w >= 720;
    const cards = [
      { title: "Food", sub: "shellfish, nuts, beans" },
      { title: "Gut · CTR1", sub: "the door into cells" },
      { title: "Ceruloplasmin", sub: "carries it in blood" },
      { title: step >= 2 ? "Enzymes, then bile" : "Enzymes", sub: step >= 2 ? "energy, SOD1, extra out" : "where the body uses it" },
    ];
    const reserve = step >= 2 ? (wide ? 0 : 108) : 0;
    const cardW = Math.min(wide ? 180 : w - 48, 240);
    const cardH = wide ? 78 : Math.max(48, (h - 28 - reserve) / 4 - 8);
    const spots = wide
      ? cards.map((_, index) => ({ x: w * (0.14 + index * 0.24), y: h * (step >= 2 ? 0.4 : 0.52) }))
      : cards.map((_, index) => ({ x: w * 0.5, y: 12 + cardH / 2 + index * (cardH + 8) }));

    const hot = (index: number) => (step === 0 ? index === 0 : step === 1 ? index === 1 || index === 2 : index === 3);

    ctx.strokeStyle = "rgba(122, 78, 48, 0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    spots.forEach((spot, index) => {
      if (index === 0) ctx.moveTo(spot.x, spot.y);
      else ctx.lineTo(spot.x, spot.y);
    });
    ctx.stroke();

    spots.forEach((spot, index) => {
      const y = spot.y + (index === 0 ? float : 0);
      ctx.fillStyle = hot(index) ? "#fffaf4" : "rgba(255,250,244,0.78)";
      roundRect(ctx, spot.x - cardW / 2, y - cardH / 2, cardW, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = hot(index) ? "#c4784a" : "rgba(90,60,40,0.22)";
      ctx.lineWidth = hot(index) ? 3 : 1.5;
      ctx.stroke();
      ctx.fillStyle = "#2a2420";
      ctx.font = `700 ${w < 460 ? 15 : 16}px Fraunces, Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(cards[index].title, spot.x, y - 12, cardW - 16);
      ctx.font = `500 ${w < 460 ? 12 : 13}px "Atkinson Hyperlegible", sans-serif`;
      ctx.fillStyle = "#5c5148";
      ctx.fillText(cards[index].sub, spot.x, y + 12, cardW - 16);
    });

    if (wide) {
      const food = spots[0];
      drawAtom(ctx, food.x, food.y - cardH / 2 - 16, 9, COLORS.cu);
      letter(ctx, food.x, food.y - cardH / 2 - 16, "Cu", "#3a2416", 8);
    }
    if (step === 0 && wide) {
      labelPill(ctx, w * 0.14, h * 0.18, "A bottle adds a little beside food", { w, h });
    }
    if (step >= 2) {
      const scale = wide ? 0.62 : 0.55;
      const y = wide ? h * 0.78 : h - 58;
      const row = [
        { id: "h2o2", caption: "H₂O₂", x: 0.2 },
        { id: "h2o", caption: "H₂O", x: 0.5 },
        { id: "superoxide", caption: "O₂•⁻", x: 0.8 },
      ] as const;
      for (const item of row) {
        drawMolecule(ctx, item.id, w * item.x, y, { scale, mode: input.detail, caption: item.caption, ink: "dark" });
      }
    }
  },
};
