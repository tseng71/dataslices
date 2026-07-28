# 《消失的星空》设计—实现追溯表

> v1.0 状态更新：2026-07-28。网页实现以 `02-storyboard-wireframes-v2.md` 为主要规格。

## 实现依据

1. `../../../docs/dataslices-overall-design.md`
2. `01-concept-design-v1.md`
3. `02-storyboard-wireframes-v2.md`
4. `manuscript.md`
5. `methodology.md`
6. `sources.md`

## v2 模块对照

| 设计模块 | 实现位置 | v1.0 状态 | 数据/视觉性质 |
|---|---|---|---|
| Hero 星星消失 | `index.html #top`；`story.js updateHero()` | 完成 | 固定星表、固定投影，按视星等阈值淡出；光穹为机制模拟 |
| 全球尺度引言 | `.intro`、`.big-fact` | 完成 | 研究结论与大数字叙事 |
| 250→100 代际情景 | `#ageStory`；`ageState()` | 完成 | 年龄、可见极限和显示星数由统一函数驱动；明确为全球平均情景 |
| 可见极限滑杆 | `#limitSection`；`updateLimit()` | 完成 | 2.0—6.5等、步长0.1、键盘可操作 |
| 光穹机制 | `.mechanism-diagram` | 完成 | 区分直接向上光、地面反射与大气散射 |
| 地点—星空联动 | `.locations`；`setLocation()` | 完成 | 真实地点名称与相对位置图；数值使用环境类型区间，不声称实时实测 |
| 两把尺子 | `.two-rulers` | 完成 | 明确区分地面辐亮度与肉眼可见极限 |
| 五种环境比较 | `#skyMultiples` | 完成 | 同一星表、投影和时间假设，只改变背景与阈值 |
| 鸟类灯光实验 | `#birdSky`；`updateBirds()` | 完成 | 固定轨迹规则解释机制，限制写入正文 |
| 照明治理实验室 | `.lighting-lab`；`updateLab()` | 完成 | 用途、方向、亮度、时间、色温；输出明确为示意指数 |
| 观察式结尾 | `.ending` | 完成 | 恢复相对较暗星空，不制造“完全恢复”的虚假圆满 |
| 方法与来源 | `.methods` + Markdown 文档 | 完成 | 方法、来源、v2设计稿和版本记录均可访问 |

## 响应式、无障碍与性能

- 桌面端分栏、sticky场景和五列小倍数已实现；
- 手机端采用68vh sticky星空、地图与星空上下排列、两列小倍数；
- 所有按钮触控高度不低于约44px；
- Canvas均提供 `aria-label`；
- 滑杆与地点按钮可键盘操作；
- 提供清晰焦点状态；
- 支持 `prefers-reduced-motion`；
- Canvas设备像素比上限为1.75；
- 滚动重绘通过 `requestAnimationFrame` 调度。

## 发布

- 版本：`v1.0`
- 正式网址：`https://tseng71.github.io/dataslices/stories/disappearing-stars/`
- 部署：`.github/workflows/pages.yml`
- 工作流在部署前检查首页、故事页、CSS文件和JavaScript语法。

## 变更规则

后续任何改变叙事节奏、数据口径或交互逻辑的修改，必须先更新 v2 设计稿或建立新版本设计稿，再同步更新本表。
