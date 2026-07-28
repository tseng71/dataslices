# DataSlices / 数据切片

数据切片是一个面向公众的数据叙事项目。每个故事都以独立目录保存总体设计、版本化故事设计稿、正文、数据、方法说明和可发布的网站文件。

## 当前状态

- 仓库：已建立并持续提交
- 当前故事：《消失的星空》
- 当前版本：**v0.1 交互原型，不是正式完成版**
- 发布目标：仅使用 GitHub Pages
- 待完成：真实星表、正式地图与地点数据、真机测试、阅读时长测试和公开部署

## 设计与文档入口

### 项目级

- [DataSlices 总体设计](docs/dataslices-overall-design.md)
- [编辑原则](docs/editorial-principles.md)
- [新故事目录模板](docs/story-template.md)

### 《消失的星空》

- [v1 概念设计稿](stories/disappearing-stars/docs/01-concept-design-v1.md)
- [v2 逐章故事板与页面线框](stories/disappearing-stars/docs/02-storyboard-wireframes-v2.md)
- [设计—实现追溯表](stories/disappearing-stars/docs/implementation-traceability.md)
- [连续正文母稿](stories/disappearing-stars/docs/manuscript.md)
- [方法与不确定性](stories/disappearing-stars/docs/methodology.md)
- [来源清单](stories/disappearing-stars/docs/sources.md)

## 项目结构

```text
dataslices/
├── index.html
├── styles.css
├── docs/
│   ├── dataslices-overall-design.md
│   ├── editorial-principles.md
│   └── story-template.md
├── stories/
│   └── disappearing-stars/
│       ├── index.html
│       ├── story.css
│       ├── story.js
│       ├── docs/
│       │   ├── 01-concept-design-v1.md
│       │   ├── 02-storyboard-wireframes-v2.md
│       │   ├── implementation-traceability.md
│       │   ├── manuscript.md
│       │   ├── methodology.md
│       │   └── sources.md
│       ├── data/
│       │   ├── locations.json
│       │   └── sky-scenarios.json
│       └── assets/
└── .github/workflows/pages.yml
```

## 网页实现依据

网页实现必须依次追溯到：总体设计 → v1 概念设计 → v2 逐章线框 → 正文与方法 → 实现对照表。设计发生变化时，先更新文档，再修改网页。

目前网页的初始原型是在完整设计稿尚未进入仓库时，根据聊天中的 v1、v2 方案和后补摘要编写。这一流程缺陷已经在 `implementation-traceability.md` 中记录；后续不再以聊天记录作为唯一开发依据。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## GitHub Pages

仓库已经包含 GitHub Pages Actions 工作流。仓库设为公开并在 **Settings → Pages → Source** 中选择 **GitHub Actions** 后，每次推送到 `main` 都会自动发布。

预期网址：

```text
https://tseng71.github.io/dataslices/
```

## 当前故事

- [消失的星空：一代人失去了多少颗星？](stories/disappearing-stars/)

## 内容原则

- 可视化必须推进叙事，不作为装饰。
- 明确区分观测、模型、估算与情景模拟。
- 不把卫星夜间灯光直接等同于地面天空亮度。
- 阅读时间以上线后的真实测试中位数为准。
