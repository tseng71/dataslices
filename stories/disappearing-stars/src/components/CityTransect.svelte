<script>
  import StarField from "./StarField.svelte";
  import { places } from "../data/story.js";

  let { story } = $props();
  let place = $derived(story.visual.place);
  let threshold = $derived(place.model_implied_naked_eye_limit.upper_vmag);
  let ratioLabel = $derived(
    place.model_value.artificial_to_natural_ratio_upper === null
      ? `> ${place.model_value.artificial_to_natural_ratio_lower} 倍`
      : `${place.model_value.artificial_to_natural_ratio_lower}—${place.model_value.artificial_to_natural_ratio_upper} 倍`
  );

  const bandColors = {
    white: "#f0ebdd",
    pink: "#d2a7c7",
    magenta: "#9b8fc8",
    "light-blue": "#83c5d5"
  };

  function distanceX(item) {
    return 55 + Math.sqrt(item.distance_from_times_square_km / 182.2) * 690;
  }
</script>

<section
  class="chapter transect"
  data-place-scene
  data-place-id={place.place_id}
  data-contract-target={place.place_id === "montauk-point" ? "place-montauk-point" : "place-times-square"}
  aria-labelledby="place-heading"
>
  <div class="section-kicker">03 · 地点</div>
  <div class="chapter-heading">
    <h2 id="place-heading">同一座城，不只有一种夜晚</h2>
    <p>天上的恒星没有因你向东移动而改变。地点改变的是背景。</p>
  </div>

  <div class="transect-grid">
    <div class="transect-panel">
      <svg viewBox="0 0 800 230" role="img" aria-label="从时代广场到蒙托克角的模型亮度剖面">
        <path class="coast-line" d="M54 154 C180 145 260 170 380 142 S620 100 748 77" />
        <line class="distance-axis" x1="55" y1="185" x2="745" y2="185" />
        {#each places as item}
          <g
            class:selected={item.place_id === place.place_id}
            transform={`translate(${distanceX(item)} ${154 - item.model_implied_naked_eye_limit.upper_vmag * 17})`}
          >
            <circle r={item.place_id === place.place_id ? 10 : 7} fill={bandColors[item.model_value.atlas_band]} />
            <line y1="12" y2={170 - (154 - item.model_implied_naked_eye_limit.upper_vmag * 17)} />
          </g>
        {/each}
        <text x="55" y="215">时代广场</text>
        <text x="745" y="215" text-anchor="end">蒙托克角 · 182 km</text>
        <text x="55" y="28">模型隐含的肉眼极限星等（仅作区间尺）</text>
      </svg>

      <div class="place-readout">
        <div>
          <p class="eyebrow">World Atlas 模型档</p>
          <h3>{place.display_name}</h3>
        </div>
        <p class="place-ratio">{ratioLabel}<small> 人工 / 自然天空亮度</small></p>
      </div>
      <dl class="model-meta">
        <div><dt>证据</dt><dd>模型</dd></div>
        <div><dt>基准年</dt><dd>{place.model_year}</dd></div>
        <div><dt>分辨率</dt><dd>30 角秒</dd></div>
        <div><dt>现场校验</dt><dd>本版未使用局部观测</dd></div>
      </dl>
    </div>

    <StarField
      sceneId={place.place_id === "montauk-point" ? "place-montauk-point" : "place-times-square"}
      threshold={threshold}
      showLabels={false}
      showLines
      compact
    />
  </div>

  <div class="place-buttons" role="group" aria-label="选择地点">
    {#each places as item}
      <button
        type="button"
        aria-pressed={item.place_id === place.place_id}
        onclick={() => story.setPlace(item.place_id)}
      >
        <span>{item.display_name}</span>
        <small>{item.distance_from_times_square_km} km</small>
      </button>
    {/each}
  </div>
  <p class="caveat">
    Atlas 是晴空天顶区域模型，不是某晚、某人、某街角的预报；公园能减少直接眩光，却不一定离开整座城市的光穹。
  </p>
</section>
