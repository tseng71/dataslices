const progress=document.querySelector("#progressBar");
const stage=document.querySelector(".object-stage");
const rows=[...document.querySelectorAll(".archive-row")];
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;

function update(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=`${max?scrollY/max*100:0}%`;
  if(!reduced&&stage){
    const rect=stage.getBoundingClientRect();
    const amount=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
    stage.style.setProperty("--open",amount.toFixed(3));
  }
}
addEventListener("scroll",update,{passive:true});
addEventListener("resize",update);
update();

if("IntersectionObserver" in window&&!reduced){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle("in-view",entry.isIntersecting));
  },{rootMargin:"-10% 0px -10%",threshold:.18});
  rows.forEach(row=>observer.observe(row));
}
