export interface VizInput {
  step: number;
  time: number;
  dt: number;
  w: number;
  h: number;
  reduced: boolean;
  sloshed: boolean;
  acidic: boolean;
  hours: number;
}

export interface Viz<S> {
  create(w: number, h: number): S;
  resize(state: S, w: number, h: number): void;
  tick(state: S, input: VizInput): void;
  draw(ctx: CanvasRenderingContext2D, state: S, input: VizInput): void;
}

export interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
}

export function makeMolecule(x: number, y: number, i: number): Molecule {
  return {
    x,
    y,
    vx: ((i * 17) % 9) - 4,
    vy: ((i * 13) % 7) - 3,
    angle: (i * 0.9) % (Math.PI * 2),
    spin: i % 2 === 0 ? 0.35 : -0.28,
  };
}

export function integrate(m: Molecule, dt: number, jitter = 70): void {
  m.vx += (Math.random() - 0.5) * jitter * dt;
  m.vy += (Math.random() - 0.5) * jitter * dt;
  const keep = Math.max(0, 1 - dt * 1.5);
  m.vx *= keep;
  m.vy *= keep;
  const speed = Math.hypot(m.vx, m.vy);
  const max = 32;
  if (speed > max) {
    m.vx = (m.vx / speed) * max;
    m.vy = (m.vy / speed) * max;
  }
  m.x += m.vx * dt;
  m.y += m.vy * dt;
  m.angle += m.spin * dt;
}

export function separate(list: Molecule[], minDist: number): void {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      if (dist < minDist) {
        const push = (minDist - dist) / 2;
        dx /= dist;
        dy /= dist;
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
      }
    }
  }
}

export function contain(m: Molecule, left: number, top: number, right: number, bottom: number, pad = 18): void {
  if (m.x < left + pad) {
    m.x = left + pad;
    m.vx = Math.abs(m.vx);
  }
  if (m.x > right - pad) {
    m.x = right - pad;
    m.vx = -Math.abs(m.vx);
  }
  if (m.y < top + pad) {
    m.y = top + pad;
    m.vy = Math.abs(m.vy);
  }
  if (m.y > bottom - pad) {
    m.y = bottom - pad;
    m.vy = -Math.abs(m.vy);
  }
}

export function grid(count: number, w: number, _h: number, top: number, bottom: number): { x: number; y: number }[] {
  const span = Math.max(1, bottom - top);
  const cols = Math.max(1, Math.ceil(Math.sqrt((count * w) / span)));
  const rows = Math.ceil(count / cols);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    points.push({
      x: ((c + 0.5) / cols) * w,
      y: top + ((r + 0.5) / rows) * span,
    });
  }
  return points;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function progress(time: number, seconds: number): number {
  return clamp01(time / seconds);
}

export function bob(time: number, amount = 3): number {
  return Math.sin(time * 1.7) * amount;
}
