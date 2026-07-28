const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-curtain]").forEach(curtain=>{
  const range=curtain.querySelector(".curtain-range");
  const after=curtain.querySelector(".curtain-after-wrap");
  const line=curtain.querySelector(".curtain-line");
  const update=()=>{
    const value=Number(range.value);
    after.style.clipPath=`inset(0 0 0 ${value}%)`;
    line.style.left=`${value}%`;
  };
  range.addEventListener("input",update);
  update();
});

const progress=document.querySelector(".reading-progress span");
const updateProgress=()=>{
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  const value=scrollable>0?Math.min(1,Math.max(0,window.scrollY/scrollable)):0;
  progress.style.width=`${value*100}%`;
};
window.addEventListener("scroll",updateProgress,{passive:true});
window.addEventListener("resize",updateProgress);
updateProgress();

const steps=[...document.querySelectorAll(".step")];
const earlyMap=document.querySelector('[data-map="early"]');
const lateMap=document.querySelector('[data-map="late"]');
const shade=document.querySelector(".map-shade");
const date=document.querySelector(".map-date");
const title=document.querySelector(".map-annotation strong");
const note=document.querySelector(".map-annotation p");
const clock=document.querySelector(".clock-value");

const states={
  storm:{
    day:"0",date:"2017.09.20",title:"风暴经过",note:"整座岛的电网遭到破坏。",
    early:1,late:0,shade:.78
  },
  early:{
    day:"60",date:"2017.11.20",title:"中心先亮",note:"外围与山区仍有大片区域等待。",
    early:1,late:0,shade:0
  },
  middle:{
    day:"120",date:"2018.01.20",title:"差距拉开",note:"同一都会区出现数十天的恢复差异。",
    early:.18,late:.82,shade:0
  },
  late:{
    day:"180",date:"2018.03.20",title:"大部分恢复",note:"最晚恢复的区域仍清晰可见。",
    early:0,late:1,shade:0
  }
};

function setRecoveryState(step){
  steps.forEach(item=>item.classList.toggle("is-active",item===step));
  const state=states[step.dataset.mapState];
  if(!state)return;
  earlyMap.style.opacity=state.early;
  lateMap.style.opacity=state.late;
  shade.style.opacity=state.shade;
  date.textContent=state.date;
  title.textContent=state.title;
  note.textContent=state.note;
  clock.textContent=state.day;
  const url=new URL(window.location);
  url.searchParams.set("day",step.dataset.day);
  history.replaceState(null,"",`${url.pathname}${url.search}${url.hash}`);
}

if("IntersectionObserver" in window){
  const stepObserver=new IntersectionObserver(entries=>{
    const visible=entries
      .filter(entry=>entry.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)setRecoveryState(visible.target);
  },{rootMargin:"-28% 0px -38% 0px",threshold:[0,.25,.5,.75]});
  steps.forEach(step=>stepObserver.observe(step));
}

const requestedDay=new URL(window.location).searchParams.get("day");
const initialStep=steps.find(step=>step.dataset.day===requestedDay)||steps[0];
setRecoveryState(initialStep);

const cases={
  maria:{
    tab:"tab-maria",
    image:"assets/maria-jan-mar.webp",
    alt:"波多黎各 2018 年 1 月至 3 月恢复图",
    date:"2017.09.20 → 2018.03.20",
    title:"飓风 Maria · 波多黎各",
    summary:"六个月尺度。全岛重新变亮，但农村与山区承担了更长等待。",
    evidence:"NASA Black Marble + 电力局记录 + 人口与道路数据",
    can:"恢复时间在空间上如何分布",
    cannot:"每户在某一时刻是否通电"
  },
  caracas:{
    tab:"tab-caracas",
    image:"assets/caracas-march-chart.webp",
    alt:"2019 年 3 月加拉加斯平均夜间灯光与带有 SinLuz 标签推文数量图表",
    date:"2019.03.07 → 2019.03.28",
    title:"全国大停电 · 加拉加斯",
    summary:"数日尺度。3 月 8 日和 10 日前后，城市平均夜光显著下探；社交媒体中的“无电”讨论同时上升。",
    evidence:"VIIRS 夜光 + 论文整理的地理定位社交媒体记录",
    can:"大停电期间城市平均夜光与公众反应如何同步变化",
    cannot:"仅凭亮度判断停电的政治或技术原因"
  },
  ian:{
    tab:"tab-ian",
    image:"assets/ian-after.jpg",
    alt:"2022 年 9 月 30 日飓风 Ian 后的佛罗里达夜间灯光",
    date:"2022.08.30 → 2022.09.30",
    title:"飓风 Ian · 佛罗里达",
    summary:"两幅同尺度影像相隔一个月。灾后图中，佛罗里达西南部的灯光覆盖明显减少。",
    evidence:"NASA Black Marble，Suomi NPP VIIRS",
    can:"灾前与灾后关键日期的灯光覆盖差异",
    cannot:"一个月内每天的恢复路径"
  },
  beryl:{
    tab:"tab-beryl",
    image:"assets/beryl-after.webp",
    alt:"2024 年 7 月 9 日飓风 Beryl 后休斯敦夜间灯光减少",
    date:"2024.07.09",
    title:"飓风 Beryl · 休斯敦",
    summary:"一夜尺度。NASA Worldview 影像记录了登陆次日休斯敦多处城市灯光减少。",
    evidence:"NASA/NOAA NOAA-20 VIIRS 夜间蓝黄合成图",
    can:"灾后第一夜哪些区域明显变暗",
    cannot:"没有同处理基准图时计算恢复率"
  }
};

const tabs=[...document.querySelectorAll('[role="tab"][data-case]')];
const panel=document.querySelector("#case-panel");

function renderCase(key,{focus=false,updateUrl=true}={}){
  const item=cases[key]||cases.maria;
  tabs.forEach(tab=>{
    const selected=tab.dataset.case===key;
    tab.setAttribute("aria-selected",String(selected));
    tab.tabIndex=selected?0:-1;
    if(selected&&focus)tab.focus();
  });
  panel.setAttribute("aria-labelledby",item.tab);
  const image=panel.querySelector("img");
  image.src=item.image;
  image.alt=item.alt;
  panel.querySelector(".case-date").textContent=item.date;
  panel.querySelector("h3").textContent=item.title;
  panel.querySelector(".case-copy>p:not(.case-date)").textContent=item.summary;
  const values=panel.querySelectorAll("dd");
  [item.evidence,item.can,item.cannot].forEach((value,index)=>values[index].textContent=value);
  if(updateUrl){
    const url=new URL(window.location);
    url.searchParams.set("event",key);
    history.replaceState(null,"",`${url.pathname}${url.search}${url.hash}`);
  }
}

tabs.forEach((tab,index)=>{
  tab.addEventListener("click",()=>renderCase(tab.dataset.case));
  tab.addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    let target=index;
    if(event.key==="ArrowRight")target=(index+1)%tabs.length;
    if(event.key==="ArrowLeft")target=(index-1+tabs.length)%tabs.length;
    if(event.key==="Home")target=0;
    if(event.key==="End")target=tabs.length-1;
    renderCase(tabs[target].dataset.case,{focus:true});
  });
});

const requestedCase=new URL(window.location).searchParams.get("event");
renderCase(cases[requestedCase]?requestedCase:"maria",{updateUrl:false});

if(reducedMotion){
  document.querySelectorAll(".step").forEach(step=>step.classList.add("is-active"));
}
