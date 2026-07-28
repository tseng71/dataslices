<script>
  import Scrolly from "./helpers/Scrolly.svelte";
  import RecoveryField from "./RecoveryField.svelte";
  import { recoveryStates } from "../data/story.js";

  let active = $state(0);
  let activeState = $derived(
    recoveryStates[Math.min(active ?? 0, recoveryStates.length - 1)]
  );
</script>

<section class="recovery" id="recovery" aria-labelledby="recovery-title">
  <div class="recovery__intro">
    <p class="eyebrow">03 / 把“恢复”拆开</p>
    <h2 id="recovery-title">一座城市没有一个<br />统一的复电时刻。</h2>
    <p>
      下面 100 格不是 100 户家庭。它们把论文中圣胡安样本街区的恢复时间分布，按 1% 一格展开。
      同一批格子会一直留在原位；滚动只改变哪些格子已经亮起。
    </p>
  </div>

  <div class="recovery__scrolly">
    <div class="recovery__sticky">
      <RecoveryField state={activeState} />
      <div class="recovery__takeaway" aria-live="polite">
        <span>{activeState.kicker}</span>
        <p>{activeState.takeaway}</p>
      </div>
    </div>

    <Scrolly onchange={(index) => (active = index ?? active)}>
      {#each recoveryStates as item, index}
        <section
          data-scrolly-step
          class:active={active === index}
          class="recovery-step"
          aria-current={active === index ? "step" : undefined}
        >
          <p class="recovery-step__date">{item.date}</p>
          <p class="recovery-step__index">
            {String(index + 1).padStart(2, "0")} / {String(recoveryStates.length).padStart(2, "0")}
          </p>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </section>
      {/each}
    </Scrolly>
  </div>

  <div class="recovery__source">
    <p>
      这 100 格来自 Román 等（2019）对圣胡安 block group 的恢复时间统计：
      60 天内 4%，60–90 天 40%，90–120 天 53%，120 天以上 3%。
    </p>
  </div>
</section>
