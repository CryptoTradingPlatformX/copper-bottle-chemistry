import {
  EPA_COPPER_ACTION_LEVEL_MG_L,
  WHO_COPPER_GUIDELINE_MG_L,
  formatMg,
  illustrativeCopperMgPerL,
  plainWaterBand,
  type Drink,
} from "../lib/chemistry";

interface Props {
  hours: number;
  acidic: boolean;
  onHours: (hours: number) => void;
  onAcidic: (acidic: boolean) => void;
  onReplay: () => void;
}

const WIDTH = 360;
const HEIGHT = 230;
const LEFT = 40;
const RIGHT = 14;
const TOP = 16;
const BOTTOM = 32;

function xAt(hours: number): number {
  return LEFT + (hours / 16) * (WIDTH - LEFT - RIGHT);
}

function yAt(mg: number): number {
  const max = 2.8;
  return TOP + (1 - mg / max) * (HEIGHT - TOP - BOTTOM);
}

function line(drink: Drink): string {
  let path = "";
  for (let i = 0; i <= 48; i++) {
    const hours = (i / 48) * 16;
    const command = i === 0 ? "M" : "L";
    path += `${command}${xAt(hours).toFixed(1)},${yAt(illustrativeCopperMgPerL(hours, drink)).toFixed(1)}`;
  }
  return path;
}

function band(): string {
  let path = "";
  for (let i = 0; i <= 48; i++) {
    const hours = (i / 48) * 16;
    const command = i === 0 ? "M" : "L";
    path += `${command}${xAt(hours).toFixed(1)},${yAt(plainWaterBand(hours).high).toFixed(1)}`;
  }
  for (let i = 48; i >= 0; i--) {
    const hours = (i / 48) * 16;
    path += `L${xAt(hours).toFixed(1)},${yAt(plainWaterBand(hours).low).toFixed(1)}`;
  }
  return `${path}Z`;
}

export function LeachPanel({ hours, acidic, onHours, onAcidic, onReplay }: Props) {
  const plain = illustrativeCopperMgPerL(hours, "water");
  const acid = illustrativeCopperMgPerL(hours, "acid");
  const summary = `Illustrative sketch at ${hours.toFixed(1)} hours. Plain water ${formatMg(plain)} milligrams per liter. Acidic drink ${formatMg(acid)} milligrams per liter. EPA action level ${EPA_COPPER_ACTION_LEVEL_MG_L}. WHO guideline ${WHO_COPPER_GUIDELINE_MG_L}.`;

  return (
    <div className="leach">
      <div className="toggle" role="group" aria-label="Which drink the picture follows">
        <button type="button" aria-pressed={!acidic} onClick={() => onAcidic(false)}>
          Plain water
        </button>
        <button type="button" aria-pressed={acidic} onClick={() => onAcidic(true)}>
          Lemon or vinegar
        </button>
      </div>
      <svg className="chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={summary}>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#fbf8f3" rx="12" />
        {[0, 0.5, 1, 1.5, 2, 2.5].map((mg) => (
          <g key={mg}>
            <line x1={LEFT} x2={WIDTH - RIGHT} y1={yAt(mg)} y2={yAt(mg)} stroke="rgba(60,48,40,0.12)" />
            <text x={LEFT - 6} y={yAt(mg) + 3} textAnchor="end" fill="#5c5148" fontSize="10">
              {mg}
            </text>
          </g>
        ))}
        <line
          x1={LEFT}
          x2={WIDTH - RIGHT}
          y1={yAt(EPA_COPPER_ACTION_LEVEL_MG_L)}
          y2={yAt(EPA_COPPER_ACTION_LEVEL_MG_L)}
          stroke="#8d4e2e"
          strokeDasharray="4 3"
        />
        <text x={WIDTH - RIGHT} y={yAt(EPA_COPPER_ACTION_LEVEL_MG_L) - 4} textAnchor="end" fill="#8d4e2e" fontSize="10">
          EPA 1.3
        </text>
        <line
          x1={LEFT}
          x2={WIDTH - RIGHT}
          y1={yAt(WHO_COPPER_GUIDELINE_MG_L)}
          y2={yAt(WHO_COPPER_GUIDELINE_MG_L)}
          stroke="#1f6f4a"
          strokeDasharray="4 3"
        />
        <text x={WIDTH - RIGHT} y={yAt(WHO_COPPER_GUIDELINE_MG_L) - 4} textAnchor="end" fill="#1f6f4a" fontSize="10">
          WHO 2
        </text>
        <path d={band()} fill="rgba(31, 111, 134, 0.18)" />
        <path d={line("water")} fill="none" stroke="#1d6f86" strokeWidth={acidic ? 1.5 : 2.5} />
        <path d={line("acid")} fill="none" stroke="#c4784a" strokeWidth={acidic ? 2.5 : 1.5} opacity={acidic ? 1 : 0.55} />
        <circle cx={xAt(hours)} cy={yAt(plain)} r={acidic ? 3.5 : 5} fill="#1d6f86" />
        <circle cx={xAt(hours)} cy={yAt(acid)} r={acidic ? 5 : 3.5} fill="#c4784a" />
        {[0, 4, 8, 12, 16].map((hour) => (
          <text key={hour} x={xAt(hour)} y={HEIGHT - 10} textAnchor="middle" fill="#5c5148" fontSize="10">
            {hour}h
          </text>
        ))}
        <text x={LEFT} y={14} fill="#5c5148" fontSize="10">
          mg/L, sketch
        </text>
      </svg>
      <ul className="chips">
        <li>
          <strong>{formatMg(plain)}</strong>
          plain water sketch
        </li>
        <li>
          <strong>{formatMg(acid)}</strong>
          acidic drink sketch
        </li>
        <li>
          <strong>1.3</strong>
          EPA action level
        </li>
        <li>
          <strong>2</strong>
          WHO guideline
        </li>
      </ul>
      <label className="scrub">
        Standing time in the sketch: {hours.toFixed(1)} hours
        <input
          type="range"
          min={0}
          max={16}
          step={0.1}
          value={hours}
          onChange={(event) => onHours(Number(event.target.value))}
        />
      </label>
      <button type="button" className="text-button" onClick={onReplay}>
        Replay standing time
      </button>
      <p className="note">
        The shaded band and both curves are a picture of the pattern, not a lab result. Plain water in the sketch stays under the lines. Acid climbs through them. A real bottle depends on pH, time, temperature, and whether the copper is bare, new, or already filmed.
      </p>
    </div>
  );
}
