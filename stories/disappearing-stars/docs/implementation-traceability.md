# 《消失的星空》设计—实现追溯表

> v2.0 状态更新：2026-07-29。实现以第四阶段冻结设计 `05-storyboard-wireframes-v3-stage4-approved` 为准，已发布并通过公开网址验收。

## 实现依据

1. `01-concept-design-v2.md`
2. `03-research-claims-v2.md`
3. `04-manuscript-v2.md`
4. `05-storyboard-wireframes-v3.md`
5. `design-contract.json`
6. `methodology-v2.md`
7. `sources-v2.md`

## v2 模块对照

| 设计模块 | 实现位置 | 数据与视觉约束 | 状态 |
|---|---|---|---|
| 首屏城市星空与暗夜回返 | `src/components/Story.svelte`、`StarField.svelte` | 同一组 250 颗恒星保持稳定 ID；只改变阈值与背景 | 完成 |
| 视星等编码 | `MagnitudeGraphic.svelte` | 点大小与亮度编码视星等，不解释为物理尺寸 | 完成 |
| 2.48 → 5.48 阈值揭示 | `ThresholdScrolly.svelte` | 7 与 100 均由同一星表按阈值计算 | 完成 |
| 0 / 6 / 12 / 18 岁代际情景 | `GenerationScrolly.svelte`、`src/lib/state/story.svelte.js` | 四个离散节点；不把中间节点宣称为精确观测 | 完成 |
| 城市—郊外地点剖面 | `CityTransect.svelte` | 地点值为区域模型分档，不是某晚实测 | 完成 |
| 光进入天空的路径 | `LightPathExplainer.svelte` | 解释直射、反射与散射机制 | 完成 |
| 遮光前后比较 | `LightingComparison.svelte` | 只做方向性比较，不输出恢复星数或百分比 | 完成 |
| 鸟类证据与边界 | `BirdEvidence.svelte` | 文案与主张表、来源表保持一一对应 | 完成 |
| 方法、来源与结尾 | `Methods.svelte`、`static/docs/` | 方法、证据边界和可下载资料可访问 | 完成 |
| 阅读进度与滚动状态 | `ReadingProgress.svelte`、`src/components/helpers/Scrolly.svelte` | 支持键盘、触控和减少动态模式 | 完成 |

## 验证与发布

- 类型与组件检查：0 errors / 0 warnings；
- 第四阶段数据审计：250 条恒星、4 个情景节点、5 个地点、11 条主张全部通过；
- 设计合同：14 个场景、28 个场景/视口组合全部通过；
- 生产构建：SvelteKit adapter-static 输出至 `build/`；
- 正式网址：https://tseng71.github.io/dataslices/stories/disappearing-stars/
- 部署工作流：`.github/workflows/pages.yml`。

## 变更规则

后续任何改变叙事节奏、数据口径、视觉编码或交互逻辑的修改，必须先更新设计稿或建立新版本设计稿，再同步更新设计合同、QA 记录与本表。
