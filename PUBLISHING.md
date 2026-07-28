# 发布说明

DataSlices 只使用 **GitHub 仓库 + GitHub Pages**，每个故事一个独立目录。

## 地址

- 首页：`https://tseng71.github.io/dataslices/`
- 城市熄灯：`/stories/lights-out/`
- 电池：`/stories/battery-world-map/`
- 星空：`/stories/disappearing-stars/`
- 城市热：`/stories/nyc-heat/`
- AI 成本：`/stories/ai-cost/`

## 自动发布

推送到 `main` 后，`.github/workflows/pages.yml` 会：

1. 使用锁定版本安装《城市熄灯》的 Svelte 5 依赖；
2. 运行 `svelte-check` 并静态预渲染故事；
3. 检查四篇早期静态故事与新故事的文档、数据和构建产物；
4. 组装 Pages artifact 并部署。

构建产物只在工作流中写入 `stories/lights-out/build`，不会提交到仓库，也不会覆盖其他故事。

## 发布前检查

- 设计、正文、方法、来源与实现对照表同步；
- 首页四张故事卡均可到达；
- 核心互动在桌面和手机端可用；
- 情景和估算没有写成实测或预测；
- `main` 上的工作流成功。
