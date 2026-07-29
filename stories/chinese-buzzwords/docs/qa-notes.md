# Stage 5 QA 记录

状态：通过  
日期：2026-07-29  
设计版本：`02-storyboard-wireframes-v2`  
生产预览：<https://tseng71.github.io/dataslices/stories/chinese-buzzwords/>  
GitHub Actions：<https://github.com/tseng71/dataslices/actions/runs/30430663411>

## 最终结果

- GitHub Pages 构建与部署：通过。
- 浏览器一致性矩阵：53 / 53 通过，0 失败。
- 覆盖 18 个合同场景。
- 桌面：Chromium，1440 × 900。
- 手机：Chromium，390 × 844。
- 手机减少动效：Chromium，390 × 844，`prefers-reduced-motion: reduce`。
- 特殊状态：加载、数据错误、探索器空值、关闭 JavaScript 的静态回退均通过。
- 所有视口均无水平溢出；浏览器测试未记录页面脚本或控制台错误。
- 公开报告：<https://tseng71.github.io/dataslices/stories/chinese-buzzwords/qa/browser-conformance.json>
- 公开截图：`qa/screenshots/{desktop|mobile|mobile-reduced}/{scene-id}.png`。

## 构建与数据

- `npm run check`：通过，0 error / 0 warning。
- `npm run build`：通过，`@sveltejs/adapter-static` 输出静态 `build/`。
- 严格栈审计：通过；Svelte 5、SvelteKit、静态适配器、runes 状态层、sticky scrolly、IntersectionObserver 与真实本地数据均存在。
- 数据：14 年、140 条、140 个唯一 `term_id`；四类形式计数逐年合计为 10。
- 预渲染：`/` 与 `/methodology/`。
- 根路由 HTML 含完整文章、关键结论、`noscript` 文案和静态按年词表。
- 年度词表、逐词标注、年度汇总、模板例句均复制到静态输出。
- 未把语义主题空白转换为虚构比例。

## 验收迭代

1. 恢复既有 `tseng71/dataslices` GitHub Pages 工作流，解决“临时工作区没有本地 checkout”被误判为“没有仓库”的操作上下文错误。
2. 将冻结的设计合同转成 Playwright 场景矩阵，并把报告与截图作为 Pages 构建产物。
3. 修正静态开场场景定位、跨场景 YYDS 选择器作用域与探索器规范大小写。
4. 修正预览服务器 teardown；随后用 3 个受控 worker 运行 53 项检查，并设置 20 秒浏览器操作上限与逐项进度。
5. 首次完整矩阵为 51 / 53；唯一失败是无脚本模式下存在多个嵌套 `article`。
6. 将滚动步骤与探索器详情改为组件容器，保留唯一根文章地标；最终矩阵 53 / 53。

## 技术基线

2026-07-29 检查 The Pudding `website` 仓库 `main` 与其项目版本 `6.3.1`。本项目锁定：

- Svelte `5.56.8`
- SvelteKit `2.70.1`
- `@sveltejs/adapter-static` `3.0.10`
- `@sveltejs/vite-plugin-svelte` `7.2.0`
- Vite `8.1.5`

