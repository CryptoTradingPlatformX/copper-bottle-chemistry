import { LEGEND } from "../content/terms";

export function Legend() {
  return (
    <div className="legend-block">
      <ul className="legend" aria-label="Atom colors">
        {LEGEND.map((atom) => (
          <li key={atom.symbol}>
            <span className="swatch" style={{ background: atom.color, color: atom.ink }}>
              {atom.symbol}
            </span>
            {atom.name}
          </li>
        ))}
        <li>
          <span className="swatch swatch-electron" aria-hidden="true" />
          electron
        </li>
      </ul>
      <p className="legend-note">
        Letters sit on the atoms. Gold specks are shared electrons. A dashed line between waters is a hydrogen bond.
      </p>
    </div>
  );
}
