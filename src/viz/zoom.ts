import { COLORS, drawMolecule, drawOxygen, drawWater, halo, labelPill, microscope, traceBottle, waterSites } from "./draw";
import { contain, grid, integrate, makeMolecule, separate, type Molecule, type Viz } from "./types";

interface ZoomState {
  waters: Molecule[];
  oxygen: Molecule;
  air: Molecule[];
  w: number;
  h: number;
}

function countFor(w: number): number {
  return w < 520 ? 14 : 22;
}

function build(w: number, h: number): ZoomState {
  const points = grid(countFor(w), w, h, h * 0.16, h * 0.9);
  return {
    waters: points.map((p, i) => makeMolecule(p.x, p.y, i)),
    oxygen: makeMolecule(w * 0.68, h * 0.46, 3),
    air: [0, 1, 2].map((i) => makeMolecule(w * (0.22 + i * 0.26), h * 0.14, i + 4)),
    w,
    h,
  };
}

function drawBottleScene(ctx: CanvasRenderingContext2D, input: { w: number; h: number; time: number; reduced: boolean }): void {
  const { w, h, time, reduced } = input;
  microscope(ctx, w, h);
  const s = Math.min(w, h);
  const cx = w * 0.5;
  const top = h * 0.08;
  const neckW = s * 0.12;
  const neckH = s * 0.18;
  const bodyW = s * 0.42;
  const bodyBottom = Math.min(h * 0.92, top + neckH + s * 0.62);
  const wave = reduced ? 0 : Math.sin(time * 2);

  ctx.save();
  ctx.translate(0, wave * 1.5);
  traceBottle(ctx, cx, top, neckW, neckH, bodyW, bodyBottom);
  const metal = ctx.createLinearGradient(cx - bodyW / 2, top, cx + bodyW / 2, bodyBottom);
  metal.addColorStop(0, "#f2c7a4");
  metal.addColorStop(0.35, "#e09a5c");
  metal.addColorStop(0.72, "#c56b3a");
  metal.addColorStop(1, "#7c3e24");
  ctx.fillStyle = metal;
  ctx.fill();
  ctx.save();
  traceBottle(ctx, cx, top, neckW, neckH, bodyW, bodyBottom);
  ctx.clip();
  const waterLine = top + neckH + (bodyBottom - top - neckH) * 0.42;
  const water = ctx.createLinearGradient(0, waterLine, 0, bodyBottom);
  water.addColorStop(0, "#d5f2f6");
  water.addColorStop(0.4, "#7ec6d6");
  water.addColorStop(1, "#2f7388");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(cx - bodyW, bodyBottom + 20);
  for (let x = cx - bodyW; x <= cx + bodyW; x += 4) {
    const y = waterLine + Math.sin(x * 0.05 + time * 2) * (reduced ? 0 : 2.4);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(cx + bodyW, bodyBottom + 20);
  ctx.fill();
  for (let i = 0; i < 7; i++) {
    const mx = cx - bodyW * 0.22 + (i % 4) * bodyW * 0.14;
    const my = waterLine + 28 + Math.floor(i / 4) * 26;
    drawWater(ctx, mx, my, i, 0.42);
  }
  ctx.restore();
  traceBottle(ctx, cx, top, neckW, neckH, bodyW, bodyBottom);
  ctx.strokeStyle = "rgba(255,248,240,0.45)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, top + 2, neckW / 2, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#f6d7be";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, top + 2, neckW / 2 - 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#1a3c46";
  ctx.fill();
  ctx.restore();

  const glassX = cx + bodyW * 0.08;
  const glassY = top + neckH + (bodyBottom - top - neckH) * 0.62;
  ctx.beginPath();
  ctx.arc(glassX, glassY, s * 0.09, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,250,244,0.9)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(glassX + s * 0.06, glassY + s * 0.06);
  ctx.lineTo(glassX + s * 0.12, glassY + s * 0.12);
  ctx.stroke();
  labelPill(ctx, w * 0.5, h * 0.05, "Bare copper, full of water", { w, h });
}

export const zoomViz: Viz<ZoomState> = {
  create: build,
  resize(state, w, h) {
    const sx = w / state.w;
    const sy = h / state.h;
    for (const m of [...state.waters, state.oxygen, ...state.air]) {
      m.x *= sx;
      m.y *= sy;
    }
    state.w = w;
    state.h = h;
  },
  tick(state, input) {
    const top = input.step >= 3 ? input.h * 0.3 : 8;
    const floor = input.step >= 1 ? input.h - (input.w < 520 ? 168 : 124) : input.h;
    for (const water of state.waters) {
      integrate(water, input.dt, 64);
      contain(water, 0, top, input.w, floor, 20);
    }
    separate(state.waters, input.w < 520 ? 48 : 58);
    for (const water of state.waters) contain(water, 0, top, input.w, floor, 20);
    if (input.step < 3) {
      integrate(state.oxygen, input.dt, 40);
      contain(state.oxygen, 0, 8, input.w, floor, 24);
    }
    for (const molecule of state.air) {
      integrate(molecule, input.dt, 30);
      contain(molecule, 0, 0, input.w, input.h * 0.28, 16);
    }
  },
  draw(ctx, state, input) {
    if (input.step === 0) {
      drawBottleScene(ctx, input);
      return;
    }
    microscope(ctx, input.w, input.h);
    if (input.step >= 3) {
      const split = input.h * 0.3;
      const air = ctx.createLinearGradient(0, 0, 0, split);
      air.addColorStop(0, "#d7eef2");
      air.addColorStop(1, "#8ecbda");
      ctx.fillStyle = air;
      ctx.fillRect(0, 0, input.w, split);
      ctx.strokeStyle = "rgba(255,250,244,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= input.w; x += 4) {
        const y = split + Math.sin(x * 0.04 + input.time * 1.4) * (input.reduced ? 0 : 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      labelPill(ctx, input.w * 0.18, 22, "Air", { w: input.w, h: input.h });
      labelPill(ctx, input.w * 0.2, split + 28, "Water", { w: input.w, h: input.h });
      for (const molecule of state.air) {
        drawOxygen(ctx, molecule.x, Math.min(molecule.y, split - 18), molecule.angle, 0.85);
      }
    }

    for (let i = 0; i < state.waters.length; i++) {
      const water = state.waters[i];
      const sites = waterSites(water.x, water.y, water.angle, 1);
      for (const hydrogen of sites.h) {
        let best: { x: number; y: number } | null = null;
        let bestDist = 46;
        for (let j = 0; j < state.waters.length; j++) {
          if (i === j) continue;
          const other = state.waters[j];
          const dist = Math.hypot(other.x - hydrogen.x, other.y - hydrogen.y);
          if (dist < bestDist) {
            bestDist = dist;
            best = other;
          }
        }
        if (best && bestDist > 22) {
          ctx.save();
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = COLORS.hbond;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(hydrogen.x, hydrogen.y);
          ctx.lineTo(best.x, best.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    for (const water of state.waters) drawWater(ctx, water.x, water.y, water.angle, 1);

    let ox = state.oxygen.x;
    let oy = state.oxygen.y;
    const bandTop = input.h - (input.w < 520 ? 168 : 124);
    if (input.step >= 3) {
      const p = input.reduced ? 0.72 : (input.time % 7) / 7;
      ox = input.w * (0.62 + Math.sin(input.time * 0.8) * 0.06);
      oy = Math.min(input.h * (0.34 + p * 0.28), bandTop - 28);
    }
    if (input.step >= 2) halo(ctx, ox, oy, 30, "rgba(243, 212, 138, 0.22)");
    drawOxygen(ctx, ox, oy, state.oxygen.angle + input.time * 0.2, 1.05);

    if (input.step === 1) labelPill(ctx, input.w * 0.5, bandTop - 16, "Dashed lines are hydrogen bonds", { w: input.w, h: input.h });
    if (input.step === 2) labelPill(ctx, ox, Math.max(36, oy - 36), "O₂, a separate molecule", { w: input.w, h: input.h });
    if (input.step >= 3) labelPill(ctx, input.w * 0.72, input.h * 0.2, "From the air", { w: input.w, h: input.h });
    if (input.step >= 1) drawIonStrip(ctx, input.w, input.h, input.detail);
  },
};

function drawIonStrip(ctx: CanvasRenderingContext2D, w: number, h: number, detail: "all" | "simplified"): void {
  const narrow = w < 520;
  const top = h - (narrow ? 168 : 118);
  ctx.fillStyle = "rgba(8, 22, 28, 0.28)";
  ctx.fillRect(0, top, w, h - top);
  const items = [
    { id: "h3o", caption: "H₃O⁺" },
    { id: "oh", caption: "OH⁻" },
    { id: "h2co3", caption: "H₂CO₃" },
    { id: "hco3", caption: "HCO₃⁻" },
  ] as const;
  items.forEach((item, index) => {
    const col = narrow ? index % 2 : index;
    const row = narrow ? Math.floor(index / 2) : 0;
    const cols = narrow ? 2 : 4;
    const x = ((col + 0.5) / cols) * w;
    const y = top + (narrow ? 36 + row * 72 : 40);
    drawMolecule(ctx, item.id, x, y, { scale: narrow ? 0.62 : 0.7, mode: detail, caption: item.caption });
  });
}
