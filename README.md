# DataSlices / 数据切片

数据切片是一个面向公众的数据叙事项目。每个故事都以独立目录保存总体设计、版本化故事设计稿、正文、数据、方法说明和可发布的网站文件。

## 当前状态

- 仓库：Public
- 当前故事：《消失的星空》
- 当前版本：**v1.0，已按照 v2 逐章设计稿完成网页实现**
- 发布目标：GitHub Pages
- 正式网址：https://tseng71.github.io/dataslices/
- 故事网址：https://tseng71.github.io/dataslices/stories/disappearing-stars/

## v1.0 已实现

- 12个完整场景与8—10分钟长篇叙事结构；
- Hero滚动星空、代际情景、可见极限滑杆；
- 光穹形成机制图；
- 纽约地点相对位置图与同一天区星空联动；
- 卫星与人眼“两把尺子”；
- 五种可比环境类型的小倍数星空；
- 迁徙鸟类灯光实验；
- 照明治理实验室；
- 桌面端和移动端响应式布局；
- 键盘操作、Canvas替代文字、焦点状态与 `prefers-reduced-motion`；
- 方法、来源、设计稿和版本记录入口；
- GitHub Pages自动验证与部署工作流。

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

## 网页实现依据

网页实现依次追溯到：总体设计 → v1 概念设计 → v2 逐章线框 → 正文与方法 → 实现对照表。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 发布

推送到 `main` 后，`.github/workflows/pages.yml` 会检查首页、故事页、样式文件和 JavaScript 语法，然后部署到 GitHub Pages。

## 当前故事

- [消失的星空：一代人失去了多少颗星？](stories/disappearing-stars/)

## 内容原则

- 可视化必须推进叙事，不作为装饰。
- 明确区分观测、模型、估算与情景模拟。
- 不把卫星夜间灯光直接等同于地面天空亮度。
- 地点与治理模块中的数值明确标记为区间或示意指数。
