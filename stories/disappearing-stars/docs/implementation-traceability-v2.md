# 《消失的星空》v2 设计—实现追溯基线

> 状态：第五阶段本地实现候选通过；等待实现预览确认
> 日期：2026-07-29

## 1. 目的

本文件在编码前建立追溯框架。任何生产实现都必须对应已确认的设计状态、数据字段和证据；不得先写页面，再倒推理由。

## 2. 冻结设计

- 批准设计版本：`05-storyboard-wireframes-v3-stage4-approved`
- 设计合同：`docs/design-contract.json`
- 正文版本：`docs/manuscript-v2.md`
- 实现版本：`stage5-local-preview-2026-07-29`
- 一致性报告：`docs/design-conformance.json`
- QA：`docs/qa-notes.md`

## 3. 场景追溯

| 场景 | 设计依据 | 数据依据 | 计划组件 | 当前状态 |
|---|---|---|---|---|
| 城市猎户座 | v3 Beats 0—2；桌面 KF01—02；手机 MKF01 | C01、C11 | `Story.svelte` + `StarField.svelte` | 已实现；桌面、手机、减少动态通过 |
| 追踪星 | v3 Beat 3 | C01 | `StarField.svelte` + runes 状态层 | 已实现；固定 BSC ID |
| 星等教学 | v3 Beats 4—6；KF03；MKF02—03 | C01、C07、C11 | `ThresholdScrolly.svelte` + `MagnitudeGraphic.svelte` | 已实现；桌面、手机通过 |
| 累计分布 | v3 Beats 7—10；KF04 | C01、C11 | `MagnitudeGraphic.svelte` | 已实现；桌面通过 |
| 18 年情景 | v3 Beats 11—15；KF05 | C02—C04、C11 | `GenerationScrolly.svelte` | 已实现；0/6/12/18 离散节点 |
| 纽约路线 | v3 Beats 16—20；KF06；MKF04 | C01、C05—C07 | `CityTransect.svelte` | 已实现；模型与现场观测显式区分 |
| 光路机制 | v3 Beats 21—23；KF07 | C05—C08 | `LightPathExplainer.svelte` | 已实现；三类光路带非颜色标签 |
| 照明 A/B | v3 Beats 24—26；KF07；MKF05 | C08 | `LightingComparison.svelte` | 已实现；禁止定量输出 |
| 生态插页 | v3 Beat 27 | C09 | `BirdEvidence.svelte` | 已实现；证据范围与外推限制并置 |
| 结尾 | v3 Beats 28—29；KF08 | C01—C11 | `Story.svelte` + `StarField.svelte` | 已实现；回到同一天区 |
| 方法与来源 | v3 第 11 节 | 全部 | `Methods.svelte` | 已实现；无互动也可连续阅读 |

## 4. 数据字段追溯

| 数据文件 | 计划字段 | 消费场景 | 来源 | 处理脚本 |
|---|---|---|---|---|
| `data/v2/stars-orion-field.json` | `star_id, ra_deg, dec_deg, x_normalized, y_normalized, vmag, bv, names` | Hero、阈值、代际、地点、结尾 | S01 / C01 | 已生成并校验 250 条 |
| `data/v2/threshold-model.json` | `model_id, rule, approved_thresholds_vmag, not_a_claim` | 阈值、代际、地点 | C11 | 已建立 |
| `data/v2/generation-scenario.json` | `age_years, skyglow_factor, display_threshold_vmag, counts, evidence_type` | 18 年情景 | S02 / C02—C04、C11 | 已生成并复算 |
| `data/v2/nyc-places.json` | 点位、Atlas 档、推导 NELM、覆盖与限制 | 城市路线 | S02—S04 / C05—C07 | 已从官方 KMZ 生成 |
| `data/v2/lighting-presets.json` | `preset_id, targeting, level, control, spectrum` | 照明 A/B | S05—S06 / C08 | 已建立类别状态 |
| `data/v2/evidence.json` | `claim_id, evidence_class, source_ids, caveat` | 全文标签与方法 | 全部 | 已建立 11 条主张 |

## 5. 内容追溯

| 内容文件 | 作用 | 当前状态 |
|---|---|---|
| `docs/manuscript-v2.md` | 连续读者正文与主张编号 | 第四阶段已确认 |
| `docs/methodology-v2.md` | 公式、处理、限制与复现 | 第四阶段已确认 |
| `docs/sources-v2.md` | 来源、许可、日期与哈希 | 第四阶段已确认 |
| `docs/data-notes-v2.md` | 数据包结构与生产消费规则 | 第四阶段已确认 |
| `docs/data-dictionary-v2.md` | 字段定义 | 第四阶段已确认 |
| `docs/claim-source-ledger-v2.csv` | 主张—来源—场景账本 | 第四阶段已确认 |

## 6. 实现决策与批准更新

### SVG 星体层

总体设计建议用 Canvas 承载星体；生产候选对 250 颗恒星使用 SVG。原因是数量规模适中，SVG 能保留稳定星体 ID、实心 / 空心状态、语义属性与确定性测试。它没有改变固定坐标、星等编码或阈值动词。

### 代际显示阈值

早期总体设计写过“阈值按论文情景函数移动”。第四阶段确认的数据包进一步区分：

- 天空辉光因子按 9.6% 年复合增长；
- 0、6、12、18 岁显示阈值在 6.50 与 5.48 之间使用批准的编辑视觉插值；
- 只有 250 与约 100 两个论文示例端点作为读者星数主张；
- 中间目录计数只参与图形状态，不写成人眼观测结论。

生产候选以第四阶段确认数据为准，并在界面标出“全球平均情景”“编辑视觉插值”和“不是纽约预报”。

### 技术基线

2026-07-29 检查 The Pudding 官方 `website` 仓库及其当前 `package.json`。本实现采用同一代技术基线：Svelte 5.1.3、SvelteKit 2.7.3、adapter-static 3.0.6、Vite 5.4.10、D3 7.9.0，并额外建立 `src/lib/state/story.svelte.js` runes 主状态层。

### 字体与紧凑屏

完整 Noto Sans SC / Noto Serif SC 随构建打包，以保证已批准正文的字形覆盖。320×568 阈值场景隐藏与正文重复的图下注释，保留图内阈值、标题、解释与证据标签。

## 7. 设计偏差规则

实现与设计不同，必须：

1. 在本文件记录偏差；
2. 说明数据、性能、无障碍或编辑原因；
3. 更新对应设计文档；
4. 在实现预览确认前显式告知；
5. 不得用合成数据静默补足。

## 8. 旧版替换边界

新版通过实现预览确认前：

- 不删除旧版 `index.html`、`story.css`、`story.js`；
- 不更改正式故事 URL；
- 不把旧版硬编码地点和指数复制进新版数据层；
- 不更新页脚为 v2；
- 不宣称重构完成。
