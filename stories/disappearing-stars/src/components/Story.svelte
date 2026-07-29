<script>
  import { onMount } from "svelte";
  import { createStoryState } from "../lib/state/story.svelte.js";
  import ReadingProgress from "./ReadingProgress.svelte";
  import StarField from "./StarField.svelte";
  import ThresholdScrolly from "./ThresholdScrolly.svelte";
  import GenerationScrolly from "./GenerationScrolly.svelte";
  import CityTransect from "./CityTransect.svelte";
  import LightPathExplainer from "./LightPathExplainer.svelte";
  import LightingComparison from "./LightingComparison.svelte";
  import BirdEvidence from "./BirdEvidence.svelte";
  import Methods from "./Methods.svelte";

  const story = createStoryState();

  const sceneTargets = {
    "opening-city": "hero",
    "opening-dark-return": "threshold",
    "magnitude-encoding": "threshold",
    "threshold-reveal": "threshold",
    "distribution-reveal": "threshold",
    "generation-zero": "generation",
    "generation-eighteen": "generation",
    "place-times-square": "places",
    "place-central-park": "places",
    "place-montauk-point": "places",
    "place-explore": "places",
    "light-path": "light-path",
    "lighting-unshielded": "lighting",
    "lighting-shielded": "lighting",
    "bird-evidence": "birds",
    ending: "ending"
  };

  onMount(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setMotion = () => story.setMotionMode(reduced.matches ? "reduced" : "full");
    setMotion();
    reduced.addEventListener?.("change", setMotion);

    const scene = new URLSearchParams(window.location.search).get("scene");
    if (scene) {
      story.forceScene(scene);
      requestAnimationFrame(() => {
        const exact = document.querySelector(`[data-contract-target="${scene}"]`);
        const fallback = document.getElementById(sceneTargets[scene] ?? scene);
        const target = exact ?? fallback;
        target?.scrollIntoView({
          block: target?.matches(".story-step") ? "center" : "start"
        });
      });
    }

    return () => reduced.removeEventListener?.("change", setMotion);
  });
</script>

<ReadingProgress />
<main>
  <section id="hero" class="hero" data-contract-target="opening-city">
    <div class="hero-sky">
      <StarField
        sceneId="opening-city"
        threshold={2.48}
        showLabels={false}
        showLines
        tracked
      />
    </div>
    <div class="hero-copy">
      <p class="publication">DATA SLICES · 数据叙事</p>
      <h1>消失的星空</h1>
      <p class="dek">城市只把夜空照亮一点，为什么数百颗星就越过了肉眼的边界？</p>
      <p class="hero-question">这是完整的猎户座吗？</p>
      <p class="scroll-cue">向下滚动 · 追踪同一批真实恒星</p>
    </div>
  </section>

  <div class="opening-prose prose">
    <p>
      参宿一、参宿二、参宿三排成一线。参宿四泛着暖红，参宿七在另一端发出偏蓝的光。只要这几颗亮星还在，猎户座就仍然像猎户座。
    </p>
    <p class="lead">
      城市天空留下了熟悉的骨架，也制造了一个错觉：它看起来稀疏，但也许本来就是这样。
    </p>
  </div>

  <div id="threshold">
    <ThresholdScrolly {story} />
  </div>

  <div class="bridge prose">
    <p>
      在固定天区里，共有 250 条亮于或等于 6.5 视星等的目录记录。星没有离开；改变的是它与背景之间的对比。
    </p>
  </div>

  <div id="generation">
    <GenerationScrolly {story} />
  </div>

  <div class="prose">
    <p>
      2011—2022 年间，51,351 次肉眼观测显示，全球参与者感受到的天空辉光平均每年增长 9.6%（±0.4 个百分点）。一年很难凭记忆察觉，十八年却足以改写一个人以为“正常”的夜空。
    </p>
  </div>

  <div id="places">
    <CityTransect {story} />
  </div>

  <div id="light-path">
    <LightPathExplainer />
  </div>

  <div id="lighting">
    <LightingComparison {story} />
  </div>

  <div id="birds" class="chapter">
    <BirdEvidence />
  </div>

  <section id="ending" class="ending" data-scene-id="ending" data-contract-target="ending">
    <StarField sceneId="ending-sky" threshold={6.5} showLabels={false} showLines />
    <div class="ending-copy">
      <p>再看一次猎户座。</p>
      <p>最亮的星没有离开，所以城市夜空一直显得熟悉。真正被拿走的，是亮星之间的密度。</p>
      <p class="ending-line">星星没有消失。</p>
      <p class="ending-last">消失的，是夜晚让我们看见它们的能力。</p>
    </div>
  </section>

  <footer>
    <Methods />
    <p>《消失的星空》v2 · 本地实现预览 · 2026</p>
  </footer>
</main>
