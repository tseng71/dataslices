<script>
  import {
    FORM_LABELS,
    FORM_ORDER,
    buildLayoutContext,
    layoutFor,
    populationForScene
  } from "$lib/visual/word-layouts.js";

  export let state;
  export let terms = [];
  export let annotations = [];
  export let selectedTermId = "";
  export let onselect = () => {};

  $: scene = state?.id ?? "field-intro";
  $: annotationById = new Map(annotations.map((row) => [row.term_id, row]));
  $: records = terms.map((term) => ({
    ...term,
    ...(annotationById.get(term.term_id) ?? {})
  }));
  $: context = buildLayoutContext(records);
  $: population = populationForScene(scene, context);
  $: populationCount = population.length;
  $: formCounts = Object.fromEntries(
    FORM_ORDER.map((form) => [form, context.forms[form].length])
  );
  $: summary = {
    "field-intro": "开场使用跨年份策展词建立语言质感，不冒充完整词表。",
    "field-color": "策展词按三个时间层着色，YYDS 是其中一个可追踪对象。",
    "title-reveal": "词场退到背景，标题延迟出现。",
    "year-focus": "完整词表进入年份坐标，先聚焦 2021 年的十个词。",
    "year-river": "2012 至 2025 的 140 个词按年份和名单位置列队。",
    "form-short": "140 个词汇入四条构词带，当前聚焦短词和标签。",
    "form-phrase": "当前聚焦固定短语和完整句式。",
    "form-template": "当前聚焦四个有明确证据门槛的模板。",
    "form-mixed": "当前聚焦缩写、数字和中英混写。",
    "length-scatter": "140 个词按去除标点后的字符长度落位。",
    "length-density": "词语聚合为年度长度轮廓，但仍可回到组成词。",
    "template-engine": "模板章只保留四个明确模板。",
    "evidence-paths": "后续证据章只使用五个有官方说明的词。",
    "evidence-results": "五个词移动到来源记录的变体或语域终点。",
    "evidence-matrix": "140 个词形成证据矩阵：5 个有后续说明，135 个目前只有年度记录。",
    "mixed-stream": "从矩阵抽出十三个缩写、数字或中英混写词。",
    "return-field": "结尾回到跨年份策展词场，完整词表仍可打开。"
  }[scene] ?? "词语按当前分析问题重新排列。";

  function markStyle(record) {
    const layout = layoutFor(record, scene, context);
    return {
      layout,
      css: [
        `--x:${layout.x}%`,
        `--y:${layout.y}%`,
        `--mx:${layout.mx}%`,
        `--my:${layout.my}%`,
        `--r:${layout.rotate}deg`,
        `--o:${layout.opacity}`,
        `--s:${layout.size}rem`,
        `--mw:${layout.maxWidth}rem`
      ].join(";")
    };
  }
</script>

<figure
  class="word-stage"
  class:is-intro={scene === "field-intro" || scene === "field-color"}
  class:is-title={scene === "title-reveal"}
  class:is-year={scene === "year-focus" || scene === "year-river"}
  class:is-form={scene.startsWith("form-")}
  class:is-length={scene === "length-scatter" || scene === "length-density"}
  class:is-template={scene === "template-engine"}
  class:is-evidence={scene === "evidence-paths" || scene === "evidence-results"}
  class:is-matrix={scene === "evidence-matrix"}
  class:is-mixed={scene === "mixed-stream"}
  class:is-return={scene === "return-field"}
  data-scene-id={scene}
  data-population-count={populationCount}
  data-total-terms={terms.length}
  data-known-count={context.evidence.length}
  data-unknown-count={context.unknown.length}
  aria-label={summary}
