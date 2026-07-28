const qs=(s,p=document)=>p.querySelector(s);
const qsa=(s,p=document)=>[...p.querySelectorAll(s)];

const state={material:"lithium",stage:"mine",chem:"nmc",data:null};
const fallback={
  meta:{mineYear:2025,processingYear:2024},
  materials:{
    lithium:{name:"锂",color:"#e7b84b",role:"在正极与电解液之间搬运电荷的核心元素",mine:[{country:"澳大利亚",share:31.7,x:82,y:74},{country:"中国",share:21.4,x:73,y:39},{country:"智利",share:19.3,x:28,y:75},{country:"其他",share:27.6,x:48,y:48}],process:[{country:"中国",share:65,x:73,y:39},{country:"其他",share:35,x:48,y:48}]},
    cobalt:{name:"钴",color:"#de7358",role:"帮助部分高镍正极稳定结构并提升寿命",mine:[{country:"刚果（金）",share:73,x:53,y:61},{country:"印度尼西亚",share:14,x:78,y:66},{country:"其他",share:13,x:48,y:48}],process:[{country:"中国",share:79,x:73,y:39},{country:"其他",share:21,x:48,y:48}]},
    nickel:{name:"镍",color:"#73b7a2",role:"在高镍正极里提高单位质量可储存的能量",mine:[{country:"印度尼西亚",share:66.7,x:78,y:66},{country:"菲律宾",share:6.9,x:79,y:53},{country:"其他",share:26.4,x:48,y:48}],process:[{country:"印度尼西亚",share:44,x:78,y:66},{country:"中国",share:24,x:73,y:39},{country:"其他",share:32,x:48,y:48}]},
    graphite:{name:"石墨",color:"#8c98ab",role:"构成多数锂离子电池的负极，接住充电时到来的锂离子",mine:[{country:"中国",share:82,x:73,y:39},{country:"其他",share:18,x:48,y:48}],process:[{country:"中国",share:95,x:73,y:39},{country:"其他",share:5,x:48,y:48}]}
  }
};

function updateProgress(){
  const max=document.documentElement.scrollHeight-innerHeight;
  qs("#progressBar").style.width=`${max?scrollY/max*100:0}%`;
}
addEventListener("scroll",updateProgress,{passive:true});

const cellLabels=[
  "外壳退开：密封产品开始变成一组材料。",
  "正极被点亮：锂、镍、锰和钴，或锂、铁和磷，在这里组成不同路线。",
  "负极被点亮：无论 NMC 还是 LFP，石墨通常都仍在地图上。"
];
const steps=qsa("[data-cell-step]");
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio).forEach(e=>{
      const n=Number(e.target.dataset.cellStep);
      steps.forEach(x=>x.classList.toggle("active",x===e.target));
      qs("#cellExploded").dataset.active=n;
      qs("#materialReadout").textContent=cellLabels[n];
    });
  },{rootMargin:"-35% 0px -35%",threshold:[0,.5,1]});
  steps.forEach(s=>observer.observe(s));
}
steps[0]?.classList.add("active");
qs("#cellExploded").dataset.active="0";

const staticRoles={
  manganese:"锰：与镍、钴共同构成部分 NMC 正极，也进入锰富集新路线。",
  iron:"铁：与磷组成 LFP 正极，资源广泛但仍需要电池级加工。",
  phosphorus:"磷：LFP 的关键组成；高纯磷酸的加工集中度值得单独追踪。",
  copper:"铜：常用作负极集流体，也是电网与电机的重要材料。",
  aluminium:"铝：常用作正极集流体，也进入电芯与电池包结构件。"
};

function setActive(group,selector,key,value){
  qsa(selector,group).forEach(b=>b.classList.toggle("active",b.dataset[key]===value));
}
qsa(".material-grid button").forEach(button=>button.addEventListener("click",()=>{
  qsa(".material-grid button").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  const key=button.dataset.material;
  qs("#materialRole").textContent=key&&state.data?`${state.data.materials[key].name}：${state.data.materials[key].role}。`:staticRoles[button.dataset.static];
}));

