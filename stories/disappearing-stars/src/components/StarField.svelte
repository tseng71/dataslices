<script>
  import { namedStars, stars, trackedStar, countVisible, starColor, starRadius } from "../data/story.js";

  let {
    threshold = 2.48,
    sceneId = "opening-city",
    label = "猎户座中心天区",
    showLabels = true,
    showLines = false,
    compact = false,
    tracked = false
  } = $props();

  const anchorByHr = new Map(namedStars.map((star) => [star.hr, star]));
  const linePairs = [
    [2061, 1790],
    [2061, 1903],
    [1790, 1852],
    [1852, 1903],
    [1903, 1948],
    [1948, 2004],
    [2004, 1713],
    [1713, 1899]
  ];

  const labelStars = namedStars.filter((star) =>
    [1713, 1790, 1852, 1903, 1948, 2004, 2061].includes(star.hr)
  );

  function x(star) {
    return 65 + star.x_normalized * 870;
  }

  function y(star) {
    return 35 + star.y_normalized * 540;
  }

  let visibleCount = $derived(countVisible(threshold));
  let takeaway = $derived(
    threshold >= 6.49
      ? `这块固定天区显示 ${visibleCount} 条目录星。`
      : `当前显示阈值为 ${threshold.toFixed(2)} 视星等，${visibleCount} 条目录星位于可见一侧。`
  );
</script>

<figure
  class:compact
  class="star-field"
  data-scene-id={sceneId}
  data-threshold={threshold.toFixed(2)}
  data-visible-count={visibleCount}
  aria-labelledby={`${sceneId}-graphic-title`}
  aria-describedby={`${sceneId}-graphic-summary`}
>
  <figcaption class="sr-only" id={`${sceneId}-graphic-title`}>{label}</figcaption>
  <svg viewBox="0 0 1000 620" role="img" aria-hidden="true">
    <defs>
      <radialGradient id={`${sceneId}-glow`}>
        <stop offset="0" stop-color="#d38b4a" stop-opacity={threshold < 3 ? 0.3 : 0.08} />
        <stop offset="1" stop-color="#070910" stop-opacity="0" />
      </radialGradient>
      <filter id={`${sceneId}-star-glow`} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
    </defs>

    <rect class="sky" width="1000" height="620" rx="24" />
    <ellipse
      class="city-glow"
      cx="520"
      cy="580"
      rx="570"
      ry="310"
      fill={`url(#${sceneId}-glow)`}
    />

    {#if showLines}
      <g class="constellation-lines">
        {#each linePairs as pair}
          {@const start = anchorByHr.get(pair[0])}
          {@const end = anchorByHr.get(pair[1])}
          {#if start && end}
            <line x1={x(start)} y1={y(start)} x2={x(end)} y2={y(end)} />
          {/if}
        {/each}
      </g>
    {/if}

    <g class="stars" aria-hidden="true">
      {#each stars as star (star.star_id)}
        {@const isVisible = star.vmag <= threshold}
        {@const isTracked = tracked && star.star_id === trackedStar.star_id}
        {#if isVisible}
          <circle
            class="star-halo"
            cx={x(star)}
            cy={y(star)}
            r={starRadius(star.vmag) * 1.9}
            fill={starColor(star)}
            opacity={star.vmag < 2.4 ? 0.34 : 0.12}
            filter={`url(#${sceneId}-star-glow)`}
          />
          <circle
            class="star visible"
            data-star-id={star.star_id}
            cx={x(star)}
            cy={y(star)}
            r={starRadius(star.vmag)}
            fill={starColor(star)}
          />
        {:else if isTracked}
          <circle
            class="star invisible tracked"
            data-star-id={star.star_id}
            cx={x(star)}
            cy={y(star)}
            r="8"
          />
        {/if}
        {#if isTracked}
          <circle class="tracking-ring" cx={x(star)} cy={y(star)} r="16" />
        {/if}
      {/each}
    </g>

    {#if showLabels}
      <g class="star-labels">
        {#each labelStars as star}
          {#if star.vmag <= threshold}
            <g transform={`translate(${x(star)} ${y(star)})`}>
              <line x1="0" y1="0" x2={star.hr === 2061 ? -24 : 20} y2="-18" />
              <text
                x={star.hr === 2061 ? -30 : 25}
                y="-20"
                text-anchor={star.hr === 2061 ? "end" : "start"}
              >
                {star.display_name_zh}
              </text>
            </g>
          {/if}
        {/each}
      </g>
    {/if}

    <g class="field-meta">
      <text x="34" y="582">J2000 · RA 72°—94° · Dec −11.5°—23°</text>
      <text x="966" y="582" text-anchor="end">Bright Star Catalogue V/50</text>
    </g>
  </svg>
  <p class="sr-only" id={`${sceneId}-graphic-summary`} aria-live="polite">{takeaway}</p>
</figure>
