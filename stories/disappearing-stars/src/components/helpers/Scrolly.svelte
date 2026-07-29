<script>
  let {
    root = null,
    top = 0,
    bottom = 0,
    increments = 20,
    onchange = undefined,
    onfallback = undefined,
    children
  } = $props();

  let ratios = [];
  let thresholds = [];
  let nodes = [];
  let observers = [];
  let container;

  function mostVisible() {
    let maxRatio = 0;
    let maxIndex = 0;
    for (let index = 0; index < ratios.length; index += 1) {
      if (ratios[index] > maxRatio) {
        maxRatio = ratios[index];
        maxIndex = index;
      }
    }
    if (maxRatio > 0) onchange?.(maxIndex);
  }

  function createObserver(node, index) {
    const observer = new IntersectionObserver(
      (entries) => {
        ratios[index] = entries[0].intersectionRatio;
        mostVisible();
      },
      {
        root,
        rootMargin: `${top ? -top : 0}px 0px ${bottom ? -bottom : 0}px 0px`,
        threshold: thresholds
      }
    );
    observer.observe(node);
    observers[index] = observer;
  }

  function setup() {
    observers.forEach((observer) => observer.disconnect());
    observers = [];
    if (!container) return;
    if (typeof IntersectionObserver === "undefined") {
      onfallback?.();
      return;
    }
    nodes = container.querySelectorAll(":scope > [data-step]");
    nodes.forEach(createObserver);
  }

  $effect(() => {
    thresholds = Array.from({ length: increments + 1 }, (_, index) => index / increments);
    setup();
    return () => observers.forEach((observer) => observer.disconnect());
  });

  $effect(() => {
    top;
    bottom;
    setup();
  });
</script>

<div class="scrolly-steps" bind:this={container}>
  {@render children?.()}
</div>
