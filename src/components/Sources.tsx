import { DISCLAIMER, SOURCES } from "../content/sources";
import { Legend } from "./Legend";

export function Sources() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2>Sources</h2>
        <p className="note">Pages checked November 2026. Guidelines and fact sheets are revised from time to time.</p>
        <ol className="sources">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <p>{source.detail}</p>
            </li>
          ))}
        </ol>
        <Legend />
        <aside className="disclaimer">
          <h2>Disclaimer</h2>
          <p>{DISCLAIMER}</p>
        </aside>
      </div>
    </footer>
  );
}
