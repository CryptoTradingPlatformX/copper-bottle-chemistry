import { bodyViz } from "./body";
import { cleanViz } from "./clean";
import { germsViz } from "./germs";
import { leachingViz } from "./leaching";
import { oxidationViz } from "./oxidation";
import { tarnishViz } from "./tarnish";
import { wallViz } from "./wall";
import { zoomViz } from "./zoom";

export const VIZ = {
  zoom: zoomViz,
  wall: wallViz,
  oxidation: oxidationViz,
  leach: leachingViz,
  tarnish: tarnishViz,
  germs: germsViz,
  body: bodyViz,
  clean: cleanViz,
};

export const VIZ_IDS = Object.keys(VIZ) as (keyof typeof VIZ)[];

export type VizId = keyof typeof VIZ;
