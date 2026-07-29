<script>
  import { stars, trackedStar, countVisible, starColor, starRadius } from "../data/story.js";

  let {
    sceneId = "magnitude-encoding",
    layout = "magnitude",
    threshold = 6.5
  } = $props();

  const sorted = [...stars].sort((a, b) => a.vmag - b.vmag || a.hr - b.hr);
  const cumulativePath = sorted
    .map((star, index) => {
      const px = 92 + (star.vmag / 6.5) * 820;
      const py = 510 - (index / 249) * 390;
      return `${index === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");

  function magnitudeX(star) {
    return 92 + (star.vmag / 6.5) * 820;
  }

  function magnitudeY(star) {
    return 465 - ((star.hr * 37) % 260);
  }

  let visibleCount = $derived(countVisible(threshold));
</script>

<figure
  class="magnitude-graphic"
  data-scene-id={sceneId}
  data-state-layout={layout}
  data-threshold={threshold.toFixed(2)}
  data-visible-count={visibleCount}
  aria-labelledby={`${sceneId}-title`}
  aria-describedby={`${sceneId}-summary`}
>
  <figcaption class="sr-only" id={`${sceneId}-title`}>
    固定天区的视星等与累计恒星数量
  </figcaption>
  <svg viewBox="0 0 1000 620" role="img" aria-hidden="true">
    <rect class="plot-bg" width="1000" height="620" rx="24" />
    <g class="axis">
      <line x1="92" y1="535" x2="912" y2="535" />
      {#each [0, 1, 2, 3, 4, 5, 6] as tick}
        <line x1={92 + (tick / 6.5) * 820} y1="535" x2={92 + (tick / 6.5) * 820} y2="546" />
        <text x={92 + (tick / 6.5) * 820} y="574" text-anchor="middle">{tick}</text>
      {/each}
      <text x="92" y="46">更亮</text>
      <text x="912" y="46" text-anchor="end">更暗 · 视星等</text>
    </g>

    {#if layout === "distribution"}
      <path class="cumulative-area" d={`${cumulativePath} L912,510 L92,510 Z`} />
      <path class="cumulative-line" d={cumulativePath} />
      <text class="curve-label" x="640" y="118">累计恒星数量</text>
    {/if}

    <g class="magnitude-stars">
      {#each stars as star (star.star_id)}
        {@const visible = star.vmag <= threshold}
        <circle
          class:visible
          class:invisible={!visible}
          class:tracked={star.star_id === trackedStar.star_id}
          data-star-id={star.star_id}
          cx={magnitudeX(star)}
          cy={layout === "distribution" ? 510 - (sorted.indexOf(star) / 249) * 390 : magnitudeY(star)}
          r={Math.max(2.2, starRadius(star.vmag) * 0.72)}
          fill={visible ? starColor(star) : "none"}
        />
      {/each}
    </g>

    <g class="threshold" transform={`translate(${magnitudeX({ vmag: threshold })} 0)`}>
      <line x1="0" y1="72" x2="0" y2="535" />
      <rect x="-76" y="67" width="152" height="34" rx="17" />
      <text x="0" y="90" text-anchor="middle">可见阈值 {threshold.toFixed(2)}</text>
    </g>

    <g class="plot-readout">
      <text x="92" y="606">固定天区</text>
      <text x="912" y="606" text-anchor="end">{visibleCount} / 250 条目录星位于可见一侧</text>
    </g>
  </svg>
  <p class="sr-only" id={`${sceneId}-summary`}>
    当前阈值 {threshold.toFixed(2)} 视星等，250 条目录星中有 {visibleCount} 条位于可见一侧。
  </p>
</figure>
