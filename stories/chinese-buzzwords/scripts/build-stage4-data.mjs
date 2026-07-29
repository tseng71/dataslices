import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "data/processed");
mkdirSync(outDir, { recursive: true });
const appDataDir = resolve(root, "src/lib/data");
mkdirSync(appDataDir, { recursive: true });
const staticDataDir = resolve(root, "static/data");
mkdirSync(staticDataDir, { recursive: true });

const annual = {
  2012: ["中国好声音体", "元芳，你怎么看", "高富帅，白富美", "你幸福吗", "江南Style", "躺着也中枪", "吊丝，逆袭", "舌尖上的中国", "最炫民族风", "给跪了"],
  2013: ["中国大妈", "高端大气上档次", "爸爸去哪儿", "小伙伴们都惊呆了", "待我长发及腰", "喜大普奔", "女汉子", "土豪（金）", "摊上大事了", "涨姿势"],
  2014: ["我也是醉了", "有钱就是任性", "蛮拼的", "挖掘机技术哪家强", "保证不打死你", "萌萌哒", "时间都去哪了", "我读书少，你别骗我", "画面太美我不敢看", "且行且珍惜"],
  2015: ["重要的事情说三遍", "世界那么大，我想去看看", "你们城里人真会玩", "为国护盘", "明明可以靠脸吃饭却偏偏靠才华", "我想静静", "吓死宝宝了", "内心几乎是崩溃的", "我妈是我妈", "主要看气质"],
  2016: ["洪荒之力", "友谊的小船", "定个小目标", "吃瓜群众", "葛优躺", "辣眼睛", "全是套路", "蓝瘦香菇", "老司机带带我", "厉害了我的哥"],
  2017: ["打call", "尬聊", "怼", "油腻", "你的良心不会痛吗？", "惊不惊喜，意不意外", "皮皮虾，我们走", "扎心了，老铁", "还有这种操作？", "你有freestyle吗？"],
  2018: ["锦鲤", "杠精", "skr", "佛系", "确认过眼神", "官宣", "C位", "土味情话", "皮一下", "燃烧我的卡路里"],
  2019: ["不忘初心", "道路千万条，安全第一条", "柠檬精", "好嗨哟", "是个狼人", "雨女无瓜", "硬核", "996", "14亿护旗手", "断舍离"],
  2020: ["逆行者", "秋天的第一杯奶茶", "带货", "云监工", "光盘行动", "奥利给", "好家伙", "夺冠", "不约而同", "集美"],
  2021: ["觉醒年代", "YYDS", "双减", "破防", "元宇宙", "绝绝子", "躺平", "伤害性不高，侮辱性极强", "我看不懂，但我大受震撼", "强国有我"],
  2022: ["党的二十大", "中国式现代化", "全过程人民民主", "端稳中国饭碗", "数字经济", "太空会师", "一起向未来", "我的眼睛就是尺", "电子榨菜", "俄乌冲突"],
  2023: ["爱达未来", "烟火气", "数智生活", "村BA", "特种兵式旅游", "显眼包", "主打一个××", "多巴胺穿搭", "命运的齿轮开始转动", "新职人"],
  2024: ["新质生产力", "《黑神话：悟空》", "人工智能+", "含金量还在上升", "City不City", "班味儿", "偏偏你最争气", "浓人淡人", "松弛感", "主理人"],
  2025: ["DeepSeek（深度求索）", "敬自己一杯", "助我破鼎", "××基础××不基础", "千百次练习只为这一刻", "情绪价值", "如何呢又能怎", "村咖", "来财", "浪浪山小妖怪"]
};

