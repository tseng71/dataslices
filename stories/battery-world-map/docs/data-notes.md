# Data notes：拆开一块电池，里面藏着一张世界地图

> 状态：v1 初步数据可行性与证据账本  
> 更新日期：2026-07-28  
> 说明：本文件确认故事可做，不代表所有数据已经完成下载和清洗。

## Sources

| Dataset / publication | Owner | URL | Retrieved | License / reuse note | Coverage |
|---|---|---|---|---|---|
| Mineral Commodity Summaries 2026 | U.S. Geological Survey | https://pubs.usgs.gov/periodicals/mcs2026/mcs2026.pdf | 2026-07-28 | 美国联邦政府出版物；仍需逐项核对第三方材料说明 | 2025 年估算及五年统计，90 余种矿物 |
| Global Critical Minerals Outlook 2025 | International Energy Agency | https://www.iea.org/reports/global-critical-minerals-outlook-2025 | 2026-07-28 | 页面可引用；图表数据下载与再分发条款需逐项核对 | 2020—2024 历史及至 2035 情景 |
| Critical Minerals Data Explorer | International Energy Agency | https://www.iea.org/data-and-statistics/data-tools/critical-minerals-data-explorer | 2026-07-28 | 数据下载条款待核对 | 铜、钴、锂、镍、石墨、稀土 |
| Global EV Outlook 2026 — Electric vehicle batteries | International Energy Agency | https://www.iea.org/reports/global-ev-outlook-2026/electric-vehicle-batteries | 2026-07-28 | 页面可引用；图表数据条款待核对 | 2025 年电池市场与路线 |
| Material content in different anode and cathodes | International Energy Agency | https://www.iea.org/data-and-statistics/charts/material-content-in-different-anode-and-cathodes | 2026-07-28 | 图表数据下载条款待核对 | 电极化学路线与材料构成 |
| The Shifting Dynamics of Critical Minerals Trade | UN Trade and Development | https://unctad.org/system/files/official-document/ditcinfd2026d6_en.pdf | 2026-07-28 | 联合国出版物使用条款待核对 | 2025 年贸易与生产背景、2040 需求情景 |
| Changing battery chemistries and implications for critical minerals supply chains | UN Trade and Development | https://unctad.org/system/files/official-document/ditccom2025d1_en.pdf | 2026-07-28 | 联合国出版物使用条款待核对 | NMC、LFP 等化学路线 |
| BatPaC / battery composition studies | Argonne National Laboratory | https://www.anl.gov/cse/batpac-model-software | 2026-07-28 | 模型许可和输出再利用条件需核对 | 参考电芯和电池包物料模型 |
| ILO GALAB project in DRC | International Labour Organization | https://www.ilo.org/resource/news/ilo-launches-galab-project-democratic-republic-congo-address-child-labour | 2026-07-28 | 引用页面；不再分发影像 | 手工及小规模钴矿童工风险 |

## Claim ledger

