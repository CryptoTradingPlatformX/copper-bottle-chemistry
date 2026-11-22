import { useEffect, useState } from "react";
import { SCENE_IDS, SCENES } from "./content/scenes";
import { Hero } from "./components/Hero";
import { SceneSection } from "./components/SceneSection";
import { Sources } from "./components/Sources";
import { useAtomDetail } from "./hooks/useAtomDetail";
import { useReducedMotion } from "./hooks/useReducedMotion";

function useActiveScene(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(`scene-${id}`))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace("scene-", "");
          if (entry.isIntersecting) ratios.set(id, entry.intersectionRatio);
          else ratios.delete(id);
        }
        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best) setActive(best[0]);
      },
      { threshold: [0.2, 0.45, 0.7] },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function App() {
  const reduced = useReducedMotion();
  const [detail, setDetail] = useAtomDetail();
  const active = useActiveScene(SCENE_IDS);

  return (
    <>
      <a className="skip" href="#story">
        Skip to the scenes
      </a>
      <Hero />
      <nav className="sticky-nav" aria-label="Scenes">
        <div className="nav-scroll">
          {SCENES.map((scene, index) => (
            <a
              key={scene.id}
              href={`#scene-${scene.id}`}
              aria-current={active === scene.id ? "true" : undefined}
            >
              <span className="nav-num">{index + 1}</span>
              {scene.short}
            </a>
          ))}
        </div>
        <div className="detail-row">
          <div className="toggle" role="group" aria-label="How hydrogens are drawn">
            <button type="button" aria-pressed={detail === "all"} onClick={() => setDetail("all")}>
              All atoms
            </button>
            <button type="button" aria-pressed={detail === "simplified"} onClick={() => setDetail("simplified")}>
              Simplified
            </button>
          </div>
          <p className="detail-note">Simplified still counts every hydrogen. It writes them on the atom, as OH or CH₂.</p>
        </div>
      </nav>
      <main id="story">
        {SCENES.map((scene, index) => (
          <SceneSection key={scene.id} scene={scene} index={index} reduced={reduced} detail={detail} />
        ))}
      </main>
      <Sources />
    </>
  );
}
