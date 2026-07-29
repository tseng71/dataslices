# 数据字典

版本：Stage 4 / editorial coding v1  
更新日期：2026-07-29

## `processed/annual-network-terms.csv`

国家语言资源监测与研究网络媒体中心“年度十大网络用语”2012—2025 年的逐条转录。2012—2024 来自中心汇总表，2025 来自当年发布页。

2019 年汇总表把第 5 条写作“是个狠人”，但同时期发布页与逐词解读均为“是个狼人”。处理后数据采用同时期发布页文本，并把该行的来源指向当年发布页。

| 字段 | 类型 | 含义 |
|---|---|---|
| `term_id` | string | 稳定键，格式为 `年份-两位顺序` |
| `year` | integer | 入选年度；不是首次出现年份 |
| `rank` | integer | 官方页面中的发布顺序；不解释为热度排名 |
| `term` | string | 官方词条文本，保留大小写、标点与槽位符号 |
| `list_series` | string | 本数据中的榜单系列名称 |
| `source_url` | URL | 支持该行的官方来源 |

## `processed/term-annotations.csv`

在官方词条上增加的编辑部编码。编码用于比较表达形式，不等于语言学上的唯一分类。每条词只分配一个 `form_primary`，避免重复计数。

| 字段 | 类型 | 含义 |
|---|---|---|
| `form_primary` | enum | `word_or_short_label`、`fixed_phrase`、`productive_template`、`abbreviation_or_mixed_script` 四选一 |
| `explicit_template` | 0/1 | 只有词条含 `××`、名称明确标“体”，或官方解读明确记载仿写结构时为 1 |
| `template_evidence_type` | enum/string | `explicit_slot`、`entry_label`、`official_explanation` 或空 |
| `template_evidence_note` | string | 判为明确模板的理由 |
| `documented_variation` | 0/1 | 官方解读是否给出或描述实际变体 |
| `documented_variant_examples` | string | 官方解读中的变体例子；分号分隔 |
| `variation_source_note` | string | 变体证据所在来源的简记 |
| `documented_cross_register` | 0/1 | 官方解读是否明确描述跨语域扩展 |
| `cross_register_note` | string | 起始语域与扩展语域 |
| `annotation_confidence` | enum | `high` 表示有逐词官方说明，`medium` 表示编辑部依词形编码 |
| `annotation_method` | string | 当前编码版本 |

### `form_primary` 规则

- `word_or_short_label`：短词、称谓或概念标签，不满足下面三类。
- `fixed_phrase`：句子、问句、台词或较长固定搭配；“固定”只表示本表按完整词条记录，不表示它不能被改写。
- `productive_template`：达到上文严格证据门槛的可替换结构。
- `abbreviation_or_mixed_script`：数字缩写、字母缩写或显著中英/字符混写。为保持互斥，这类优先于一般短词。

## `processed/year-summary.csv`

由 `term-annotations.csv` 按年机械汇总。四个 `form_primary` 计数之和应等于 `total_terms`。`explicit_template_count` 与 `productive_template` 相同，保留该字段便于前端直接读取。`documented_variation_count` 是官方逐词解读确有变体证据的数量。

## `processed/annual-series-coverage.csv`

记录年度覆盖、来源和可比性限制。`observed_terms=10` 只表示每年十条均已转录；不表示每年语料库规模、媒介构成或筛选阈值完全相同。

## `processed/template-examples.csv`

明确模板或仿造关系的逐例证据。`verified` 表示例句与来源页面可以一一对应；它不表示已经统计了全部变体。

| 字段 | 含义 |
|---|---|
| `family_id` | 模板族稳定键 |
| `source_term` | 年度词条中的来源表达 |
| `pattern` | 可替换结构 |
| `example` | 来源中实际出现的例句 |
| `observed_year` | 例句所在来源的年份 |
| `evidence_level` | 当前均为 `verified` |
| `source_url` | 支持该例句的页面 |

## 缺失与不应推导的值

- 本数据没有逐月或逐日使用频率，所以不能计算“寿命”“峰值”“衰减速度”。
- 未进入年度十条不等于没有被使用。
- 发布顺序不当作热度排名。
- 逐年语料规模没有完整统一公开；不得把榜单间差异直接解释为社会总体语言使用的变化。
- 语义主题暂不进入发布数据：单人编码缺少复核，现阶段不足以支持比例趋势。
