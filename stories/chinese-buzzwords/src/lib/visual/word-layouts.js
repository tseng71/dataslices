export const FORM_ORDER = [
  "word_or_short_label",
  "fixed_phrase",
  "productive_template",
  "abbreviation_or_mixed_script"
];

export const FORM_LABELS = {
  word_or_short_label: "短词 / 标签",
  fixed_phrase: "固定短语",
  productive_template: "明确模板",
  abbreviation_or_mixed_script: "缩写 / 数字 / 混写"
};

export const CURATED_TERMS = new Set([
  "元芳，你怎么看",
  "江南Style",
  "给跪了",
  "小伙伴们都惊呆了",
  "喜大普奔",
  "女汉子",
  "我也是醉了",
  "萌萌哒",
  "且行且珍惜",
  "世界那么大，我想去看看",
  "洪荒之力",
  "吃瓜群众",
  "蓝瘦香菇",
  "打call",
  "尬聊",
  "怼",
  "锦鲤",
  "杠精",
  "佛系",
  "C位",
  "道路千万条，安全第一条",
  "硬核",
  "996",
  "带货",
  "YYDS",
  "破防",
  "绝绝子",
  "躺平",
  "电子榨菜",
  "烟火气",
  "显眼包",
  "主打一个××",
  "新质生产力",
  "City不City",
  "班味儿",
  "松弛感",
  "主理人",
  "情绪价值",
  "来财",
  "浪浪山小妖怪"
]);

export function compactLength(term) {
  return [...term.replace(/[，。、“”《》？！：；（）×+·\s]/g, "")].length;
}

