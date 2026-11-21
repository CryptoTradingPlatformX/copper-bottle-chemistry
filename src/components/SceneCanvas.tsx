import { useEffect, useRef } from "react";
import { fitCanvas } from "../viz/draw";
import { VIZ, type VizId } from "../viz/registry";
import type { Viz, VizInput } from "../viz/types";

interface Props {
  sceneId: VizId;
  step: number;
  playing: boolean;
  reduced: boolean;
  sloshed: boolean;
  acidic: boolean;
  hours: number;
  label: string;
}

export function SceneCanvas({ sceneId, step, playing, reduced, sloshed, acidic, hours, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<unknown>(null);
  const timeRef = useRef(0);
  const hoursRef = useRef(hours);
  const propsRef = useRef({ step, playing, reduced, sloshed, acidic, sceneId });
  hoursRef.current = hours;
  propsRef.current = { step, playing, reduced, sloshed, acidic, sceneId };

  useEffect(() => {
    timeRef.current = reduced ? 8 : 0;
  }, [sceneId, step, reduced]);

  const frozenHours = playing && !reduced ? -1 : hours;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const viz = VIZ[sceneId] as Viz<unknown>;
    let raf = 0;
    let stopped = false;
    let last = performance.now();
    const visibleRef = { current: true };

    const frame = (now: number) => {
      if (stopped) return;
      const props = propsRef.current;
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      if (document.hidden) return;
      if (props.playing && !props.reduced) timeRef.current += dt;
      const { w, h } = fitCanvas(canvas);
      if (w < 2 || h < 2) {
        if (props.playing && !props.reduced) raf = window.requestAnimationFrame(frame);
        return;
      }
      if (!simRef.current) simRef.current = viz.create(w, h);
      viz.resize(simRef.current, w, h);
      const input: VizInput = {
        step: props.step,
        time: timeRef.current,
        dt,
        w,
        h,
        reduced: props.reduced,
        sloshed: props.sloshed,
        acidic: props.acidic,
        hours: hoursRef.current,
      };
      if (props.playing && !props.reduced) viz.tick(simRef.current, input);
      viz.draw(context, simRef.current, input);
      if (props.playing && !props.reduced && visibleRef.current) {
        raf = window.requestAnimationFrame(frame);
      }
    };

    raf = window.requestAnimationFrame(frame);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && propsRef.current.playing && !propsRef.current.reduced) {
          last = performance.now();
          window.cancelAnimationFrame(raf);
          raf = window.requestAnimationFrame(frame);
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(canvas);

    const onVisible = () => {
      if (!document.hidden && propsRef.current.playing && !propsRef.current.reduced) {
        last = performance.now();
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const resize = new ResizeObserver(() => {
      if (!propsRef.current.playing || propsRef.current.reduced) {
        last = performance.now();
        frame(performance.now());
      }
    });
    resize.observe(canvas);

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        if (!stopped) {
          last = performance.now();
          frame(performance.now());
        }
      });
    }

    return () => {
      stopped = true;
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [sceneId, step, playing, reduced, sloshed, acidic, frozenHours]);

  return (
    <div className="stage-frame">
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="sr-only">{label}</p>
    </div>
  );
}
