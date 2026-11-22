import { useEffect, useRef, useState } from "react";
import type { SceneContent } from "../content/scenes";
import { SCENES } from "../content/scenes";
import { SceneEquations } from "./Equation";
import { IntakeScale } from "./IntakeScale";
import { LeachPanel } from "./LeachPanel";
import { RatioNote } from "./RatioNote";
import { SceneCanvas } from "./SceneCanvas";

interface Props {
  scene: SceneContent;
  index: number;
  reduced: boolean;
}

export function SceneSection({ scene, index, reduced }: Props) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [sloshed, setSloshed] = useState(false);
  const [acidic, setAcidic] = useState(false);
  const [hours, setHours] = useState(0);
  const [clockKey, setClockKey] = useState(0);
  const hoursRef = useRef(0);
  const current = scene.steps[step];

  useEffect(() => {
    setPlaying(!reduced);
  }, [reduced]);

  useEffect(() => {
    if (!reduced || !playing) return;
    const id = window.setInterval(() => {
      setStep((value) => (value + 1) % scene.steps.length);
    }, 7500);
    return () => window.clearInterval(id);
  }, [reduced, playing, scene.steps.length]);

  useEffect(() => {
    if (scene.id !== "leach") return;
    if (step === 3) setAcidic(true);
    if (step === 2) setAcidic(false);
  }, [scene.id, step]);

  useEffect(() => {
    if (scene.id !== "leach" || step < 2 || !playing || reduced) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      hoursRef.current = Math.min(16, hoursRef.current + dt * 0.85);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    const id = window.setInterval(() => setHours(hoursRef.current), 100);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, [scene.id, step, playing, reduced, clockKey]);

  function scrub(value: number) {
    hoursRef.current = value;
    setHours(value);
    setPlaying(false);
  }

  function replayHours() {
    hoursRef.current = 0;
    setHours(0);
    setPlaying(true);
    setClockKey((value) => value + 1);
  }

  const playLabel = reduced
    ? playing
      ? "Pause step advance"
      : "Play step advance"
    : playing
      ? "Pause animation"
      : "Play animation";

  return (
    <section className="scene" id={`scene-${scene.id}`} aria-labelledby={`title-${scene.id}`}>
      <header className="scene-head">
        <p className="kicker">
          Scene {index + 1} of {SCENES.length}
        </p>
        <h2 id={`title-${scene.id}`}>{scene.title}</h2>
      </header>
      <SceneCanvas
        sceneId={scene.id}
        step={step}
        playing={playing}
        reduced={reduced}
        sloshed={sloshed}
        acidic={step >= 2 && acidic}
        hours={step >= 2 ? hours : 0}
        label={`${scene.title}. ${current.title}. ${current.caption}`}
      />
      <div className="controls" role="group" aria-label={`${scene.title} playback`}>
        <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
          Previous
        </button>
        <button type="button" className="primary" aria-pressed={playing} aria-label={playLabel} onClick={() => setPlaying((value) => !value)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => setStep((value) => Math.min(scene.steps.length - 1, value + 1))}
          disabled={step === scene.steps.length - 1}
        >
          Next
        </button>
        <p className="step-count">
          Step {step + 1} of {scene.steps.length}
        </p>
      </div>
      <div className="dots">
        {scene.steps.map((item, itemIndex) => (
          <button
            key={item.title}
            type="button"
            className={itemIndex === step ? "dot on" : "dot"}
            aria-current={itemIndex === step ? "step" : undefined}
            aria-label={`Step ${itemIndex + 1}: ${item.title}`}
            onClick={() => setStep(itemIndex)}
          />
        ))}
      </div>
      {scene.id === "wall" && (
        <div className="toggle" role="group" aria-label="Motion of the bottle">
          <button type="button" aria-pressed={!sloshed} onClick={() => setSloshed(false)}>
            Sitting still
          </button>
          <button type="button" aria-pressed={sloshed} onClick={() => setSloshed(true)}>
            Gently sloshed
          </button>
        </div>
      )}
      {reduced && <p className="note">Motion is reduced on this device. Play steps through the still pictures.</p>}
      <h3>{current.title}</h3>
      <p className="caption">{current.caption}</p>
      {current.note && <p className="note">{current.note}</p>}
      <SceneEquations sceneId={scene.id} />
      {scene.id === "zoom" && step === 2 && <RatioNote />}
      {scene.id === "leach" && step >= 2 && (
        <LeachPanel
          hours={hours}
          acidic={acidic}
          onHours={scrub}
          onAcidic={setAcidic}
          onReplay={replayHours}
        />
      )}
      {scene.id === "body" && step === 2 && <IntakeScale />}
    </section>
  );
}
