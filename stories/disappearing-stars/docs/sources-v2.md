# 《消失的星空》来源清单 v2

> 状态：第四阶段内容与证据已确认
> 审计日期：2026-07-28

## 核心来源

### S01 — Bright Star Catalogue

- Hoffleit, D. & Warren, W. H. Jr. (1991). *Bright Star Catalogue, 5th Revised Ed. (Preliminary Version)*, VizieR `V/50`.
- [NASA HEASARC 目录说明](https://heasarc.gsfc.nasa.gov/W3Browse/star-catalog/bsc5p.html)
- [CDS/VizieR 目录页](https://cdsarc.cds.unistra.fr/viz-bin/Cat?V%2F50=)
- [机器可读目录](https://cdsarc.cds.unistra.fr/ftp/cats/V/50/catalog.gz)
- 用途：HR 身份、J2000 星位、V 视星等、B−V、光谱型。
- 本地解压输入 SHA-256：`69797549cc1605aad7ff94e9325e29a1661f2a253917faaa056d9bf20b809afd`。
- 下载压缩包 SHA-256：`3dc44b1e90be8fbe5bcc7656032560f51275f985c7e3f783c9028e1838ec7bed`。
- 备注：CDS/VizieR 分发的天文目录元数据；保留作者、目录号与来源链接。

### S02 — 人眼星空趋势

- Kyba, C. C. M. et al. (2023). *Citizen scientists report global rapid reductions in the visibility of stars from 2011 to 2022*. Science, 379, 265–268.
- [论文与补充材料](https://www.science.org/doi/10.1126/science.abq7781)
- DOI：`10.1126/science.abq7781`
- 用途：51,351 次肉眼观测；全球 `9.6% ± 0.4%/年`；北美拟合参数；250→100 示例。
- 审计副本 SHA-256：`af0858fa026fb7e0578526f37359473c44d68bc43faa7afc6d195196e3523404`。

### S03 — World Atlas 论文

- Falchi, F. et al. (2016). *The new world atlas of artificial night sky brightness*. Science Advances, 2, e1600377.
- [论文](https://www.science.org/doi/10.1126/sciadv.1600377)
- DOI：`10.1126/sciadv.1600377`
- 用途：地图方法、颜色档位、30 角秒产品、全球人口与银河可见性结论。
- 许可：论文标注 CC BY-NC 4.0。

### S04 — World Atlas 数据

- Falchi, F. et al. (2016). *Supplement to: The New World Atlas of Artificial Night Sky Brightness*.
- [GFZ 数据页](https://dataservices.gfz-potsdam.de/contact/showshort.php?contactform=&id=escidoc%3A1541893)
- [数据 DOI](https://doi.org/10.5880/GFZ.1.4.2016.001)
- [KMZ](https://datapub.gfz.de/download/10.5880/GFZ.1.4.2016.001/NewWorldAtlas_ArtificialSkyBrightness.kmz)
- 用途：纽约路线点位亮度档。
- KMZ SHA-256：`4d4f907222ece25718aca688c00b8015947567890beb67b69da11f9641d90d88`。
- 许可：CC BY-NC 4.0；因此本故事及其派生地图不得被默认为可商用数据资产。

### S05 — 负责的户外照明原则

- DarkSky International & Illuminating Engineering Society. *Five Principles for Responsible Outdoor Lighting*.
- [原则全文](https://darksky.org/resources/guides-and-how-tos/lighting-principles/)
- 用途：有用途、准确投向、不过亮、受控制、偏暖色五个工程维度。
- 页面标注 2020 年发布、2024-06-11 更新。

### S06 — IES 联合声明

- Illuminating Engineering Society. *Light at Night*.
- [联合声明](https://ies.org/advocacy/light-at-night/)
- 用途：确认五项原则由 IES 与 DarkSky 联合采用，强调在需要的地点和时间限制光。

### S07 — 纽约迁徙鸟事件

- Van Doren, B. M. et al. (2017). *High-intensity urban light installation dramatically alters nocturnal bird migration*. PNAS, 114(42), 11175–11180.
- [论文](https://www.pnas.org/doi/10.1073/pnas.1708574114)
- DOI：`10.1073/pnas.1708574114`
- 用途：Tribute in Light 七个夜晚、超过 110 万只鸟、关灯后分散。
- 限定：极端临时光柱事件，不外推为普通路灯响应。

## 辅助与范围来源

### S08 — 事件保护协议背景

- NYC Bird Alliance. [Tribute in Light monitoring recap](https://nycbirdalliance.org/blog/tribute-in-light-2024-recap-ensuring-safe-passage-for-birds)
- Cornell Lab of Ornithology. [The 9/11 Tribute in Light and bird migration](https://www.birds.cornell.edu/home/the-9-11-tribute-in-light-is-helping-us-learn-about-bird-migration-2/)
- 用途：解释为什么研究现场会暂时关灯；正文中的定量值仍以 S07 为准。

### S09 — NASA Black Marble

- NASA. [VIIRS Black Marble](https://viirsland.gsfc.nasa.gov/Products/NASA/BlackMarble.html)
- 用途：只解释地面夜间辐亮度与天空辉光不是同一量。
- 本版不读取 Black Marble 像素，也不由卫星辐亮度直接推算星数。

## 未纳入的数据

- 未纳入纽约点位附近的 Globe at Night 单条记录，因本阶段未完成可复现的覆盖与许可审计。
- 未纳入灯具 IES 配光文件、具体光通量、地表反射率或大气传输参数。
- 未纳入 Gaia 大表；BSC 已足以支持选定亮星天区并减少许可与体量复杂度。
- 未纳入旧版 `locations.json`、`sky-scenarios.json` 中的硬编码值。

## 引用与更新规则

1. 正文事实用 `Cxx` 主张编号追溯到本文件的 `Sxx`。
2. 论文结论、模型结果、派生值与编辑插值不得合并成同一种标签。
3. 原始大文件不提交仓库；提交处理脚本、哈希、来源 URL 和派生数据。
4. 更新点位、方程、星表边界或许可时，必须重跑校验并重新经过内容确认。
