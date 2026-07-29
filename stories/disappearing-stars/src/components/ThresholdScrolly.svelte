<script>
  import Scrolly from "./helpers/Scrolly.svelte";
  import StarField from "./StarField.svelte";
  import MagnitudeGraphic from "./MagnitudeGraphic.svelte";
  import { magnitudeSteps } from "../data/story.js";

  let { story } = $props();
  let step = $derived(
    magnitudeSteps.find((item) => item.id === story.visual.thresholdStep) ?? magnitudeSteps[0]
  );

  function select(index) {
    story.setThresholdStep(magnitudeSteps[index].id);
  }
</script>

<section class="scrolly-section threshold-section" aria-labelledby="threshold-heading">
  <div class="section-kicker">01 · 可见边界</div>
  <div class="scrolly-grid">
    <div class="sticky-graphic">
      {#if step.layout === "sky"}
        <StarField
          sceneId={step.id}
          threshold={step.threshold}
          showLabels={step.id !== "opening-city"}
          showLines={step.id === "opening-dark-return"}
          tracked
        />
      {:else}
        <MagnitudeGraphic
          sceneId={step.id}
          layout={step.layout}
          threshold={step.threshold}
        />
      {/if}
      <p class="graphic-takeaway">{step.takeaway}</p>
    </div>

    <Scrolly onchange={select} onfallback={() => story.setObserverStatus("fallback")}>
      {#each magnitudeSteps as item, index}
        <article
          data-step
          data-contract-target={item.id}
          class:active={item.id === step.id}
          class="story-step"
        >
          {#if index === 0}<h2 id="threshold-heading">肉眼面对的是一条会移动的边界</h2>{/if}
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          {#if item.id === "threshold-reveal"}
            <p class="evidence-note">显示规则 · 不是人眼实验</p>
          {/if}
        </article>
      {/each}
    </Scrolly>
  </div>
</section>
