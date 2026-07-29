# 实现追踪矩阵

状态：Stage 5 本地实现候选版完成；浏览器验收被环境策略阻塞  
设计版本：`02-storyboard-wireframes-v2`
内容版本：`stage4-content-v1`（已确认）
实现版本：`stage5-local-rc1`

| 场景 ID | 设计帧 | 数据依赖 | 预计组件 | 关键验收 | 当前状态 |
|---|---|---|---|---|---|
| `opening-yyds` | KF-01 / M-KF-01 | 无 | `OpeningMark.svelte` | 单词可读；减少动态不丢内容 | 仅设计 |
| `opening-title` | KF-01 | 无 | `OpeningTitle.svelte` | 标题与问题顺序正确 | 仅设计 |
| `encoding-year` | KF-02 / M-KF-02 | `terms`, `sources` | `TermTimeline.svelte` | YYDS 定位 2021；字号不编码热度 | 仅设计 |
| `encoding-lanes` | KF-02 / M-KF-02 | `sources`, `signals`, `contexts` | `EvidenceLanes.svelte` | 四轨定义、缺失与待核线型正确 | 仅设计 |
| `cohort-2021` | KF-03 | `terms` | `YearCohort.svelte` | 十词完整；YYDS 身份不变 | 仅设计 |
| `archive-overview` | KF-03 | `terms`, `sources` | `TermArchive.svelte` | 2005–2025；移动窗口与完整列表 | 仅设计 |
| `archive-method-breaks` | KF-03 | `sources` | `MethodBreaks.svelte` | 系列与方法变化直接标注 | 仅设计 |
| `life-paths` | 文档状态 V5 | `signals`, `contexts`, `annotations` | `LifePaths.svelte` | 未知组可见；无证据组不渲染 | 仅设计 |
| `life-paths-counterexample` | 文档状态 V5 | 同上 | `EvidenceExceptions.svelte` | 反例与缺失不被隐藏 | 仅设计 |
| `register-migration` | KF-04 | `contexts`, `signals` | `RegisterTracks.svelte` | 线型映射证据状态；无推测线 | 仅设计 |
| `register-warning` | KF-04 | 方法文本 | `MethodNote.svelte` | 非因果声明常驻 | 仅设计 |
| `template-reveal` | KF-05 / M-KF-03 | `variants`, `contexts` | `TemplateFamily.svelte` | 原句→槽位→有证据变体 | 仅设计 |
| `template-comparison` | KF-05 | `variants`, `annotations` | `TemplateComparison.svelte` | 不足时降级，不强留结论 | 仅设计 |
| `semantic-fields` | 文档状态 V8 | `annotations`, `terms` | `SemanticFields.svelte` | 同口径占比；词语可恢复 | 仅设计 |
| `semantic-caveat` | 文档状态 V8 | 编码审计 | `ConfidenceNotes.svelte` | 编码者、置信度、分母可见 | 仅设计 |
| `explorer-default` | KF-06 / M-KF-04 | 全部数据包 | `TermExplorer.svelte` | 默认 YYDS；URL 可分享；键盘可用 | 仅设计 |
| `explorer-empty` | M-KF-04 文案态 | 全部数据包 | `ExplorerEmpty.svelte` | 不空白；说明范围和建议入口 | 仅设计 |
| `ending-return` | KF-06 / M-KF-04 | `terms`, `sources` | `EndingReturn.svelte` | YYDS 回到年份与证据上下文 | 仅设计 |
| `ending-coda` | KF-06 | 方法与数据链接 | `EndingCoda.svelte` | 方法、数据、纠错入口可访问 | 仅设计 |

## 跨场景基础设施

| 能力 | 预计实现 | 验收 |
|---|---|---|
| 状态机 | `storyState.svelte.ts`（Svelte runes） | 前滚、回滚和直接跳转得到相同离散状态 |
| 对象恒常 | 稳定 `term_id` + keyed DOM/SVG | YYDS 在 V0–V10 不被替换为新节点 |
| scrolly | 原生滚动 + IntersectionObserver | 不劫持输入；观察器失败时顺序展开 |
| 数据校验 | 构建前 schema 与来源完整性检查 | 缺来源的事实记录使构建失败 |
| 图形摘要 | 每场景 `aria-labelledby` + live summary | 屏幕阅读器获得一句当前结论 |
| 静态降级 | 预渲染正文、关键图、按年词表 | JS 关闭仍能完成主论证 |
| 减少动态 | CSS media query + 状态机 instant mode | 内容、证据、焦点不丢失 |
| 视觉回归 | 合同视口截图 | 关键对象、文案和布局满足合同断言 |

