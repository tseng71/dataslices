<script>
  import { onMount } from "svelte";

  let progress = $state(0);

  onMount(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      progress = available > 0 ? Math.min(1, window.scrollY / available) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });
</script>

<div class="reading-progress" aria-hidden="true">
  <span style={`transform:scaleX(${progress})`}></span>
</div>
