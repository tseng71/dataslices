# DataSlices / 数据切片

数据切片是一个面向公众的数据叙事项目。每个故事都以独立目录保存设计稿、正文、数据、方法和可发布的网站文件。

## 正式网站

- 首页：https://tseng71.github.io/dataslices/
- 仓库：`tseng71/dataslices`
- 发布：GitHub Pages

## 故事目录

| # | 故事 | 路径 |
|---:|---|---|
| 05 | [城市突然熄灯时，太空看见了什么？](stories/lights-out/) | `stories/lights-out/` |
| 04 | [拆开一块电池，里面藏着一张世界地图](stories/battery-world-map/) | `stories/battery-world-map/` |
| 03 | [消失的星空](stories/disappearing-stars/) | `stories/disappearing-stars/` |
| 02 | [一个城市，两个温度](stories/nyc-heat/) | `stories/nyc-heat/` |
| 01 | [AI 的两条价格曲线](stories/ai-cost/) | `stories/ai-cost/` |

## 故事文档

每个完整故事目录包含概念设计、故事板、正文母稿、数据说明、方法、来源、实现追溯和质量检查。

### 《城市突然熄灯时》

- [v1 概念设计稿](stories/lights-out/docs/01-concept-design-v1.md)
- [v2 逐章故事板与页面线框](stories/lights-out/docs/02-storyboard-wireframes-v2.md)
- [连续正文母稿](stories/lights-out/docs/manuscript.md)
- [方法与不确定性](stories/lights-out/docs/methodology.md)
- [来源清单](stories/lights-out/docs/sources.md)
- [设计—实现追溯表](stories/lights-out/docs/implementation-traceability.md)

### 《拆开一块电池》

- [v1 概念设计稿](stories/battery-world-map/docs/01-concept-design-v1.md)
- [v2 逐章故事板与页面线框](stories/battery-world-map/docs/02-storyboard-wireframes-v2.md)
- [连续正文母稿](stories/battery-world-map/docs/manuscript.md)
- [方法与不确定性](stories/battery-world-map/docs/methodology.md)
- [来源清单](stories/battery-world-map/docs/sources.md)
- [设计—实现追溯表](stories/battery-world-map/docs/implementation-traceability.md)

## 本地预览

```bash
python3 -m http.server 8000
```

推送到 `main` 后，`.github/workflows/pages.yml` 会校验五个故事的入口、样式与 JavaScript 语法，并部署完整静态站点。

## 内容原则

- 可视化必须推进叙事，不作为装饰。
- 明确区分观测、模型、估算与情景模拟。
- 不把矿山产量、储量、加工份额和规划产能混为一谈。
- 重要互动要有移动端、键盘与无脚本阅读路径。
