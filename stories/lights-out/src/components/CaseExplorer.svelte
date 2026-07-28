<script>
  import { base } from "$app/paths";
  import { cases } from "../data/story.js";

  let selected = $state("maria");
  let current = $derived(cases[selected]);
  let buttons = [];

  function choose(id, focus = false) {
    selected = id;
    if (focus) {
      const index = Object.keys(cases).indexOf(id);
      buttons[index]?.focus();
    }
  }

  function handleKeydown(event, index) {
    const ids = Object.keys(cases);
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % ids.length;
    if (event.key === "ArrowLeft") next = (index - 1 + ids.length) % ids.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ids.length - 1;
    choose(ids[next], true);
  }
</script>

<section class="cases" aria-labelledby="cases-title">
  <header class="cases__header">
    <p class="eyebrow">06 / 证据比较器</p>
    <h2 id="cases-title">同一种夜光，<br />并不总能回答同一个问题。</h2>
    <p>
      四次事件的图像、时间窗口与地面证据并不相同。这里比较的是证据能力，
      不是灾害严重程度，也不是跨事件亮度排行。
    </p>
  </header>

  <div class="cases__tabs" role="tablist" aria-label="选择停电事件">
    {#each Object.values(cases) as item, index}
      <button
        bind:this={buttons[index]}
        id={`tab-${item.id}`}
        type="button"
        role="tab"
        aria-selected={selected === item.id}
        aria-controls="case-panel"
        tabindex={selected === item.id ? 0 : -1}
        onclick={() => choose(item.id)}
        onkeydown={(event) => handleKeydown(event, index)}
      >
        {item.tab}
      </button>
    {/each}
  </div>

  <div
    class="cases__panel"
    id="case-panel"
    role="tabpanel"
    aria-labelledby={`tab-${current.id}`}
  >
    <figure class="cases__visual">
      <img
        src={`${base}/assets/${current.image}`}
        alt={current.imageAlt}
        width="1200"
        height="800"
      />
      <figcaption>
        <span>{current.period}</span>
        <strong>{current.place}</strong>
      </figcaption>
    </figure>

    <div class="cases__copy">
      <p class="cases__place">{current.grain}</p>
      <h3>{current.title}</h3>
      <dl>
        <div>
          <dt>卫星看到</dt>
          <dd>{current.observed}</dd>
        </div>
        <div>
          <dt>地面核验</dt>
          <dd>{current.corroborated}</dd>
        </div>
        <div>
          <dt>可以支持</dt>
          <dd>{current.supports}</dd>
        </div>
        <div class="limit">
          <dt>不能推出</dt>
          <dd>{current.limit}</dd>
        </div>
      </dl>
    </div>
  </div>
</section>
