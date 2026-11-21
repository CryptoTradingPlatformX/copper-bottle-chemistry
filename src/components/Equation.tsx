import { useState } from "react";
import { OXIDATION_TERMS } from "../content/terms";

function Term({ id, children, open, onOpen }: { id: string; children: string; open: string | null; onOpen: (id: string) => void }) {
  const expanded = open === id;
  return (
    <button type="button" className="term" aria-expanded={expanded} onClick={() => onOpen(id)}>
      {children}
    </button>
  );
}

export function Equation() {
  const [open, setOpen] = useState<string | null>("h");
  const info = OXIDATION_TERMS.find((term) => term.id === open);

  function toggle(id: string) {
    setOpen((current) => (current === id ? null : id));
  }

  return (
    <div className="equation-block">
      <p className="equation-hint">Tap a term. The same word means the same thing in every line.</p>
      <p className="equation" aria-label="First half-reaction, done twice">
        <Term id="cu" open={open} onOpen={toggle}>Cu</Term>
        <span aria-hidden="true">→</span>
        <Term id="cu2" open={open} onOpen={toggle}>Cu²⁺</Term>
        <span>+ 2</span>
        <Term id="e" open={open} onOpen={toggle}>e⁻</Term>
        <span className="eq-times">twice</span>
      </p>
      <p className="equation" aria-label="Second half-reaction">
        <Term id="o2" open={open} onOpen={toggle}>O₂</Term>
        <span>+ 4</span>
        <Term id="h" open={open} onOpen={toggle}>H⁺</Term>
        <span>+ 4</span>
        <Term id="e" open={open} onOpen={toggle}>e⁻</Term>
        <span aria-hidden="true">→ 2</span>
        <Term id="h2o" open={open} onOpen={toggle}>H₂O</Term>
      </p>
      <p className="equation equation-overall" aria-label="Overall reaction">
        <span>2</span>
        <Term id="cu" open={open} onOpen={toggle}>Cu</Term>
        <span>+</span>
        <Term id="o2" open={open} onOpen={toggle}>O₂</Term>
        <span>+ 4</span>
        <Term id="h" open={open} onOpen={toggle}>H⁺</Term>
        <span aria-hidden="true">→ 2</span>
        <Term id="cu2" open={open} onOpen={toggle}>Cu²⁺</Term>
        <span>+ 2</span>
        <Term id="h2o" open={open} onOpen={toggle}>H₂O</Term>
      </p>
      {info && (
        <p className="explain" role="region">
          <strong>{info.label}.</strong> {info.plain}
        </p>
      )}
    </div>
  );
}
