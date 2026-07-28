<script>
  let view = $state("native");
  const views = {
    native: {
      label: "卫星原生像素",
      number: "≈ 500 米",
      note: "VIIRS 的一个原生像素混合了建筑、道路、车辆与空地发出的光。",
      cells: 1
    },
    modeled: {
      label: "30 米模型网格",
      number: "约 17 × 17 格",
      note: "研究者结合 Landsat、Sentinel、道路与建筑数据向下建模；这些小格是估计，不是新增的卫星观测。",
      cells: 289
    }
  };
  let current = $derived(views[view]);
</script>

<section class="pixel-section" aria-labelledby="pixel-title">
  <div class="pixel-section__copy">
    <p class="eyebrow">02 / 先学会不误读</p>
    <h2 id="pixel-title">卫星看到的，<br />不是一户人家的灯。</h2>
    <p>
      VIIRS Black Marble 的原生网格约为 15 角秒，在波多黎各大致相当于
      <strong>500 米</strong>。一个像素可能同时包含住宅、商店、路灯、车流和黑暗的空地。
    </p>
    <p>
      把尺度切换到 30 米，看看“更精细”究竟意味着什么。
    </p>
  </div>

  <div class="pixel-explainer">
    <div class="pixel-explainer__controls" role="group" aria-label="切换夜间灯光尺度">
      {#each Object.entries(views) as [id, item]}
        <button
          type="button"
          class:active={view === id}
          aria-pressed={view === id}
          onclick={() => (view = id)}
        >
          {item.label}
        </button>
      {/each}
    </div>

    <div class:modeled={view === "modeled"} class="pixel-map">
      <div class="pixel-map__streets" aria-hidden="true">
        {#each Array(28) as _, index}
          <i class:vertical={index % 3 === 0}></i>
        {/each}
      </div>
      <div class="pixel-map__buildings" aria-hidden="true">
        {#each Array(34) as _, index}
          <b style={`--x:${(index * 37) % 92}%;--y:${(index * 61) % 88}%`}></b>
        {/each}
      </div>
      <div
        class="pixel-map__grid"
        aria-label={view === "native"
          ? "一个约 500 米的 VIIRS 原生像素覆盖许多道路和建筑"
          : "同一区域被模型分成约 17 乘 17 个 30 米估计网格"}
      >
        {#if view === "modeled"}
          {#each Array(current.cells) as _}<span></span>{/each}
        {/if}
      </div>
      <strong>{current.number}</strong>
    </div>

    <div class="pixel-explainer__reading" aria-live="polite">
      <span>{view === "native" ? "观测" : "模型"}</span>
      <p>{current.note}</p>
    </div>
    <p class="pixel-explainer__rule">
      <b>可以说：</b>这一片区域的夜间辐亮度改变了。<br />
      <b>不能说：</b>这个家庭此刻一定停电。
    </p>
  </div>
</section>