const fixedPhrases = new Set([
  "元芳，你怎么看", "高富帅，白富美", "你幸福吗", "躺着也中枪", "吊丝，逆袭", "舌尖上的中国",
  "最炫民族风", "给跪了", "高端大气上档次", "爸爸去哪儿", "小伙伴们都惊呆了", "待我长发及腰",
  "摊上大事了", "我也是醉了", "有钱就是任性", "挖掘机技术哪家强", "保证不打死你", "时间都去哪了",
  "我读书少，你别骗我", "画面太美我不敢看", "且行且珍惜", "重要的事情说三遍", "世界那么大，我想去看看",
  "你们城里人真会玩", "明明可以靠脸吃饭却偏偏靠才华", "我想静静", "吓死宝宝了", "内心几乎是崩溃的",
  "我妈是我妈", "主要看气质", "友谊的小船", "定个小目标", "全是套路", "老司机带带我", "厉害了我的哥",
  "你的良心不会痛吗？", "惊不惊喜，意不意外", "皮皮虾，我们走", "扎心了，老铁", "还有这种操作？",
  "你有freestyle吗？", "确认过眼神", "皮一下", "燃烧我的卡路里", "不忘初心", "好嗨哟", "是个狠人",
  "雨女无瓜", "秋天的第一杯奶茶", "光盘行动", "伤害性不高，侮辱性极强", "我看不懂，但我大受震撼",
  "强国有我", "端稳中国饭碗", "一起向未来", "我的眼睛就是尺", "爱达未来", "特种兵式旅游",
  "多巴胺穿搭", "命运的齿轮开始转动", "含金量还在上升", "偏偏你最争气", "敬自己一杯", "助我破鼎",
  "千百次练习只为这一刻", "如何呢又能怎"
]);

const compressed = new Set(["喜大普奔", "YYDS", "996", "村BA", "C位"]);
const explicitTemplates = new Map([
  ["2012|中国好声音体", ["entry_label", "词条名称明确标为“体”，保守视为可套用格式"]],
  ["2019|道路千万条，安全第一条", ["official_explanation", "官方解读明确记录“××千万条，××第一条”的仿写结构"]],
  ["2023|主打一个××", ["explicit_slot", "官方词条直接包含槽位符号“××”"]],
  ["2025|××基础××不基础", ["explicit_slot", "官方词条直接包含槽位符号“××”，解读给出替换例句"]]
]);

const documentedVariation = new Map([
  ["2019|道路千万条，安全第一条", ["××千万条，××第一条", "2019 年官方解读"]],
  ["2023|主打一个××", ["主打一个 + 槽位", "2023 年官方词条"]],
  ["2025|××基础××不基础", ["过程基础，结果不基础", "2025 年官方解读"]],
  ["2025|来财", ["来分；来offer", "2025 年官方解读"]]
]);

const crossRegister = new Map([
  ["2025|情绪价值", ["营销学→人际关系、职场等", "2025 年官方解读"]]
]);

const templateExamples = [
  {
    family_id: "qian-wan-tiao",
    source_term: "道路千万条，安全第一条",
    pattern: "××千万条，××第一条",
    example: "数据千万条，奋斗第一条",
    observed_year: 2023,
    evidence_level: "verified",
    source_url: "https://hi.people.com.cn/n2/2023/0112/c231190-40264621.html"
  },
  {
    family_id: "qian-wan-tiao",
    source_term: "道路千万条，安全第一条",
    pattern: "××千万条，××第一条",
    example: "辅助驾驶千万条，安全行驶第一条",
    observed_year: 2025,
    evidence_level: "verified",
    source_url: "https://society.people.com.cn/n1/2025/0529/c1008-40489965.html"
  },
  {
    family_id: "jichu-bujichu",
    source_term: "××基础××不基础",
    pattern: "××基础，××不基础",
    example: "过程基础，结果不基础",
    observed_year: 2025,
    evidence_level: "verified",
    source_url: "https://nlp.ccnu.edu.cn/news/146"
  },
  {
    family_id: "lai-cai",
    source_term: "来财",
    pattern: "来××",
    example: "来分；来offer",
    observed_year: 2025,
    evidence_level: "verified",
    source_url: "https://nlp.ccnu.edu.cn/news/146"
  }
];

function formPrimary(year, term) {
  const key = `${year}|${term}`;
  if (explicitTemplates.has(key)) return "productive_template";
  if (compressed.has(term) || /[A-Za-z0-9+]/.test(term)) return "abbreviation_or_mixed_script";
  if (fixedPhrases.has(term)) return "fixed_phrase";
  return "word_or_short_label";
}

function csvEscape(value) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replaceAll('"', '""')}"` : str;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ].join("\n") + "\n";
}

const sourceByYear = (year) => {
  if (year === 2019) return "https://nlp.ccnu.edu.cn/news/100";
  return year <= 2024
    ? "https://nlp.ccnu.edu.cn/conference/15"
    : "https://nlp.ccnu.edu.cn/news/146";
};

const terms = [];
for (const [yearText, values] of Object.entries(annual)) {
  const year = Number(yearText);
  values.forEach((term, index) => {
    const rank = index + 1;
    terms.push({
      term_id: `${year}-${String(rank).padStart(2, "0")}`,
      year,
      rank,
      term,
      list_series: "年度十大网络用语",
      source_url: sourceByYear(year)
    });
  });
}