>
  <figcaption class="sr-only" data-scene-summary>{summary}</figcaption>

  <div class="stage-grid" aria-hidden="true"></div>

  {#if scene === "year-focus" || scene === "year-river"}
    <div class="year-guides" aria-hidden="true">
      {#each Array.from({ length: 14 }, (_, index) => 2012 + index) as year}
        <span class:focus={year === 2021} style={`--year-index:${year - 2012}`}>
          {year}
        </span>
      {/each}
    </div>
    <p class="stage-note stage-note--bottom">
      每列十个真实词；名单位置不解释为社会重要性。
    </p>
  {/if}

  {#if scene.startsWith("form-")}
    <svg class="form-ribbons" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <path class="form-ribbon form-ribbon--short" d="M30 140 C260 70 690 90 970 150"/>
      <path class="form-ribbon form-ribbon--phrase" d="M30 280 C300 210 650 230 970 300"/>
      <path class="form-ribbon form-ribbon--template" d="M30 430 C260 390 710 440 970 450"/>
      <path class="form-ribbon form-ribbon--mixed" d="M30 570 C320 610 650 625 970 575"/>
    </svg>
    <div class="form-labels" aria-hidden="true">
      {#each FORM_ORDER as form, index}
        <span style={`--form-index:${index}`}>
          {FORM_LABELS[form]} <b>{formCounts[form]}</b>
        </span>
      {/each}
    </div>
  {/if}

  {#if scene === "length-scatter" || scene === "length-density"}
    <div class="length-axis" aria-hidden="true">
      <span>1 字</span><span>4 字</span><span>8 字</span><span>14 字</span>
    </div>
    <svg class:visible={scene === "length-density"} class="length-curves" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
      <path class="length-curve early" d="M20 520 C120 500 190 330 300 285 C430 230 520 385 650 440 C770 490 870 510 980 520"/>
      <path class="length-curve middle" d="M20 520 C110 470 165 210 275 160 C410 100 490 340 630 430 C760 510 875 520 980 524"/>
      <path class="length-curve recent" d="M20 520 C120 485 215 275 330 240 C465 195 560 360 690 445 C800 505 900 520 980 523"/>
    </svg>
    <div class="length-legend" aria-hidden="true">
      <span class="early">2012–2015</span>
      <span class="middle">2018–2021</span>
      <span class="recent">2022–2025</span>
    </div>
  {/if}

  {#if scene === "template-engine"}
    <div class="template-overlay" aria-hidden="true">
      <div class="slot-demo">
        <span>××</span>千万条，<span>××</span>第一条
        <i>→</i>
        <small>数据千万条，奋斗第一条</small>
      </div>
      <p>只连接有来源的仿写例；其余 136 个词不进入本章。</p>
    </div>
  {/if}

  {#if scene === "evidence-paths" || scene === "evidence-results"}
    <svg class="evidence-arrows" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      {#each [0, 1, 2, 3, 4] as index}
        <path d={`M280 ${132 + index * 98} C430 ${132 + index * 98} 520 ${132 + index * 98} 675 ${132 + index * 98}`}/>
      {/each}
    </svg>
    <div class="evidence-results" aria-hidden="true">
      <span style="--evidence-index:0">××千万条，××第一条</span>
      <span style="--evidence-index:1">主打一个 + 槽位</span>
      <span style="--evidence-index:2">过程基础，结果不基础</span>
      <span style="--evidence-index:3">来分；来 offer</span>
      <span style="--evidence-index:4">营销学 → 人际关系、职场</span>
    </div>
    <p class="stage-note stage-note--bottom">路径表示来源记录了后续用法，不表示传播因果或寿命。</p>
  {/if}

  {#if scene === "evidence-matrix"}
    <div class="matrix-label matrix-label--known">有后续说明 · 5</div>
    <div class="matrix-label matrix-label--unknown">目前只有年度记录 · 135</div>
    <div class="matrix-warning">
      <strong>矩阵不是墓地</strong>
      <span>灰格代表尚无后续资料，不代表词语死亡。</span>
    </div>
  {/if}

  {#if scene === "mixed-stream"}
    <div class="mixed-axis" aria-hidden="true">
      <span>2012</span><i></i><span>2025</span>
    </div>
    <p class="stage-note stage-note--bottom">
      13 个词从矩阵中被抽出；这是一个书写形式子集，不是赢家榜。
    </p>
  {/if}

  <div class="word-layer">
    {#each records as record (record.term_id)}
      {@const styled = markStyle(record)}
      <button
        type="button"
        class:visible={styled.layout.visible}
        class:highlight={styled.layout.highlight}
        class:selected={selectedTermId === record.term_id}
        class:cell={styled.layout.mode === "cell"}
        class={`word-mark role-${styled.layout.color}`}
        style={styled.css}
        data-term-id={record.term_id}
        data-term={record.term}
        data-entry-year={record.year}
        data-form={record.form_primary}
        aria-label={`${record.term}，${record.year} 年`}
        tabindex={styled.layout.opacity > 0.35 ? 0 : -1}
        on:click={() => onselect(record.term_id)}
      >
        <span>{record.term}</span>
      </button>
    {/each}
  </div>

  {#if scene === "field-intro" || scene === "field-color"}
    <div class="intro-copy">
      <p>先别急着问一个词“死没死”。</p>
      <p>先看看十四年里，被记录下来的一些说法。</p>
      <strong>YYDS</strong>
    </div>
  {/if}

  {#if scene === "title-reveal"}
    <div class="title-copy">
      <p>一份中文网络流行语档案</p>
      <h1>从一句话<br/>到一种说话方式</h1>
      <div class="title-blocks"><span>给力</span><span>情绪价值</span></div>
      <small>2012—2025 · 140 条年度网络用语</small>
    </div>
  {/if}

  {#if scene === "return-field"}
    <div class="return-copy">
      <p>退潮以后，</p>
      <h2>留下的是词、结构，<br/>还是我们说话的方式？</h2>
      <small>结尾回到策展词场；完整 140 词仍可打开。</small>
    </div>
  {/if}
</figure>
