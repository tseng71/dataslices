<script>
  import { scaleOrdinal } from "d3";
  import { recoveryBins, recoveryCells } from "../data/story.js";

  let { state, compact = false, ending = false } = $props();

  const color = scaleOrdinal(
    recoveryBins.map((bin) => bin.id),
    recoveryBins.map((bin) => bin.color)
  );
  let litCount = $derived(ending ? 97 : state.lit);
</script>

<figure class:compact class:ending class="recovery-field">
  <div class="recovery-field__header">
    <div>
      <span>{ending ? "城市接近恢复" : state.date}</span>
      <strong>{ending ? "97" : state.lit}<small>/100</small></strong>
    </div>
    <p>
      {ending
        ? "最后 3% 仍未恢复"
        : "已恢复的样本街区（累计估计）"}
    </p>
  </div>

  <div
    class="recovery-field__grid"
    role="img"
    aria-label={`${litCount}% 的圣胡安样本街区已经恢复；每格代表 1% 的样本街区`}
  >
    {#each recoveryCells as cell (cell.id)}
      <i
        class:lit={cell.id <= litCount}
        class:last={ending && cell.id > 97}
        style:--cell-color={color(cell.bin)}
        title={`第 ${cell.id} 格：${cell.label}`}
      ></i>
    {/each}
  </div>

  {#if !compact}
    <figcaption>
      <span class="legend-dot"></span>
      每格 = 圣胡安研究样本街区的 1%；颜色表示估计恢复时段。
    </figcaption>
    <div class="recovery-field__legend" aria-label="恢复时间图例">
      {#each recoveryBins as bin}
        <span><i style:background={bin.color}></i>{bin.label} · {bin.count}%</span>
      {/each}
    </div>
  {/if}
</figure>
