import evidence from "../../data/evidence.json";

export { evidence };

export const recoveryBins = [
  {
    id: "under-60",
    label: "60 天内",
    count: 4,
    cumulative: 4,
    day: 60,
    color: "#ffe07a"
  },
  {
    id: "60-90",
    label: "60–90 天",
    count: 40,
    cumulative: 44,
    day: 90,
    color: "#ff9e62"
  },
  {
    id: "90-120",
    label: "90–120 天",
    count: 53,
    cumulative: 97,
    day: 120,
    color: "#e05a8f"
  },
  {
    id: "over-120",
    label: "120 天以上",
    count: 3,
    cumulative: 100,
    day: 150,
    color: "#8064c8"
  }
];

export const recoveryCells = Array.from({ length: 100 }, (_, index) => {
  const position = index + 1;
  const bin =
    recoveryBins.find((entry) => position <= entry.cumulative) ??
    recoveryBins[recoveryBins.length - 1];
  return {
    id: position,
    bin: bin.id,
    label: bin.label,
    day: bin.day,
    color: bin.color
  };
});

export const recoveryStates = [
  {
    id: "storm",
    day: 0,
    lit: 0,
    date: "2017 年 9 月 20 日",
    kicker: "风暴经过",
    title: "一座岛，在一夜之间失去电网。",
    body: "这时还不能从一张夜图断言每户是否停电。云、月光与临时光源都会改变单日观测，所以研究者把连续影像与电力记录放在一起。",
    takeaway: "0%：这里只把风暴当日设为叙事起点，不把它当作逐户停电统计。"
  },
  {
    id: "day-60",
    day: 60,
    lit: 4,
    date: "两个月内",
    kicker: "最早恢复的一小部分",
    title: "100 格里，只有 4 格亮起。",
    body: "论文对圣胡安样本街区的估计显示，只有 4% 在 60 天内恢复。城市核心的亮光已经回来，但绝大多数街区仍在等待。",
    takeaway: "4% 的样本街区估计在 60 天内恢复。"
  },
  {
    id: "day-90",
    day: 90,
    lit: 44,
    date: "三个月内",
    kicker: "恢复开始加速",
    title: "又有 40 格亮起；过半仍未恢复。",
    body: "60–90 天是第一段大规模恢复期。到第 90 天，累计 44% 的样本街区恢复，地图的整体亮度却很容易让人误以为等待快结束了。",
    takeaway: "累计 44% 恢复；56% 仍未恢复。"
  },
  {
    id: "day-120",
    day: 120,
    lit: 97,
    date: "四个月内",
    kicker: "大多数已经亮起",
    title: "97 格亮了，最后 3 格反而更重要。",
    body: "53% 的样本街区落在 90–120 天这一档。整体指标此时接近“恢复”，但仍在黑暗中的地方会从平均值里消失。",
    takeaway: "累计 97% 恢复；3% 的样本街区仍在等待。"
  },
  {
    id: "after-120",
    day: 150,
    lit: 100,
    date: "120 天以后",
    kicker: "最后亮起的街区",
    title: "最后 3 格，等了四个月以上。",
    body: "一个城市重新发光的时刻，并不是所有人的停电同时结束的时刻。恢复是许多个街区时钟，而不是一只总开关。",
    takeaway: "3% 的样本街区估计等待超过 120 天。"
  }
];

export const cases = {
  maria: {
    id: "maria",
    tab: "Maria",
    place: "波多黎各",
    title: "飓风 Maria",
    period: "2017.09.20 → 2018.03.20",
    image: "maria-jan-mar.webp",
    imageAlt: "波多黎各在飓风 Maria 后的恢复时长图",
    grain: "六个月、全岛与街区",
    observed: "Black Marble 夜间灯光持续变化",
    corroborated: "电力局记录、人口、道路与建筑资料",
    supports: "恢复时间如何在空间上分布",
    limit: "不能判断某一家庭在某一刻是否通电"
  },
  caracas: {
    id: "caracas",
    tab: "加拉加斯",
    place: "委内瑞拉",
    title: "2019 年大停电",
    period: "2019.03.01 → 03.28",
    image: "caracas-march-chart.webp",
    imageAlt: "2019 年 3 月加拉加斯夜间灯光与大停电时段图表",
    grain: "一个月、城市日序列",
    observed: "城市夜间辐亮度异常下降",
    corroborated: "经定位的社交媒体停电报告",
    supports: "停电发生时间与城市尺度的异常",
    limit: "不能直接定位每个断电住户"
  },
  ian: {
    id: "ian",
    tab: "Ian",
    place: "佛罗里达",
    title: "飓风 Ian",
    period: "2022.08.30 ↔ 09.30",
    image: "ian-after.jpg",
    imageAlt: "飓风 Ian 过后的佛罗里达夜间灯光",
    grain: "灾前与灾后两个发布日期",
    observed: "同范围 Black Marble 前后影像",
    corroborated: "NASA 事件制图与灾害时间线",
    supports: "灾后哪些区域明显变暗",
    limit: "两个日期之间的逐日恢复过程不可见"
  },
  beryl: {
    id: "beryl",
    tab: "Beryl",
    place: "休斯敦",
    title: "飓风 Beryl",
    period: "2024.07.09",
    image: "beryl-after.webp",
    imageAlt: "飓风 Beryl 后休斯敦周边的夜间灯光影像",
    grain: "灾后一夜、都会区",
    observed: "NASA/NOAA 发布的灾后影像",
    corroborated: "飓风登陆和大范围停电记录",
    supports: "灾后第一夜的空间暗区",
    limit: "单夜影像不能给出完整恢复时长"
  }
};
