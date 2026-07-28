# 设计—实现追溯

| v2 设计要求 | 实现位置 | 状态 |
|---|---|---|
| 开灯—关灯拖动分界线 | `src/components/HeroCurtain.svelte` | 完成 |
| 停电前、灾害、变暗、恢复的叙事顺序 | `src/components/Story.svelte` | 完成 |
| 用稳定实体讲恢复 | `RecoveryScrolly.svelte` + `RecoveryField.svelte`，0/4/44/97/100 状态 | 完成 |
| 关键设施亮点的谨慎解释 | `EvidenceLadder.svelte` | 完成 |
| 多事件证据比较 | `CaseExplorer.svelte`，含键盘方向键 | 完成 |
| 原生观测与模型边界 | `PixelExplainer.svelte`，500 米/30 米切换 | 完成 |
| 城乡口径分层 | `EquityVisual.svelte`，长期停电/累计负担切换 | 完成 |
| 移动端固定视觉 | `src/styles/app.css` 760 px 断点 | 完成 |
| Svelte 5 状态层 | `$state`、`$derived`、`$effect`、`$props`；SvelteKit 静态预渲染 | 完成 |
| 键盘与减少动画 | 原生 range、tablist 键盘、reduced motion | 完成 |
| 无脚本阅读 | SSR HTML + `noscript` 提示 | 完成 |
| 方法与来源 | `Methods.svelte` 及 `docs/` | 完成 |