生产代码开始前，必须将用户确认后的 `design-contract.json` 标记为冻结版本；任何影响中心揭示、视觉语法或场景顺序的偏离都需要先回到设计文档。

## Stage 4 数据落位

| 原设计依赖 | 当前可发布数据 | 处理决定 |
|---|---|---|
| `terms` | `data/processed/annual-network-terms.csv` | 2012—2025，14 年、140 条，逐行带官方来源 |
| `sources` | `data/processed/annual-series-coverage.csv`、`docs/sources.md` | 保留逐年口径限制；发布顺序不作热度排名 |
| `annotations` | `data/processed/term-annotations.csv` | 只发布形式编码；语义主题因缺复核暂缓 |
| `variants` | `term-annotations.csv` 中明确模板与官方变体字段 | 只展示 2019、2023、2025 有明确结构/变体证据的案例 |
| `contexts` | 2025 “情绪价值”跨语域说明及逐词官方解读 | 只画来源明确的扩展，不补写传播路径 |
| `signals` | 暂无同口径长期序列 | 搜索与新闻轨道显示为未取得，不画寿命或衰减曲线 |

## 论点变更记录

Stage 3 已预设证据不足时的降级路径。Stage 4 验证后执行该路径：

- 不支持：“模板比原词活得更久”。
- 支持：“年度档案反复记录可套用结构；有些词通过仿写或跨语域扩展留下痕迹。”
- 发布图形不得出现平均寿命、峰值、衰减或死亡判定。
- `template-comparison` 改为“严格证据门槛下的表达形式比较”，不做寿命比较。
- `semantic-fields` 保留场景位置但不发布比例；若生产实现前仍无双人复核，替换为“我们没有编码什么”的局限场景。

## 内容与证据文件

| 文件 | 作用 | Stage 4 状态 |
|---|---|---|
| `docs/manuscript.md` | 约 8—10 分钟正文 | 待用户确认 |
| `docs/methodology.md` | 方法、编码、限制与复现说明 | 待用户确认 |
| `docs/sources.md` | 人可读来源清单 | 待用户确认 |
| `docs/claim-ledger.md` | 论点—证据—限定台账 | 待用户确认 |
| `data/data-dictionary.md` | 字段、枚举与缺失规则 | 待用户确认 |
| `data/processed/*.csv` | 逐词、编码、年度汇总与覆盖 | 已机械校验，待用户确认 |
| `scripts/build-stage4-data.mjs` | 重建处理后数据 | 已运行 |

`design-contract.json` 已依据 Stage 3 用户确认冻结。Stage 4 内容已确认，Stage 5 已进入实现。

## Stage 5 代码映射

| 场景/能力 | 实现 | 数据 | 当前验收 |
|---|---|---|---|
| 开场与标题 | `src/routes/+page.svelte`、`src/app.css` | YYDS / 2021 记录 | 构建通过；浏览器截图 blocked |
| 编码、档案、路径、迁移、模板、语义限制 | `src/lib/components/StoryGraphic.svelte` | `src/lib/data/story-data.json` | 源合同检查通过；浏览器交互 blocked |
| sticky scrolly | `src/lib/components/Scrolly.svelte` | 场景定义 | IntersectionObserver + CSS sticky 已实现；运行时 blocked |
| runes 状态 | `src/lib/state/story.svelte.js` | authored / exploration | `$state`、`$derived` 分层完成；运行时 blocked |
| 探索器 | `src/lib/components/Explorer.svelte` | 140 条词与逐词注释 | 搜索、年份、形式、证据筛选及 URL 同步完成；键盘/浏览器 blocked |
| 完整词表与无脚本 | `StaticArchive.svelte`、预渲染 HTML | 140 条词 | SSR 输出存在；视觉检查 blocked |
| 方法页与下载 | `src/routes/methodology/+page.svelte`、`static/data/*` | 方法文档与 CSV | 静态输出通过 |
| 加载/错误 | `+page.svelte?test-state=` | 预渲染静态词表 | 代码完成；浏览器状态 blocked |

## 技术基线

- 2026-07-29 检查 The Pudding `website` 仓库 `main` 与项目版本 `6.3.1`。
- 上游列出 Svelte `5.1.3`、SvelteKit `^2.7.3`、adapter-static `^3.0.6`、Vite `^5.4.10`。
- 当前解析出的 SvelteKit `2.70.1` 与 Svelte `5.1.3` 有兼容警告，已修复并锁定 Svelte `5.56.8`、SvelteKit `2.70.1`、adapter-static `3.0.10`、Vite `8.1.5`。
- `npm run check`、`npm run build`、严格栈审计均通过。
- 浏览器策略拒绝云浏览器访问本机 `127.0.0.1`，所以 `design-conformance.json` 保持 `blocked`，没有伪造截图。
