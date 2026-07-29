<script>
  import { lightingPresets } from "../data/story.js";
  let { story } = $props();
  let preset = $derived(story.visual.lighting);
  let upward = $derived(preset.preset_id === "unshielded");
  let warm = $derived(preset.preset_id === "warmer");
</script>

<section
  class="chapter lighting"
  data-lighting-scene
  data-preset-id={preset.preset_id}
  data-contract-target={preset.preset_id === "shielded" ? "lighting-shielded" : "lighting-unshielded"}
  aria-labelledby="lighting-heading"
>
  <div class="chapter-heading">
    <h2 id="lighting-heading">光不必消失，只需要去对地方</h2>
    <p>五项原则改变用途、方向、亮度、时间和光谱，不制造“环保分数”。</p>
  </div>

  <div class="lighting-layout">
    <figure class="lighting-stage">
      <svg viewBox="0 0 860 560" role="img" aria-label={`${preset.display_name}灯具状态，同一地面任务区`}>
        <rect class="lighting-bg" width="860" height="560" rx="28" />
        <path class="ground" d="M0 446 Q300 425 860 445 V560 H0 Z" />
        <g class="lamp" transform="translate(270 205)">
          <path d="M0 240 V45 Q0 0 52 0 H108" />
          <path class="fixture" d="M90 -16 h72 l18 40 h-105 z" />
          {#if !upward}<path class="shield" d="M76 18 h106" />{/if}
        </g>
        {#if upward}
          <path class:warm class="light-cone upward" d="M375 230 L220 24 L550 24 Z" />
        {/if}
        <path class:warm class="light-cone downward" d="M375 230 L500 447 L256 447 Z" />
        <rect class="task-area" x="260" y="430" width="240" height="32" rx="16" />
        <text x="380" y="505" text-anchor="middle">同一地面任务区</text>
      </svg>
      <figcaption>改变维度：<strong>{preset.changed_dimension === "baseline" ? "基线" : preset.changed_dimension}</strong></figcaption>
    </figure>

    <div class="lighting-detail">
      <p class="eyebrow">当前预设</p>
      <h3>{preset.display_name}</h3>
      <dl>
        <div><dt>投向</dt><dd>{preset.targeting}</dd></div>
        <div><dt>亮度</dt><dd>{preset.level}</dd></div>
        <div><dt>控制</dt><dd>{preset.control}</dd></div>
        <div><dt>光谱</dt><dd>{preset.spectrum}</dd></div>
      </dl>
      <p class="caveat">没有完整配光与大气模型，因此这里不输出天空恢复百分比或星数。</p>
    </div>
  </div>

  <div class="preset-buttons" role="group" aria-label="选择照明原则">
    {#each lightingPresets as item}
      <button
        type="button"
        aria-pressed={item.preset_id === preset.preset_id}
        onclick={() => story.setLightingPreset(item.preset_id)}
      >
        {item.display_name}
      </button>
    {/each}
  </div>
</section>
