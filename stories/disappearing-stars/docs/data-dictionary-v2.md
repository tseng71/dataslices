# 《消失的星空》数据字典 v2

## 通用字段

| 字段 | 类型 | 含义 |
|---|---|---|
| `schema_version` | string | 数据结构版本；本包为 `2.0.0` |
| `source` | object | 来源题名、作者、URL、日期、许可或哈希 |
| `evidence_type` | string | 观测、模型、推导、情景或视觉编码 |
| `caveat` | string | 必须与数据一起传播的限制 |

## `stars-orion-field.json`

| 字段 | 类型 | 单位／取值 | 含义 |
|---|---|---|---|
| `selection` | object | — | 天区边界、历元和筛选说明 |
| `stars` | array | 250 项 | 批准目录星 |
| `star_id` | string | `hr-####` | 跨场景稳定身份 |
| `hr` | integer | — | Harvard Revised 编号 |
| `hd` | integer/null | — | Henry Draper 编号 |
| `catalog_name_raw` | string/null | — | BSC 原始 Bayer／Flamsteed 字段 |
| `display_name_en` | string/null | — | 编辑审核的英文名 |
| `display_name_zh` | string/null | — | 编辑审核的中文名 |
| `ra_deg` | number | 度 | J2000.0 赤经 |
| `dec_deg` | number | 度 | J2000.0 赤纬 |
| `vmag` | number | mag | V 波段视星等 |
| `bv` | number/null | mag | B−V 色指数 |
| `spectral_type` | string/null | — | 光谱型 |
| `x_normalized` | number | 0—1 | 反向赤经矩形投影 |
| `y_normalized` | number | 0—1 | 赤纬矩形投影 |
| `is_named_orion_anchor` | boolean | — | 是否为故事标注锚点 |

## `generation-scenario.json`

| 字段 | 类型 | 单位／取值 | 含义 |
|---|---|---|---|
| `published_claims` | object | — | 论文年率与 250→100 端点 |
| `visual_mapping` | object | — | 编辑插值方法与限制 |
| `states` | array | 0/6/12/18 岁 | 批准节点 |
| `age_years` | integer | 年 | 情景年龄 |
| `skyglow_factor` | number | 起点倍数 | 9.6% 中心估计复利 |
| `skyglow_factor_low/high` | number | 起点倍数 | 9.2%／10.0% 复利 |
| `display_threshold_vmag` | number | mag | 编辑显示阈值 |
| `illustrative_visible_count` | integer | 条目数 | 视觉内部计数 |
| `reader_facing_count_claim` | integer/null | 星 | 只在 0/18 岁存在 |
| `evidence_type` | string | — | 出版端点或编辑插值 |

## `nyc-places.json`

| 字段 | 类型 | 单位／取值 | 含义 |
|---|---|---|---|
| `places` | array | 5 项 | 作者路线点位 |
| `place_id` | string | slug | 稳定地点 ID |
| `display_name/_en` | string | — | 中英文地点名 |
| `longitude/latitude` | number | WGS84 度 | 编辑选定地标坐标 |
| `role` | string | — | 叙事角色 |
| `distance_from_times_square_km` | number | km | 大圆直线距离 |
| `model_value.metric` | string | — | 人工／自然天顶亮度比 |
| `atlas_band` | string | 色带 ID | World Atlas 类别 |
| `artificial_to_natural_ratio_lower/upper` | number/null | 倍数 | 分档边界；开放端为 null |
| `source_pixel_rgb` | integer[3] | 0—255 | KMZ 像素 |
| `reference_rgb` | integer[3] | 0—255 | 分类参考色 |
| `palette_distance` | number | RGB 距离 | JPEG 混色诊断 |
| `model_implied_naked_eye_limit` | object | mag | 北美方程推导 NELM 区间 |
| `residual_sigma_vmag` | number | mag | 拟合残差标准差 |
| `model_year` | integer | 2014 | 模型基线 |
| `model_resolution` | string | — | 发布产品与抽样说明 |
| `nearby_observation_count` | null | — | 本版未纳入局部观测 |
| `observation_window` | null | — | 本版无局部观测窗口 |
| `coverage_status` | string | — | 缺失数据的显式状态 |
| `sampling` | object | — | 瓦片与像素坐标 |

## `lighting-presets.json`

| 字段 | 类型 | 含义 |
|---|---|---|
| `task_area` | object | 对比时保持的地面照明任务 |
| `presets` | array | 五个类别状态 |
| `preset_id` | string | 预设稳定 ID |
| `useful` | boolean | 是否有明确用途 |
| `targeting` | string | 方向与溢出 |
| `level` | string | 亮度原则 |
| `control` | string | 时段与控制 |
| `spectrum` | string | 光谱原则 |
| `changed_dimension` | string | 当前主动比较维度 |
| `quantitative_output_allowed` | boolean | 本包全部为 false |

## `evidence.json`

| 字段 | 类型 | 含义 |
|---|---|---|
| `evidence_classes` | array | 页面可见证据标签定义 |
| `claims` | array | 主张元数据 |
| `claim_id` | string | `Cxx` 稳定编号 |
| `summary` | string | 最小可审计主张 |
| `source_ids` | string[] | `sources-v2.md` 的 `Sxx` |
| `data_path` | string/null | 支撑数据文件 |
| `caveat` | string/null | 主张成立的边界 |
