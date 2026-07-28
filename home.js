const cards=[...document.querySelectorAll(".story-card")];
const filters=[...document.querySelectorAll(".filter")];
const search=document.querySelector("#storySearch");
const noResults=document.querySelector("#noResults");
let activeFilter="all";

function updateStories(){
  const query=search.value.trim().toLocaleLowerCase("zh-CN");
  let visible=0;

  cards.forEach(card=>{
    const categories=card.dataset.category.split(" ");
    const searchable=`${card.dataset.search} ${card.textContent}`.toLocaleLowerCase("zh-CN");
    const matchesFilter=activeFilter==="all"||categories.includes(activeFilter);
    const matchesSearch=!query||searchable.includes(query);
    card.hidden=!(matchesFilter&&matchesSearch);
    if(!card.hidden) visible+=1;
  });

  noResults.hidden=visible!==0;
}

filters.forEach(button=>{
  button.addEventListener("click",()=>{
    activeFilter=button.dataset.filter;
    filters.forEach(item=>{
      const selected=item===button;
      item.classList.toggle("is-active",selected);
      item.setAttribute("aria-pressed",String(selected));
    });
    updateStories();
  });
  button.setAttribute("aria-pressed",String(button.classList.contains("is-active")));
});

search.addEventListener("input",updateStories);
