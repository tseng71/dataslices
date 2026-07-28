# 发布说明

DataSlices 只使用 **GitHub 仓库 + GitHub Pages**。ChatGPT Sites 不再作为发布目标。

## 发布前提

- 仓库：`tseng71/dataslices`
- 默认分支：`main`
- Pages 工作流：`.github/workflows/pages.yml`
- 目标网址：`https://tseng71.github.io/dataslices/`

## 首次发布

1. 将仓库可见性改为 **Public**；
2. 打开 **Settings → Pages**；
3. 在 **Build and deployment** 中将 **Source** 设为 **GitHub Actions**；
4. 打开 **Actions**，确认 `Deploy DataSlices to GitHub Pages` 成功；
5. 访问 `https://tseng71.github.io/dataslices/`；
6. 检查首页与 `/stories/disappearing-stars/`；
7. 在 README 中记录正式版本和 commit；
8. 正式完成后创建 tag，例如 `story-disappearing-stars-v1.0`。

## 每次更新

推送到 `main` 后，GitHub Actions 会重新部署。发布前必须确认：

- 设计、正文、方法、来源与实现对照表已经同步更新；
- 页面没有明显断链；
- 核心互动在桌面和手机端可用；
- 演示数据没有被写成实测结论；
- 当前版本状态在 README 中准确标注。

## 回滚

若新版本出现严重问题：

1. 找到上一个稳定 commit；
2. 创建修复 commit 或 revert；
3. 推送到 `main`；
4. 等待 Pages 工作流重新部署；
5. 记录回滚原因。
