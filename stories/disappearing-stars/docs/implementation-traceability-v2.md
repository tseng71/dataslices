# 《消失的星空》v2 设计—实现追溯基线

> 状态：第四阶段内容与证据已确认；第五阶段生产实现已获准
> 日期：2026-07-28

## 1. 目的

本文件在编码前建立追溯框架。任何生产实现都必须对应已确认的设计状态、数据字段和证据；不得先写页面，再倒推理由。

## 2. 场景追溯

| 场景 | 设计依据 | 数据依据 | 计划组件 | 当前状态 |
|---|---|---|---|---|
| 城市猎户座 | v3 Beats 0—2；桌面 KF01—02；手机 MKF01 | C01、C11 | `HeroConstellation.svelte` | 内容与数据就绪；待实现 |
| 追踪星 | v3 Beat 3 | C01 | `TrackedStar.svelte` / 状态层 | 内容与数据就绪；待实现 |
| 星等教学 | v3 Beats 4—6；KF03；MKF02—03 | C01、C07、C11 | `ThresholdScrolly.svelte` | 内容与数据就绪；待实现 |
| 累计分布 | v3 Beats 7—10；KF04 | C01、C11 | `MagnitudeDistribution.svelte` | 内容与数据就绪；待实现 |
| 18 年情景 | v3 Beats 11—15；KF05 | C02—C04、C11 | `GenerationScrolly.svelte` | 内容与数据就绪；待实现 |
| 纽约路线 | v3 Beats 16—20；KF06；MKF04 | C01、C05—C07 | `CityTransect.svelte` | 模型档与限制就绪；无局部观测 |
| 光路机制 | v3 Beats 21—23；KF07 | C05—C08 | `LightPathExplainer.svelte` | 内容就绪；待实现 |
| 照明 A/B | v3 Beats 24—26；KF07；MKF05 | C08 | `LightingComparison.svelte` | 类别预设就绪；禁止定量输出 |
| 生态插页 | v3 Beat 27 | C09 | `EvidenceInset.svelte` | 具体事件证据就绪；待实现 |
| 结尾 | v3 Beats 28—29；KF08 | C01—C11 | `EndingConstellation.svelte` | 正文就绪；待实现 |
| 方法与来源 | v3 第 11 节 | 全部 | `Methods.svelte` | 文档与账本就绪；待实现 |

## 3. 数据字段追溯

| 数据文件 | 计划字段 | 消费场景 | 来源 | 处理脚本 |
|---|---|---|---|---|
| `data/v2/stars-orion-field.json` | `star_id, ra_deg, dec_deg, x_normalized, y_normalized, vmag, bv, names` | Hero、阈值、代际、地点、结尾 | S01 / C01 | 已生成并校验 250 条 |
| `data/v2/threshold-model.json` | `model_id, rule, approved_thresholds_vmag, not_a_claim` | 阈值、代际、地点 | C11 | 已建立 |
| `data/v2/generation-scenario.json` | `age_years, skyglow_factor, display_threshold_vmag, counts, evidence_type` | 18 年情景 | S02 / C02—C04、C11 | 已生成并复算 |
| `data/v2/nyc-places.json` | 点位、Atlas 档、推导 NELM、覆盖与限制 | 城市路线 | S02—S04 / C05—C07 | 已从官方 KMZ 生成 |
| `data/v2/lighting-presets.json` | `preset_id, targeting, level, control, spectrum` | 照明 A/B | S05—S06 / C08 | 已建立类别状态 |
| `data/v2/evidence.json` | `claim_id, evidence_class, source_ids, caveat` | 全文标签与方法 | 全部 | 已建立 11 条主张 |

## 4. 内容追溯

| 内容文件 | 作用 | 当前状态 |
|---|---|---|
| `docs/manuscript-v2.md` | 连续读者正文与主张编号 | 第四阶段已确认 |
| `docs/methodology-v2.md` | 公式、处理、限制与复现 | 第四阶段已确认 |
| `docs/sources-v2.md` | 来源、许可、日期与哈希 | 第四阶段已确认 |
| `docs/data-notes-v2.md` | 数据包结构与生产消费规则 | 第四阶段已确认 |
| `docs/data-dictionary-v2.md` | 字段定义 | 第四阶段已确认 |
| `docs/claim-source-ledger-v2.csv` | 主张—来源—场景账本 | 第四阶段已确认 |

## 5. 设计偏差规则

实现与设计不同，必须：

1. 在本文件记录偏差；
2. 说明数据、性能、无障碍或编辑原因；
3. 更新对应设计文档；
4. 在实现预览确认前显式告知；
5. 不得用合成数据静默补足。

## 6. 旧版替换边界

新版通过实现预览确认前：

- 不删除旧版 `index.html`、`story.css`、`story.js`；
- 不更改正式故事 URL；
- 不把旧版硬编码地点和指数复制进新版数据层；
- 不更新页脚为 v2；
- 不宣称重构完成。
