export const COLORS = {
  cu: "#e39b5b",
  cuDeep: "#a85a32",
  o: "#ef6b57",
  h: "#f7f4ee",
  c: "#4a5160",
  cl: "#3dbe86",
  electron: "#f3d48a",
  ion: "#5aa4d6",
  cu2o: "#a34b38",
  cuo: "#241f1c",
  patina: "#3f9d78",
  bond: "rgba(247, 244, 238, 0.62)",
  hbond: "rgba(168, 224, 232, 0.85)",
};

const sprites = new Map<string, HTMLCanvasElement>();

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function mix(hex: string, other: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(other);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function fitCanvas(canvas: HTMLCanvasElement): { w: number; h: number } {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  const pw = Math.max(1, Math.round(w * dpr));
  const ph = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width = pw;
    canvas.height = ph;
  }
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
  }
  return { w, h };
}

export function microscope(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createRadialGradient(w * 0.5, h * 0.4, 12, w * 0.5, h * 0.55, Math.max(w, h) * 0.75);
  g.addColorStop(0, "#2a5964");
  g.addColorStop(0.55, "#1a3c46");
  g.addColorStop(1, "#101f26");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  const rad = Math.max(2, Math.round(r));
  const key = `${color}:${rad}`;
  let sprite = sprites.get(key);
  if (!sprite) {
    const pad = 2;
    const size = (rad + pad) * 2;
    sprite = document.createElement("canvas");
    sprite.width = size * 2;
    sprite.height = size * 2;
    const gtx = sprite.getContext("2d");
    if (!gtx) return;
    gtx.scale(2, 2);
    const cx = size / 2;
    const cy = size / 2;
    const fill = gtx.createRadialGradient(cx - rad * 0.34, cy - rad * 0.38, rad * 0.08, cx, cy, rad);
    fill.addColorStop(0, mix(color, "#ffffff", 0.62));
    fill.addColorStop(0.5, color);
    fill.addColorStop(1, mix(color, "#1a120c", 0.42));
    gtx.beginPath();
    gtx.arc(cx, cy, rad, 0, Math.PI * 2);
    gtx.fillStyle = fill;
    gtx.fill();
    sprites.set(key, sprite);
  }
  const dw = rad * 2 + 4;
  ctx.drawImage(sprite, x - dw / 2, y - dw / 2, dw, dw);
}

export function letter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  size: number,
): void {
  ctx.fillStyle = color;
  ctx.font = `700 ${Math.max(8, size)}px "Atkinson Hyperlegible", "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 0.5);
}

export function bond(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
  color = COLORS.bond,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function doubleBond(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * 2.4;
  const py = (dx / len) * 2.4;
  bond(ctx, x1 + px, y1 + py, x2 + px, y2 + py, 2.2);
  bond(ctx, x1 - px, y1 - py, x2 - px, y2 - py, 2.2);
}

const HALF = 0.912;

export function waterSites(x: number, y: number, angle: number, scale: number) {
  const length = 18 * scale;
  return {
    o: { x, y },
    h: [
      { x: x + Math.cos(angle - HALF) * length, y: y + Math.sin(angle - HALF) * length },
      { x: x + Math.cos(angle + HALF) * length, y: y + Math.sin(angle + HALF) * length },
    ],
  };
}

export function drawWater(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale = 1,
): void {
  const sites = waterSites(x, y, angle, scale);
  bond(ctx, x, y, sites.h[0].x, sites.h[0].y, 3 * scale);
  bond(ctx, x, y, sites.h[1].x, sites.h[1].y, 3 * scale);
  drawAtom(ctx, x, y, 10.5 * scale, COLORS.o);
  drawAtom(ctx, sites.h[0].x, sites.h[0].y, 6.6 * scale, COLORS.h);
  drawAtom(ctx, sites.h[1].x, sites.h[1].y, 6.6 * scale, COLORS.h);
  if (scale > 0.8) {
    letter(ctx, x, y, "O", "#fffaf6", 10 * scale);
    letter(ctx, sites.h[0].x, sites.h[0].y, "H", "#3a342e", 8 * scale);
    letter(ctx, sites.h[1].x, sites.h[1].y, "H", "#3a342e", 8 * scale);
  }
}

export function drawOxygen(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale = 1): void {
  const d = 12 * scale;
  const x1 = x - Math.cos(angle) * d;
  const y1 = y - Math.sin(angle) * d;
  const x2 = x + Math.cos(angle) * d;
  const y2 = y + Math.sin(angle) * d;
  doubleBond(ctx, x1, y1, x2, y2);
  drawAtom(ctx, x1, y1, 10.5 * scale, COLORS.o);
  drawAtom(ctx, x2, y2, 10.5 * scale, COLORS.o);
  if (scale > 0.75) {
    letter(ctx, x1, y1, "O", "#fffaf6", 10 * scale);
    letter(ctx, x2, y2, "O", "#fffaf6", 10 * scale);
  }
}

export function drawCO2(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale = 1): void {
  const d = 16 * scale;
  const x1 = x - Math.cos(angle) * d;
  const y1 = y - Math.sin(angle) * d;
  const x2 = x + Math.cos(angle) * d;
  const y2 = y + Math.sin(angle) * d;
  doubleBond(ctx, x, y, x1, y1);
  doubleBond(ctx, x, y, x2, y2);
  drawAtom(ctx, x, y, 10 * scale, COLORS.c);
  drawAtom(ctx, x1, y1, 9 * scale, COLORS.o);
  drawAtom(ctx, x2, y2, 9 * scale, COLORS.o);
  letter(ctx, x, y, "C", "#fffaf6", 9 * scale);
}

export function halo(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function labelPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  bounds: { w: number; h: number },
): void {
  const fontSize = bounds.w < 430 ? 12 : 13;
  ctx.font = `600 ${fontSize}px "Atkinson Hyperlegible", "Segoe UI", sans-serif`;
  const padX = 9;
  const width = Math.min(bounds.w - 16, ctx.measureText(text).width + padX * 2);
  const height = fontSize + 12;
  let left = x - width / 2;
  let top = y - height / 2;
  left = Math.max(8, Math.min(left, bounds.w - width - 8));
  top = Math.max(8, Math.min(top, bounds.h - height - 8));
  ctx.fillStyle = "rgba(255, 250, 244, 0.94)";
  roundRect(ctx, left, top, width, height, height / 2);
  ctx.fill();
  ctx.fillStyle = "#2a2420";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, left + width / 2, top + height / 2 + 0.5, width - 8);
}

export function traceBottle(ctx: CanvasRenderingContext2D, cx: number, top: number, neckW: number, neckH: number, bodyW: number, bodyBottom: number): void {
  const shoulder = top + neckH;
  const bodyTop = shoulder + bodyW * 0.16;
  const r = bodyW / 2;
  ctx.beginPath();
  ctx.moveTo(cx - neckW / 2, top);
  ctx.lineTo(cx + neckW / 2, top);
  ctx.lineTo(cx + neckW / 2, shoulder - neckH * 0.18);
  ctx.bezierCurveTo(cx + neckW / 2, shoulder + 6, cx + bodyW / 2, shoulder, cx + bodyW / 2, bodyTop);
  ctx.lineTo(cx + bodyW / 2, bodyBottom - r);
  ctx.arc(cx, bodyBottom - r, r, 0, Math.PI, false);
  ctx.lineTo(cx - bodyW / 2, bodyTop);
  ctx.bezierCurveTo(cx - bodyW / 2, shoulder, cx - neckW / 2, shoulder + 6, cx - neckW / 2, shoulder - neckH * 0.18);
  ctx.closePath();
}
