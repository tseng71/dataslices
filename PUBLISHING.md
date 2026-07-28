# 发布说明

DataSlices 只使用 **GitHub 仓库 + GitHub Pages**，每个故事一个独立目录。

## 地址

- 首页：`https://tseng71.github.io/dataslices/`
- 电池：`/stories/battery-world-map/`
- 星空：`/stories/disappearing-stars/`
- 城市热：`/stories/nyc-heat/`
- AI 成本：`/stories/ai-cost/`

## 自动发布

推送到 `main` 后，`.github/workflows/pages.yml` 会：

1. 检查五个故事入口、样式与 JavaScript；
2. 检查新故事的 v2 设计稿、方法与来源；
3. 上传仓库静态文件；
4. 部署到 GitHub Pages。

发布流程不会解包或覆盖任何故事目录。

## 发布前检查

- 设计、正文、方法、来源与实现对照表同步；
- 首页四张故事卡均可到达；
- 核心互动在桌面和手机端可用；
- 情景和估算没有写成实测或预测；
- `main` 上的工作流成功。
