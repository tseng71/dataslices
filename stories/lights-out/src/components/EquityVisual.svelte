<script>
  let measure = $state("duration");

  const measures = {
    duration: {
      title: "谁更可能经历长期停电？",
      note: "研究按市镇类型比较长期停电经历。",
      groups: [
        { label: "农村市镇", value: 41, detail: "41%" },
        { label: "城市地区", value: 29, detail: "29%" }
      ]
    },
    burden: {
      title: "谁承担了更多断电用户小时？",
      note: "用户小时 = 断电用户数 × 持续时间；这是累计负担，不是人口占比。",
      groups: [
        { label: "农村社区", value: 61, detail: "61%" },
        { label: "其余地区", value: 39, detail: "39%" }
      ]
    }
  };
  let current = $derived(measures[measure]);
</script>

<section class="equity" aria-labelledby="equity-title">
  <div class="equity__copy">
    <p class="eyebrow">04 / 平均值之后</p>
    <h2 id="equity-title">灯回来了。<br />但先回到哪里？</h2>
    <p>
      卫星推断与电力局逐日报告有较高一致性（<i>R</i> = 0.839，共 195 天）。
      但全岛恢复率把不同地方的等待压成一个数字。
    </p>
    <div class="equity__controls" role="group" aria-label="切换城乡差异指标">
      <button
        class:active={measure === "duration"}
        aria-pressed={measure === "duration"}
        onclick={() => (measure = "duration")}
      >长期停电</button>
      <button
        class:active={measure === "burden"}
        aria-pressed={measure === "burden"}
        onclick={() => (measure = "burden")}
      >累计负担</button>
    </div>
  </div>

  <div class="equity__chart" aria-live="polite">
    <header>
      <h3>{current.title}</h3>
      <p>{current.note}</p>
    </header>
    {#each current.groups as group}
      <div class="equity__row">
        <div class="equity__row-label">
          <span>{group.label}</span><strong>{group.detail}</strong>
        </div>
        <div class="equity__track">
          <i style:width={`${group.value}%`}></i>
        </div>
      </div>
    {/each}
    <p class="equity__annotation">
      {measure === "duration"
        ? "农村市镇的长期停电比例高出 12 个百分点。"
        : "农村社区承担了研究估算中过半的断电用户小时。"}
    </p>
  </div>
</section>
