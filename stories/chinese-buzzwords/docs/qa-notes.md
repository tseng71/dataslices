# Stage 5 QA 记录

状态：本地实现候选版完成；浏览器验收被环境策略阻塞  
日期：2026-07-29  
实现版本：`stage5-local-rc1`  
设计版本：`02-storyboard-wireframes-v2`

## 已完成

- `npm run check`：通过，0 error / 0 warning。
- `npm run build`：通过，`@sveltejs/adapter-static` 输出静态 `build/`。
- 严格栈审计：通过；检测到 Svelte 5、SvelteKit、静态适配器、runes 状态层、sticky scrolly、IntersectionObserver、真实本地数据。
- 数据：14 年、140 条、140 个唯一 `term_id`；四类形式计数逐年合计为 10。
- 预渲染：`/` 与 `/methodology/`。
- 无脚本：根路由 HTML 含完整文章、关键结论、`noscript` 文案和静态按年词表。
- 数据下载：年度词表、逐词标注、年度汇总、模板例句均复制到静态输出。
- 证据补强：“数据千万条，奋斗第一条”“辅助驾驶千万条，安全行驶第一条”各有独立来源。
- 未把语义主题空白转换为虚构比例。

## 工具链

2026-07-29 检查 The Pudding `website` 仓库 `main` 分支与其 `package.json`：

- 上游项目版本：`6.3.1`
- 上游当时列出的核心版本：Svelte `5.1.3`、SvelteKit `^2.7.3`、adapter-static `^3.0.6`、Vite `^5.4.10`

实际首次安装时，npm 将 SvelteKit 解析到 `2.70.1`，与固定的 Svelte `5.1.3` 产生 API 警告。修复后锁定：

- Svelte `5.56.8`
- SvelteKit `2.70.1`
- `@sveltejs/adapter-static` `3.0.10`
- `@sveltejs/vite-plugin-svelte` `7.2.0`
- Vite `8.1.5`

## 浏览器阻塞

本地 Playwright 浏览器下载被网络截断；随后按浏览器技能切换到云浏览器。云浏览器安全策略明确拒绝访问 `http://127.0.0.1:4173/`。因此以下项目没有被标为通过：

- 每个场景 × 桌面 / 移动 / 减少动态的实现截图；
- 实际浏览器中的 sticky、回滚、刷新和 URL 深状态；
- 鼠标、键盘、触控尺寸下的探索器操作；
- 真实浏览器中的 200% 放大、视觉重叠与截图对照；
- console error 与 Core Web Vitals。

`design-conformance.json` 对所有浏览器场景如实记录 `blocked`，没有使用设计关键帧冒充实现截图。

## 继续条件

需要一个可被验收浏览器访问的预览地址，或环境恢复本机浏览器能力。取得后必须：

1. 对合同中的每个场景和视口生成截图；
2. 运行全部语义断言；
3. 检查回滚、刷新、键盘、减少动态和无脚本；
4. 自动修复实现级失败并全量复测；
5. 只有 `blocked=0`、`fail=0` 后才可提交 Stage 5 预览确认。

