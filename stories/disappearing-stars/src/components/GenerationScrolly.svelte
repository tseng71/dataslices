<script>
  import StarField from "./StarField.svelte";
  import { generationStates } from "../data/story.js";

  let { story } = $props();
  let generation = $derived(story.visual.generation);

  function keydown(event, index) {
    let next = index;
    if (event.key === "ArrowRight") next = Math.min(generationStates.length - 1, index + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = generationStates.length - 1;
    else return;
    event.preventDefault();
    story.setGenerationAge(generationStates[next].age_years);
    event.currentTarget.parentElement.children[next].focus();
  }
</script>

<section
  class="chapter generation"
  data-generation-scene
  data-age={generation.age_years}
  data-contract-target={generation.age_years === 18 ? "generation-eighteen" : "generation-zero"}
  aria-labelledby="generation-heading"
>
  <div class="section-kicker">02 · 时间</div>
  <div class="chapter-heading">
    <h2 id="generation-heading">一代人的夜空</h2>
    <p>每年难以察觉的变化，持续十八年后会变成什么？</p>
  </div>

  <div class="generation-layout">
    <div class="generation-visual">
      <StarField
        sceneId={generation.age_years === 18 ? "generation-eighteen" : "generation-zero"}
        threshold={generation.display_threshold_vmag}
        showLabels={false}
        showLines
      />
    </div>
    <div class="generation-copy">
      <p class="eyebrow">全球平均情景 · 不是纽约预报</p>
      <p class="generation-age">{generation.age_years}<small> 岁</small></p>
      <p class="metric">
        天空辉光约为起点的 <strong>{generation.skyglow_factor.toFixed(generation.age_years ? 3 : 1)} 倍</strong>
      </p>
      <p>
        {#if generation.reader_facing_count_claim}
          论文示例端点：约 <strong>{generation.reader_facing_count_claim} 颗</strong>。
        {:else}
          这是编辑视觉插值节点；不把中间目录数量写成人眼观测结论。
        {/if}
      </p>
      <p class="caveat">同一星表、同一显示规则；天气、月光、视力与暗适应会改变真实可见性。</p>
    </div>
  </div>

  <div class="segmented-control generation-control" role="group" aria-label="选择年龄节点">
    {#each generationStates as item, index}
      <button
        type="button"
        aria-pressed={item.age_years === generation.age_years}
        onclick={() => story.setGenerationAge(item.age_years)}
        onkeydown={(event) => keydown(event, index)}
      >
        {item.age_years} 岁
      </button>
    {/each}
  </div>
</section>
