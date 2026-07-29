<script>
  import { onMount } from "svelte";

  export let steps = [];
  export let activeId = "";
  export let onactive = () => {};
  export let label = "滚动叙事图形";

  let stepNodes = [];

  onMount(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const id = visible[0]?.target?.dataset?.step;
        if (id) onactive(id);
      },
      { rootMargin: "-34% 0px -48% 0px", threshold: [0, 0.25, 0.75, 1] }
    );

    stepNodes.filter(Boolean).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  });
</script>

<section class="scrolly" aria-label={label}>
  <div class="scrolly__graphic">
    <slot name="graphic" />
  </div>

  <div class="scrolly__steps">
    {#each steps as step, index (step.id)}
      <div
        class:active={step.id === activeId}
        class="scrolly__step"
        data-step={step.id}
        id={`step-${step.id}`}
        bind:this={stepNodes[index]}
      >
        <p class="eyebrow">{step.chapter}</p>
        <h2>{step.heading}</h2>
        {#each step.paragraphs as paragraph}
          <p>{@html paragraph}</p>
        {/each}
        {#if step.note}
          <p class="step-note">{step.note}</p>
        {/if}
      </div>
    {/each}
  </div>
</section>
