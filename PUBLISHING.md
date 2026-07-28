# 发布说明

## GitHub Pages

仓库已经包含 `.github/workflows/pages.yml`。首次发布需要：

1. 将本项目全部文件推送到 `main`；
2. 打开 **Settings → Pages**；
3. 将 **Source** 设为 **GitHub Actions**；
4. 等待 `Deploy DataSlices to GitHub Pages` 工作流完成。

默认网址通常为：

```text
https://<用户名>.github.io/dataslices/
```

## ChatGPT Sites

ChatGPT Sites 与 GitHub Pages 是两个独立发布目标。Sites 版本使用同一份经过验证的静态快照。现有数据切片站点：

```text
https://dataslices.aiart.chatgpt.site
```

发布后应在本文件记录 Site URL、快照时间和对应 Git commit。