| Claim / scene | Measure | Grain | Time range | Source | Transformation | Caveat |
|---|---|---|---|---|---|---|
| 一块锂离子电池包含承担不同功能的多种材料 | 部件、材料、功能 | 参考电芯 | 模型版本对应年份 | Argonne BatPaC；IEA | 将物料表映射到电池剖面 | 不代表所有品牌和型号 |
| NMC 与 LFP 使用不同阴极材料 | 化学路线对应材料集合 | 路线 | 当前商业路线 | IEA；UNCTAD | 标准化材料名称 | 两者还有多种子型号 |
| LFP 不使用镍、锰、钴作为阴极活性材料，但仍需锂且常配石墨阳极 | 材料有无及功能 | 路线 | 当前商业路线 | IEA | 二元有无编码 | 不等于整包完全不含相关元素 |
| 2025 年各矿物主要开采国及份额 | 矿山产量、全球占比 | 国家×矿物 | 2025 | USGS MCS 2026 | 国家产量/世界合计 | USGS 数值含估算和四舍五入 |
| 关键能源矿物前三大精炼国平均份额约由 82% 升至 86% | 精炼份额 | 六类矿物综合 | 2020—2024 | IEA 2025 | 使用 IEA 已发布综合指标 | 只适用于 IEA 所列矿物 |
| 同期约 90% 精炼供应增量来自单一领先供应国 | 净增量份额 | 矿物×领先国 | 2020—2024 | IEA 2025 | 原样引用结论并拆分材料 | “增量”不等于总产量份额 |
| 矿山前三大生产国平均份额由 73% 升至 77% | 矿山份额 | 六类矿物综合 | 2020—2024 | IEA 2025 | 使用 IEA 已发布综合指标 | 与精炼口径保持区分 |
| 刚果（金）约占 2025 年全球钴开采量 74% | 钴矿山产量份额 | 国家 | 2025 | UNCTAD 2026；与 USGS 交叉核对 | 该国产量/世界合计 | 估算可能随修订变化 |
| 手工及小规模钴矿存在童工风险 | 项目和风险描述 | 特定采矿部门 | 当前项目期 | ILO | 定性引用 | 不外推到全部刚果（金）钴 |
| LFP 与 NMC 的成本和能量密度不同 | 每 kWh 平均价格；Wh/kg 或相对差 | 路线 | 2025 | IEA Global EV Outlook 2026 | 只使用同口径比较 | 市场、车辆级别和用途影响结果 |
| 自 2020 年以来全球新增电池回收能力约三分之二在中国 | 新增回收能力地域份额 | 国家 | 2020—2024/报告口径 | IEA 2025 | 引用已发布结论 | 产能不等于实际回收量 |
| 关闭一个主要供应国会暴露哪些材料 | 国家份额和集中度 | 国家×材料×阶段 | 基准年 | USGS；IEA | 静态扣除选中国家份额 | 不代表真实缺口或价格变化 |
| 锂需求至 2040 年可能显著增长 | 情景需求指数 | 全球 | 2024—2040 | UNCTAD 2026 | 基准年指数化 | 必须标为预测/情景，不是事实结果 |

## Transformations

v2 前需要确定并记录：

1. USGS 各矿物单位统一为公吨；不得在金属含量、矿石重量和化合物重量之间直接相加。
2. 国家份额按同一出版物给出的世界合计计算，并保留 USGS 的估算标记。
3. IEA 的矿山与精炼数据分表保存，不因地图切换而覆盖原始字段。
4. NMC、LFP 物料表按每 kWh 或每个参考电芯统一，不混用整包质量。
5. 压力测试只做 `exposed_share = selected_country_supply / global_supply`；缺失加工数据时显示“不可计算”，不以矿山份额代替。
6. 预测数据保存 `scenario`、`publication_year`、`target_year`，在视觉中同屏显示。
7. 若无法获得可再分发的 IEA 原始数据，只保存可公开引用的派生小表和来源指针，不复制受限完整数据集。

## Quality checks

- duplicates：按 `mineral + stage + country_iso3 + year + source_version` 检查唯一性；
- missingness：区分真零、未报告、合并为“其他”和不可得；
- category drift：核对天然/人造石墨、矿山/精炼、产量/产能、金属/化合物口径；
- outliers：与前一年及第二来源比较大幅变化，保留修订说明；
- reconciliation：国家和“其他”份额之和允许因四舍五入不等于 100%，不得强行缩放掩盖差异；
- geography：历史国家名称和 ISO3 映射人工复核；
- chemistry：电芯、模组、电池包边界一致。

## Limitations

- 公开国家统计不能追踪某批矿物最终进入哪一家电池厂；
- 精炼产量、加工产能和贸易额描述的是不同现象；
- 企业纵向整合、长期合同、库存和品质差异不会由国家份额完全反映；
- 电池配方快速变化，参考电芯必须标注模型版本；
- 供应集中是一种暴露指标，不等于短缺概率；
- 劳工和环境影响不能由国家产量数字推断；
- 回收产能、回收投入量、回收效率和再生材料使用量不得互换。

## Reproduction

v2 数据处理计划：

1. 下载并归档 USGS MCS 2026 数据发布；
2. 建立矿物—国家—阶段—年份长表；
3. 获取或人工核验 IEA 公开图表对应小表；
4. 导入 Argonne 参考电芯物料表；
5. 建立材料名称、单位和 ISO3 对照表；
6. 输出地图、路线比较器和压力测试所需的最小 JSON；
7. 对每个页面数字生成可追溯的来源行和计算式；
8. 在实现前冻结一个带版本号的数据快照。
