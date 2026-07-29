import starPayload from "../../data/v2/stars-orion-field.json";
import scenarioPayload from "../../data/v2/generation-scenario.json";
import placePayload from "../../data/v2/nyc-places.json";
import lightingPayload from "../../data/v2/lighting-presets.json";
import evidencePayload from "../../data/v2/evidence.json";

export const stars = starPayload.stars;
export const generationStates = scenarioPayload.states;
export const places = placePayload.places;
export const lightingPresets = lightingPayload.presets;
export const evidence = evidencePayload;

export const namedStars = stars.filter((star) => star.is_named_orion_anchor);

export const trackedStar =
  stars.find((star) => star.hr === 1937) ??
  [...stars].sort((a, b) => Math.abs(a.vmag - 5.82) - Math.abs(b.vmag - 5.82))[0];

export const magnitudeSteps = [
  {
    id: "opening-city",
    layout: "sky",
    threshold: 2.48,
    title: "这是完整的猎户座吗？",
    body: "腰带三星、参宿四和参宿七仍然清楚。熟悉的骨架让城市天空看起来几乎完整。",
    takeaway: "亮星骨架仍在，不等于完整星空。"
  },
  {
    id: "opening-dark-return",
    layout: "sky",
    threshold: 6.5,
    title: "把背景压暗，空着的位置开始出现恒星。",
    body: "它们没有从别处飞来。星一直在原来的坐标，只是重新获得了与背景的对比。",
    takeaway: "同一片天区里，较暗恒星重新越过可见边界。"
  },
  {
    id: "magnitude-encoding",
    layout: "magnitude",
    threshold: 6.5,
    title: "数字越小，星越亮。",
    body: "把同一批星从天空坐标移到视星等轴。特别亮的星很少，较暗的一端越来越密。",
    takeaway: "视星等从 0 到 6；数字越小越亮。"
  },
  {
    id: "threshold-reveal",
    layout: "magnitude",
    threshold: 5.48,
    title: "边界只移动一点，跨过去的却是一整片密度。",
    body: "越过阈值的星变成空心位置环。星没有熄灭，只是暂时低于当前条件的可见边界。",
    takeaway: "显示阈值从 6.50 移到 5.48；250 条目录星中保留 100 条。"
  },
  {
    id: "distribution-reveal",
    layout: "distribution",
    threshold: 5.48,
    title: "较暗的一端，聚集着更多恒星。",
    body: "累计曲线由这些星点生成。阈值扫过暗星密集区时，一小段位移会跨过大量恒星。",
    takeaway: "较暗恒星的数量结构放大了天空背景的变化。"
  }
];

export const sceneDefaults = {
  "opening-city": { thresholdStep: "opening-city" },
  "opening-dark-return": { thresholdStep: "opening-dark-return" },
  "magnitude-encoding": { thresholdStep: "magnitude-encoding" },
  "threshold-reveal": { thresholdStep: "threshold-reveal" },
  "distribution-reveal": { thresholdStep: "distribution-reveal" },
  "generation-zero": { generationAge: 0 },
  "generation-eighteen": { generationAge: 18 },
  "place-times-square": { selectedPlace: "times-square" },
  "place-central-park": { selectedPlace: "central-park" },
  "place-montauk-point": { selectedPlace: "montauk-point" },
  "place-explore": { selectedPlace: "montauk-point" },
  "light-path": {},
  "lighting-unshielded": { selectedLightingPreset: "unshielded" },
  "lighting-shielded": { selectedLightingPreset: "shielded" },
  "bird-evidence": {},
  ending: {}
};

export function countVisible(threshold) {
  return stars.filter((star) => star.vmag <= threshold).length;
}

export function starRadius(vmag) {
  return Math.max(1.2, Math.min(6.5, 7.1 - vmag));
}

export function starColor(star) {
  if (star.bv === null) return "#f5f0e6";
  if (star.bv < 0) return "#dfeaff";
  if (star.bv > 1.2) return "#f1c7a8";
  return "#f5f0e6";
}
