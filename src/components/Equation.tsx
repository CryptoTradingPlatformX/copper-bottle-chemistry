import { useState } from "react";
import {
  SCENE_EQUATIONS,
  SPECIES,
  type BalancedEquation,
  type SceneId,
  type TermRef,
} from "../content/equations";

function TermButton({
  term,
  open,
  onToggle,
}: {
  term: TermRef;
  open: string | null;
  onToggle: (id: string) => void;
}) {
  const species = SPECIES[term.id];
  const expanded = open === term.id;
  return (
    <button type="button" className="term" aria-expanded={expanded} onClick={() => onToggle(term.id)}>
      {term.label ?? species.label}
    </button>
  );
}

function Side({
  terms,
  open,
  onToggle,
}: {
  terms: TermRef[];
  open: string | null;
  onToggle: (id: string) => void;
}) {
  return terms.map((term, index) => (
    <span className="eq-piece" key={`${term.id}-${term.label ?? ""}-${index}`}>
      {index > 0 && <span className="eq-op">+</span>}
      {(term.count ?? 1) > 1 && <span className="eq-count">{term.count}</span>}
      <TermButton term={term} open={open} onToggle={onToggle} />
    </span>
  ));
}

function EquationLine({
  equation,
  open,
  onToggle,
}: {
  equation: BalancedEquation;
  open: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="equation-item">
      <div className="equation-line">
        <div className="equation" role="group" aria-label={equation.reading}>
          <Side terms={equation.left} open={open} onToggle={onToggle} />
          <span className="eq-arrow" aria-hidden="true">
            {equation.reversible ? "⇌" : "→"}
          </span>
          <Side terms={equation.right} open={open} onToggle={onToggle} />
          {equation.suffix && <span className="eq-times">{equation.suffix}</span>}
        </div>
      </div>
      <p className="equation-reading">{equation.reading}</p>
      {equation.aside && <p className="equation-aside">{equation.aside}</p>}
    </div>
  );
}

export function SceneEquations({ sceneId }: { sceneId: SceneId }) {
  const equations = SCENE_EQUATIONS[sceneId];
  const [open, setOpen] = useState<string | null>(null);
  const info = open ? SPECIES[open] : undefined;

  function toggle(id: string) {
    setOpen((current) => (current === id ? null : id));
  }

  return (
    <div className="equation-block">
      <p className="equation-hint">Tap a term. The sentence under each line is the plain reading.</p>
      {equations.map((equation) => (
        <EquationLine key={equation.id} equation={equation} open={open} onToggle={toggle} />
      ))}
      {info && (
        <p className="explain" role="region">
          <strong>{info.label}.</strong> {info.plain}
        </p>
      )}
    </div>
  );
}