function renderMap(){
  const mat=state.data.materials[state.material];
  const rows=mat[state.stage];
  const dots=qs("#mapDots");
  dots.replaceChildren();
  rows.forEach(row=>{
    const dot=document.createElement("div");
    dot.className="map-dot";
    dot.style.left=`${row.x}%`;dot.style.top=`${row.y}%`;
    dot.style.width=dot.style.height=`${Math.max(30,Math.sqrt(row.share)*9)}px`;
    dot.style.background=mat.color;
    dot.innerHTML=`${Math.round(row.share)}%<small>${row.country}</small>`;
    dots.append(dot);
  });
  qs("#rankingList").innerHTML=rows.map(row=>`<li><div class="rank-line"><span>${row.country}</span><b>${row.share}%</b></div><div class="bar"><i style="width:${row.share}%;background:${mat.color}"></i></div></li>`).join("");
  qs("#mapLabel").textContent=state.stage==="mine"?"2025 年估算矿山产量份额":"2024 年加工/精炼份额（四舍五入）";
  qs("#worldMap").setAttribute("aria-label",`${mat.name}的${state.stage==="mine"?"矿山":"加工"}供应份额地图，最大供应地为${rows[0].country}，约${rows[0].share}%`);
}
qsa("[data-map-material]").forEach(button=>button.addEventListener("click",()=>{
  state.material=button.dataset.mapMaterial;
  setActive(qs("#supplyMap"),"[data-map-material]","mapMaterial",state.material);
  renderMap();
}));
qsa("[data-stage]").forEach(button=>button.addEventListener("click",()=>{
  state.stage=button.dataset.stage;
  setActive(qs("#supplyMap"),"[data-stage]","stage",state.stage);
  renderMap();
}));

const cobalt=qs("#cobaltDots");
for(let i=0;i<100;i++){
  const dot=document.createElement("i");
  if(i<73)dot.className="drc"; else if(i<87)dot.className="indonesia";
  cobalt.append(dot);
}

const chemistry={
  nmc:{title:"NMC：更高能量密度，更多金属组合",desc:"NMC 以镍、锰、钴和锂构成正极；高镍路线减少钴，却提高对镍品质与加工的要求。",density:"相对较高",cost:"基准",shift:"镍 / 钴",chips:[["lithium","锂"],["nickel","镍"],["cobalt","钴"],["manganese","锰"],["graphite","石墨"]]},
  lfp:{title:"LFP：移走镍和钴，依赖并未消失",desc:"LFP 以锂、铁和磷构成正极。它降低镍钴暴露与平均成本，但仍需要锂、石墨、电池级磷酸和高度集中的下游制造。",density:"相对较低",cost:"低 40%+",shift:"磷 / 加工",chips:[["lithium","锂"],["iron","铁"],["phosphorus","磷"],["graphite","石墨"]]}
};
function renderChem(){
  const c=chemistry[state.chem];
  qs("#chemTitle").textContent=c.title;qs("#chemDesc").textContent=c.desc;
  qs("#densityMetric").textContent=c.density;qs("#costMetric").textContent=c.cost;qs("#shiftMetric").textContent=c.shift;
  qs("#chemCell").innerHTML=c.chips.map(([cl,t])=>`<span class="chip ${cl}">${t}</span>`).join("");
  setActive(qs("#chemistry"),"[data-chem]","chem",state.chem);
}
qsa("[data-chem]").forEach(button=>button.addEventListener("click",()=>{state.chem=button.dataset.chem;renderChem()}));

function renderStress(){
  const chem=qs("#stressChem").value;
  const material=qs("#stressMaterial").value;
  const stage=qs("#stressStage").value;
  const row=state.data.materials[material][stage][0];
  const excluded=chem==="lfp"&&(material==="cobalt"||material==="nickel");
  const share=excluded?0:row.share;
  qs(".gauge").style.setProperty("--p",`${share}%`);
  qs("#exposureValue").textContent=excluded?"不使用":`${Math.round(share)}%`;
  qs("#exposureTitle").textContent=excluded?`LFP 正极不使用${state.data.materials[material].name}`:`${row.country} · ${state.data.materials[material].name}${stage==="mine"?"矿":"加工"}`;
  qs("#exposureText").textContent=excluded?`这会移除正极对${state.data.materials[material].name}的直接依赖，但不会移除锂、石墨和加工环节的集中风险。`:`当前选择中，最大单一国家约占 ${Math.round(share)}%。这表示地理集中暴露，不等于 ${Math.round(share)}% 的电池会立即停产。`;
  const url=new URL(location);
  url.searchParams.set("chem",chem);url.searchParams.set("material",material);url.searchParams.set("stage",stage);
  history.replaceState(null,"",url);
}
qsa("#stressTest select").forEach(s=>s.addEventListener("change",renderStress));

async function init(){
  try{
    const response=await fetch("data/materials.json");
    if(!response.ok)throw new Error("data");
    state.data=await response.json();
  }catch{state.data=fallback}
  const params=new URLSearchParams(location.search);
  ["chem","material","stage"].forEach(key=>{
    const value=params.get(key);
    const el=qs(`#stress${key[0].toUpperCase()+key.slice(1)}`);
    if(value&&el&&[...el.options].some(o=>o.value===value))el.value=value;
  });
  qs("#materialRole").textContent=`锂：${state.data.materials.lithium.role}。`;
  renderMap();renderChem();renderStress();updateProgress();
}
init();