export function eraRole(year) {
  if (year <= 2016) return "early";
  if (year <= 2021) return "middle";
  return "recent";
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function scatterPosition(term, index, total) {
  const seed = hash(term.term_id);
  const angle = ((seed % 360) * Math.PI) / 180;
  const ring = 0.58 + ((seed >>> 9) % 35) / 100;
  let x = 50 + Math.cos(angle) * 47 * ring;
  let y = 50 + Math.sin(angle) * 43 * ring;

  if (x > 20 && x < 80 && y > 24 && y < 73) {
    const edge = index % 4;
    if (edge === 0) x = 5 + (index % 8) * 1.7;
    if (edge === 1) x = 82 + (index % 8) * 1.6;
    if (edge === 2) y = 6 + (index % 6) * 1.5;
    if (edge === 3) y = 82 + (index % 7) * 1.5;
  }

  return {
    x: Math.max(3, Math.min(93, x)),
    y: Math.max(5, Math.min(91, y)),
    rotate: ((seed >>> 15) % 9) - 4
  };
}

function formFocus(scene) {
  return {
    "form-short": "word_or_short_label",
    "form-phrase": "fixed_phrase",
    "form-template": "productive_template",
    "form-mixed": "abbreviation_or_mixed_script"
  }[scene];
}

export function buildLayoutContext(records) {
  const curated = records.filter((record) => CURATED_TERMS.has(record.term));
  const forms = Object.fromEntries(
    FORM_ORDER.map((form) => [form, records.filter((record) => record.form_primary === form)])
  );
  const templates = records.filter((record) => record.explicit_template === 1);
  const evidence = records.filter(
    (record) => record.documented_variation === 1 || record.documented_cross_register === 1
  );
  const unknown = records.filter(
    (record) => record.documented_variation !== 1 && record.documented_cross_register !== 1
  );
  const mixed = forms.abbreviation_or_mixed_script;

  return {
    curated,
    forms,
    templates,
    evidence,
    unknown,
    mixed,
    indexById: new Map(records.map((record, index) => [record.term_id, index]))
  };
}

export function populationForScene(scene, context) {
  if (scene === "field-intro" || scene === "field-color" || scene === "title-reveal" || scene === "return-field") {
    return context.curated;
  }
  if (scene.startsWith("template-")) return context.templates;
  if (scene.startsWith("evidence-path") || scene === "evidence-results") return context.evidence;
  if (scene === "mixed-stream") return context.mixed;
  return [...context.indexById.keys()].map((id) => id);
}

function yearPosition(record) {
  return {
    x: 3.5 + (record.year - 2012) * 7.05,
    y: 12 + (record.rank - 1) * 7.7,
    mx: 8 + ((record.rank - 1) % 2) * 46,
    my: 12 + (record.year - 2020) * 28 + (record.rank - 1) * 4.35
  };
}

function formPosition(record, context) {
  const formIndex = FORM_ORDER.indexOf(record.form_primary);
  const rows = context.forms[record.form_primary];
  const index = rows.findIndex((row) => row.term_id === record.term_id);
  const progress = rows.length <= 1 ? 0.5 : index / (rows.length - 1);
  const baseY = [20, 40, 61, 80][formIndex];
  return {
    x: 4 + progress * 88,
    y: baseY + Math.sin(progress * Math.PI * 2) * 3.5,
    mx: 7 + progress * 82,
    my: [17, 38, 60, 81][formIndex] + Math.sin(progress * Math.PI * 2) * 3
  };
}

function lengthPosition(record) {
  const length = Math.min(14, compactLength(record.term));
  return {
    x: 4 + ((length - 1) / 13) * 89,
    y: 11 + (record.year - 2012) * 5.8 + (record.rank % 2) * 1.4,
    mx: 7 + ((length - 1) / 13) * 84,
    my: 16 + (record.year - 2012) * 5.2 + (record.rank % 2) * 1.2
  };
}

function templatePosition(record, context) {
  const index = context.templates.findIndex((row) => row.term_id === record.term_id);
  return {
    x: 12,
    y: 22 + index * 18,
    mx: 8,
    my: 22 + index * 18
  };
}

function evidencePosition(record, context, atResult) {
  const index = context.evidence.findIndex((row) => row.term_id === record.term_id);
  return {
    x: atResult ? 57 : 6,
    y: 19 + index * 14,
    mx: atResult ? 58 : 6,
    my: 18 + index * 14.5
  };
}

function matrixPosition(record, context) {
  const knownIndex = context.evidence.findIndex((row) => row.term_id === record.term_id);
  if (knownIndex >= 0) {
    return {
      x: 5 + knownIndex * 18,
      y: 17,
      mx: 7 + knownIndex * 18,
      my: 17
    };
  }
  const index = context.unknown.findIndex((row) => row.term_id === record.term_id);
  return {
    x: 4 + (index % 20) * 4.65,
    y: 34 + Math.floor(index / 20) * 8.1,
    mx: 5 + (index % 10) * 9.1,
    my: 34 + Math.floor(index / 10) * 4.15
  };
}

function mixedPosition(record, context) {
  const index = context.mixed.findIndex((row) => row.term_id === record.term_id);
  return {
    x: 5 + (index % 5) * 18.5,
    y: 23 + Math.floor(index / 5) * 23,
    mx: 7 + (index % 2) * 47,
    my: 17 + Math.floor(index / 2) * 10.5
  };
}

export function layoutFor(record, scene, context) {
  const curatedIndex = context.curated.findIndex((row) => row.term_id === record.term_id);
  const fullIndex = context.indexById.get(record.term_id);
  const scatter = scatterPosition(record, Math.max(0, curatedIndex), context.curated.length);
  const role = eraRole(record.year);
  let position = scatter;
  let visible = curatedIndex >= 0;
  let opacity = visible ? 0.78 : 0;
  let size = 0.92;
  let color = role;
  let mode = "word";
  let maxWidth = 18;

  if (scene === "field-intro") {
    opacity = visible ? 0.44 : 0;
    color = "ink";
  } else if (scene === "field-color") {
    opacity = visible ? 0.82 : 0;
  } else if (scene === "title-reveal") {
    opacity = visible ? 0.18 : 0;
  } else if (scene === "year-focus" || scene === "year-river") {
    position = yearPosition(record);
    visible = true;
    opacity = scene === "year-focus" ? (record.year === 2021 ? 0.96 : 0.1) : 0.82;
    size = scene === "year-focus" && record.year === 2021 ? 0.92 : 0.63;
    maxWidth = 7;
  } else if (scene.startsWith("form-")) {
    position = formPosition(record, context);
    visible = true;
    const focus = formFocus(scene);
    opacity = record.form_primary === focus ? 0.95 : 0.13;
    size = record.form_primary === focus ? 0.72 : 0.58;
    color = FORM_ORDER.indexOf(record.form_primary) === 0
      ? "early"
      : FORM_ORDER.indexOf(record.form_primary) === 1
        ? "middle"
        : FORM_ORDER.indexOf(record.form_primary) === 2
          ? "recent"
          : "evidence";
    maxWidth = 11;
  } else if (scene === "length-scatter" || scene === "length-density") {
    position = lengthPosition(record);
    visible = true;
    opacity = scene === "length-density" ? 0.17 : 0.7;
    size = 0.55;
    maxWidth = 10;
  } else if (scene === "template-engine") {
    position = templatePosition(record, context);
    visible = context.templates.some((row) => row.term_id === record.term_id);
    opacity = visible ? 0.96 : 0;
    size = 1.18;
    color = "recent";
    maxWidth = 38;
  } else if (scene === "evidence-paths" || scene === "evidence-results") {
    position = evidencePosition(record, context, scene === "evidence-results");
    visible = context.evidence.some((row) => row.term_id === record.term_id);
    opacity = visible ? 0.96 : 0;
    size = 0.94;
    color = record.documented_cross_register ? "evidence" : "recent";
    maxWidth = 34;
  } else if (scene === "evidence-matrix") {
    position = matrixPosition(record, context);
    visible = true;
    opacity = context.evidence.some((row) => row.term_id === record.term_id) ? 0.96 : 0.48;
    size = 0.56;
    color = context.evidence.some((row) => row.term_id === record.term_id)
      ? record.documented_cross_register ? "evidence" : "recent"
      : "unknown";
    mode = "cell";
    maxWidth = context.evidence.some((row) => row.term_id === record.term_id) ? 16 : 4.2;
  } else if (scene === "mixed-stream") {
    position = mixedPosition(record, context);
    visible = context.mixed.some((row) => row.term_id === record.term_id);
    opacity = visible ? 0.96 : 0;
    size = 1.05;
    maxWidth = 22;
  } else if (scene === "return-field") {
    visible = curatedIndex >= 0;
    opacity = visible ? 0.64 : 0;
    position = {
      ...scatter,
      y: 14 + (record.year - 2012) * 5.4 + (curatedIndex % 3) * 2.2,
      my: 12 + (record.year - 2012) * 5.3 + (curatedIndex % 2) * 2
    };
  }

  const highlight = record.term === "YYDS" && ["field-color", "title-reveal", "year-focus", "year-river"].includes(scene);
  if (highlight) {
    opacity = 1;
    size *= 1.28;
    color = "middle";
  }

  return {
    ...position,
    x: Number(position.x ?? scatter.x).toFixed(2),
    y: Number(position.y ?? scatter.y).toFixed(2),
    mx: Number(position.mx ?? position.x ?? scatter.x).toFixed(2),
    my: Number(position.my ?? position.y ?? scatter.y).toFixed(2),
    rotate: scene.startsWith("form-") ? (fullIndex % 7) - 3 : scatter.rotate,
    opacity,
    size,
    color,
    mode,
    maxWidth,
    visible,
    highlight
  };
}

