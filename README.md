# DataSlices / 数据切片

数据切片是一个面向公众的数据叙事项目。每个故事都以独立目录保存研究文档、数据、方法说明和可发布的网站文件。

## 项目结构

```text
dataslices/
├── index.html                     # 故事索引页
├── styles.css                     # 站点通用样式
├── docs/                          # 项目级文档
│   ├── editorial-principles.md
│   └── story-template.md
├── stories/
│   └── disappearing-stars/        # 《消失的星空》
│       ├── index.html
│       ├── story.css
│       ├── story.js
│       ├── docs/
│       │   ├── story-design.md
│       │   ├── manuscript.md
│       │   ├── methodology.md
│       │   └── sources.md
│       ├── data/
│       │   ├── locations.json
│       │   └── sky-scenarios.json
│       └── assets/
└── .github/workflows/pages.yml    # GitHub Pages 自动部署
```

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 发布

仓库包含 GitHub Pages Actions 工作流。将仓库 Pages Source 设为 **GitHub Actions** 后，每次推送到 `main` 都会自动发布。

## 当前故事

- [消失的星空：一代人失去了多少颗星？](stories/disappearing-stars/)

## 内容原则

- 可视化必须推进叙事，不作为装饰。
- 明确区分观测、模型、估算与情景模拟。
- 不把卫星夜间灯光直接等同于地面天空亮度。
- 阅读时间以上线后的真实测试中位数为准。
