<script>
  /**
   * Current Pudding Svelte 5 scrolly helper, adapted only for local formatting.
   * The most-visible direct child controls the bound value.
   */
  let {
    root = null,
    top = 0,
    bottom = 0,
    increments = 100,
    value = undefined,
    onchange = undefined,
    children
  } = $props();

  let steps = [];
  let threshold = [];
  let nodes = [];
  let intersectionObservers = [];
  let container = undefined;

  function mostInView() {
    let maxRatio = 0;
    let maxIndex = 0;
    for (let index = 0; index < steps.length; index += 1) {
      if (steps[index] > maxRatio) {
        maxRatio = steps[index];
        maxIndex = index;
      }
    }

    if (maxRatio > 0) value = maxIndex;
    else value = undefined;
    onchange?.(value);
  }

  function createObserver(node, index) {
    const handleIntersect = (entries) => {
      steps[index] = entries[0].intersectionRatio;
      mostInView();
    };

    const marginTop = top ? top * -1 : 0;
    const marginBottom = bottom ? bottom * -1 : 0;
    const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
    const options = { root, rootMargin, threshold };

    if (intersectionObservers[index]) intersectionObservers[index].disconnect();

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(node);
    intersectionObservers[index] = observer;
  }

  function update() {
    if (!nodes.length) return;
    nodes.forEach(createObserver);
  }

  $effect(() => {
    for (let index = 0; index < increments + 1; index += 1) {
      threshold.push(index / increments);
    }
    nodes = container.querySelectorAll(":scope > *:not(iframe)");
    update();
  });

  $effect(() => {
    top;
    bottom;
    update();
  });
</script>

<div class="scrolly-steps" bind:this={container}>
  {@render children?.()}
</div>