const annotations = terms.map((row) => {
  const key = `${row.year}|${row.term}`;
  const explicit = explicitTemplates.get(key);
  const variation = documentedVariation.get(key);
  const migration = crossRegister.get(key);
  return {
    term_id: row.term_id,
    year: row.year,
    rank: row.rank,
    term: row.term,
    form_primary: formPrimary(row.year, row.term),
    explicit_template: explicit ? 1 : 0,
    template_evidence_type: explicit?.[0] ?? "",
    template_evidence_note: explicit?.[1] ?? "",
    documented_variation: variation ? 1 : 0,
    documented_variant_examples: variation?.[0] ?? "",
    variation_source_note: variation?.[1] ?? "",
    documented_cross_register: migration ? 1 : 0,
    cross_register_note: migration?.[0] ?? "",
    annotation_confidence: explicit || variation || migration ? "high" : "medium",
    annotation_method: "editorial coding v1"
  };
});

const yearSummary = [...new Set(terms.map((row) => row.year))].map((year) => {
  const rows = annotations.filter((row) => row.year === year);
  const counts = Object.fromEntries(
    ["word_or_short_label", "fixed_phrase", "productive_template", "abbreviation_or_mixed_script"]
      .map((form) => [form, rows.filter((row) => row.form_primary === form).length])
  );
  return {
    year,
    total_terms: rows.length,
    ...counts,
    explicit_template_count: rows.filter((row) => row.explicit_template === 1).length,
    documented_variation_count: rows.filter((row) => row.documented_variation === 1).length
  };
});

const coverage = Object.keys(annual).map((yearText) => {
  const year = Number(yearText);
  return {
    year,
    list_available: 1,
    expected_terms: 10,
    observed_terms: annual[year].length,
    source_url: sourceByYear(year),
    selection_method: "智能信息处理为主，结合专家意见与站点/搜索引擎收录情况",
    corpus_note: year === 2025 ? "视频弹幕、网络新闻等；超过78亿字符" : "年度汇总页未逐年给出统一规模",
    comparability_note: "同名系列；年度媒介构成与语料规模并非逐年完整公开"
  };
});

const termsCsv = toCsv(terms, [
  "term_id", "year", "rank", "term", "list_series", "source_url"
]);
const annotationsCsv = toCsv(annotations, [
  "term_id", "year", "rank", "term", "form_primary", "explicit_template",
  "template_evidence_type", "template_evidence_note", "documented_variation",
  "documented_variant_examples", "variation_source_note", "documented_cross_register",
  "cross_register_note", "annotation_confidence", "annotation_method"
]);
const summaryCsv = toCsv(yearSummary, [
  "year", "total_terms", "word_or_short_label", "fixed_phrase", "productive_template",
  "abbreviation_or_mixed_script", "explicit_template_count", "documented_variation_count"
]);
const coverageCsv = toCsv(coverage, [
  "year", "list_available", "expected_terms", "observed_terms", "source_url",
  "selection_method", "corpus_note", "comparability_note"
]);
const templateExamplesCsv = toCsv(templateExamples, [
  "family_id", "source_term", "pattern", "example", "observed_year", "evidence_level", "source_url"
]);
writeFileSync(resolve(outDir, "annual-network-terms.csv"), termsCsv);
writeFileSync(resolve(outDir, "term-annotations.csv"), annotationsCsv);
writeFileSync(resolve(outDir, "year-summary.csv"), summaryCsv);
writeFileSync(resolve(outDir, "annual-series-coverage.csv"), coverageCsv);
writeFileSync(resolve(outDir, "template-examples.csv"), templateExamplesCsv);
writeFileSync(resolve(staticDataDir, "annual-network-terms.csv"), termsCsv);
writeFileSync(resolve(staticDataDir, "term-annotations.csv"), annotationsCsv);
writeFileSync(resolve(staticDataDir, "year-summary.csv"), summaryCsv);
writeFileSync(resolve(staticDataDir, "template-examples.csv"), templateExamplesCsv);
writeFileSync(resolve(appDataDir, "story-data.json"), JSON.stringify({
  generated_at: "2026-07-29",
  terms,
  annotations,
  year_summary: yearSummary,
  coverage,
  template_examples: templateExamples
}, null, 2) + "\n");

console.log(`Wrote ${terms.length} terms, ${annotations.length} annotations, ${yearSummary.length} yearly summaries, and app JSON.`);
