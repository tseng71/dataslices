<script>
  export let state;
  export let terms = [];
  export let yearSummary = [];

  const laneLabels = [
    ["annual-entry", "年度入选", "已核实"],
    ["network-context", "网络语境", "部分逐词解读"],
    ["search-interest", "搜索关注", "没有同口径序列"],
    ["public-register", "新闻 / 公共表达", "仅保留已核案例"]
  ];

  $: scene = state?.id ?? "encoding-year";
  $: terms2021 = terms.filter((term) => term.year === 2021);
  $: selectedYear = scene === "archive-overview" || scene === "archive-method-breaks" ? null : 2021;
  $: summary = {
    "encoding-year": "YYDS 在 2021 年进入本项目采用的年度十大网络用语记录。",
    "encoding-lanes": "年度入选、网络语境、搜索关注和公共表达回答不同问题。",
    "cohort-2021": "YYDS 与另外九个词共同构成 2021 年的年度记录。",
    "archive-overview": "词语按进入记录的年份排列；不同榜单系列需分开理解。",
    "archive-method-breaks": "同列展示不代表同一榜单，也不构成重要性排名。",
    "life-paths": "有证据的变体和迁移只占少数；多数词仍属于尚不能判断。",
    "register-migration": "情绪价值有官方解读支持的语域扩展；搜索轨道没有可比序列。",
    "template-reveal": "道路千万条，安全第一条被拆成可替换的句式。",
    "template-comparison": "明确模板散布在四个年份，不能据此计算寿命。",
    "semantic-fields": "语义主题比例未发布，因为当前编码没有独立复核。"
  }[scene] ?? "年度档案记录了词语出现的年份，但不记录它们的完整寿命。";

  const formLabel = {
    word_or_short_label: "短词 / 标签",
    fixed_phrase: "固定短语",
    productive_template: "明确模板",
    abbreviation_or_mixed_script: "缩写 / 混写"
  };
</script>

<figure
  class:dark={scene === "encoding-year"}
  class="story-graphic"
  data-scene-id={scene}
  data-selected-term={scene === "encoding-year" ? "yyds" : undefined}
  data-layout={scene === "archive-overview"
    ? "year-aligned"
    : scene === "semantic-fields"
      ? "discrete-domains"
      : undefined}
  data-mode={scene === "template-comparison" ? "word-formation-comparison" : undefined}
  data-min-year={scene === "archive-overview" ? 2005 : undefined}
  data-max-year={scene === "archive-overview" ? 2025 : undefined}
  aria-label={`流行语档案：${summary}`}
>
  <figcaption class="sr-only" data-scene-summary>{summary}</figcaption>

  {#if scene === "encoding-year"}
    <div class="year-encoding">
      <div
        class="term-hero"
        data-term-id="yyds"
        data-entry-year="2021"
        data-list-series="年度十大网络用语"
      >
        YYDS
      </div>
      <div class="timeline" aria-label="2012 到 2025 年时间轴">
        {#each [2012, 2015, 2018, 2021, 2025] as year}
          <div class:active={year === 2021} class="timeline__tick">
            <span>{year}</span>
          </div>
        {/each}
        <div class="timeline__annotation">2021 年度十大网络用语</div>
      </div>
      <p class="graphic-caveat">入选记录不等于真实使用频率</p>
    </div>
  {:else if scene === "encoding-lanes"}
    <div class="evidence-lanes" data-lane-names="annual-entry,network-context,search-interest,public-register">
      <div class="lane-term">YYDS</div>
      {#each laneLabels as lane, index}
        <div
          class:missing={index >= 2}
          class:partial={index === 1}
          class="evidence-lane"
          data-evidence-lane={lane[0]}
        >
          <span class="lane-mark">{index === 0 ? "●" : index === 1 ? "◐" : "╱╱"}</span>
          <strong>{lane[1]}</strong>
          <small>{lane[2]}</small>
        </div>
      {/each}
      <p class="graphic-caveat" id="encoding-caveat" data-copy-id="encoding-caveat">
        放大只是“正在讲它”，不是说它更热；缺数据也不等于没人使用。
      </p>
    </div>
  {:else if scene === "cohort-2021"}
    <div class="cohort">
      <header>
        <span>2021</span>
        <small>年度十大网络用语</small>
      </header>
      <div class="term-field">
        {#each terms2021 as term}
          <span
            class:selected={term.term === "YYDS"}
            data-term-id={term.term === "YYDS" ? "yyds" : term.term_id}
            data-selected={term.term === "YYDS" ? "true" : undefined}
            data-entry-year="2021"
            data-list-series="network-top-ten"
          >
            {term.term}
          </span>
        {/each}
      </div>
      <p class="source-line">来源：国家语言资源监测与研究中心 2021 年度十大网络用语</p>
    </div>
  {:else if scene === "archive-overview"}
    <div class="archive-graphic" data-domain="min_year:2005,max_year:2025">
      <div class="archive-scale">
        <span>2005</span><span>2010</span><span>2015</span><span>2020</span><span>2025</span>
      </div>
      <div class="archive-context">
        <span class="context-term">2010 · 给力</span>
        <span class="context-note">更早系列背景</span>
      </div>
      <div class="archive-columns">
        {#each [...new Set(terms.map((term) => term.year))] as year}
          <section class:focus={year === 2021}>
            <h3>{year}</h3>
            {#each terms.filter((term) => term.year === year).slice(0, 3) as term}
              <span class:selected={term.term === "YYDS"}>{term.term}</span>
            {/each}
            <small>+7</small>
          </section>
        {/each}
      </div>
      <p class="graphic-caveat">每列是年份，不是词频排行榜。完整 140 条词表在文末。</p>
    </div>
  {:else if scene === "archive-method-breaks"}
    <div class="method-breaks">
      <div class="series-card primary" data-list-series-key="network-top-ten">
        <span class="series-swatch">━━━━</span>
        <div><strong>年度十大网络用语</strong><small>2012—2025 · 本文主数据</small></div>
      </div>
      <div class="series-card" data-list-series-key="media-popular">
        <span class="series-swatch">┅┅┅┅</span>
        <div><strong>媒体流行语</strong><small>2010“给力”仅作历史背景</small></div>
      </div>
      <div class="series-card" data-list-series-key="annual-new-words">
        <span class="series-swatch">······</span>
        <div><strong>年度新词语</strong><small>观察对象与方法不同，不并表计算</small></div>
      </div>
      <p data-copy-id="archive-method-note">
        同列展示，不代表同一榜单；更不代表谁“更重要”。
      </p>
      <details>
        <summary>方法说明</summary>
        <p>各系列的语域、语料与筛选方法不同。本文的统计只使用同名“年度十大网络用语”。</p>
      </details>
    </div>
  {:else if scene === "life-paths"}
    <div class="life-paths">
      <section data-life-path-group data-life-path="variation">
        <h3>记录过仿写或变体</h3>
        <p class="path-count">4 个词条</p>
        <div class="path-terms">
          <span>道路千万条…</span><span>主打一个××</span><span>××基础××不基础</span><span>来财</span>
        </div>
      </section>
      <section data-life-path-group data-life-path="migration">
        <h3>记录过语域扩展</h3>
        <p class="path-count">1 个词条</p>
        <div class="path-terms"><span>情绪价值</span></div>
      </section>
      <section class="unknown" data-life-path-group data-life-path="unknown">
        <h3>尚不能判断</h3>
        <p class="path-count">其余记录</p>
        <div class="path-terms">
          <span>YYDS</span><span>锦鲤</span><span>躺平</span><span>显眼包</span><span>松弛感</span>
        </div>
      </section>
      <p class="graphic-caveat" data-copy-id="life-paths-caveat">
        有些词，我们只知道它被记录过。没有后续证据，就不替它写结局。
      </p>
    </div>
  {:else if scene === "register-migration"}
    <div
      class="register-map"
      data-lanes="network,search,public"
      data-register-lanes="network,search,public"
    >
      <div class="register-row">
        <span>营销学概念</span>
        <i class="verified-arrow" data-migration-link data-verified="true">→</i>
        <span class="active">人际关系、职场</span>
        <i class="verified-arrow" data-migration-link data-verified="true">→</i>
        <span>2025 年度记录</span>
      </div>
      <strong class="migration-term">情绪价值</strong>
      <div class="missing-track">
        <span>搜索关注</span><i>没有同口径长期序列</i>
      </div>
      <p data-copy-id="register-warning">
        出现于另一条轨道，是可观察迁移，不是传播因果，也不是语言“成功”。
      </p>
    </div>
  {:else if scene === "template-reveal"}
    <div class="template-family" data-template-family="qian-wan-tiao">
      <p class="source-phrase" data-role="source-phrase">道路千万条，安全第一条</p>
      <div class="decompose" aria-hidden="true">↓ 拆出可替换位置</div>
      <p class="slot-pattern" data-role="slot-pattern">
        <mark>××</mark>千万条，<mark>××</mark>第一条
      </p>
      <div class="variant-branches">
        <a
          data-variant-evidence="verified"
          href="https://hi.people.com.cn/n2/2023/0112/c231190-40264621.html"
          target="_blank"
          rel="noreferrer"
        >
          数据千万条，奋斗第一条
          <small>人民网 · 2023</small>
        </a>
        <a
          data-variant-evidence="verified"
          href="https://society.people.com.cn/n1/2025/0529/c1008-40489965.html"
          target="_blank"
          rel="noreferrer"
        >
          辅助驾驶千万条，安全行驶第一条
          <small>人民日报 · 2025</small>
        </a>
      </div>
      <p data-copy-id="central-reveal">
        留下来的，也许不是原句，而是一个还能继续造句的结构。
      </p>
      <details>
        <summary>派生实例来源</summary>
        <p>两条例句均链接到公开报道；它们证明仿写发生过，不代表变体总量。</p>
      </details>
    </div>
  {:else if scene === "template-comparison"}
    <div class="form-comparison">
      {#each yearSummary as row}
        <div class="form-row">
          <span>{row.year}</span>
          <div class="stack" aria-label={`${row.year} 年十条中的形式构成`}>
            <i style={`--n:${row.fixed_phrase}`} class="fixed"></i>
            <i style={`--n:${row.word_or_short_label}`} class="word"></i>
            <i style={`--n:${row.abbreviation_or_mixed_script}`} class="mixed"></i>
            <i style={`--n:${row.productive_template}`} class="template"></i>
          </div>
          {#if row.productive_template}
            <b>明确模板</b>
          {/if}
        </div>
      {/each}
      <div class="form-legend">
        {#each Object.entries(formLabel) as [key, label]}
          <span class={key}>{label}</span>
        {/each}
      </div>
      <div class="template-sources">
        <span data-template-family="haoshengyinti" data-duration-source="official-table">2012 中国好声音体</span>
        <span data-template-family="qian-wan-tiao" data-duration-source="official-explanation">2019 道路千万条…</span>
        <span data-template-family="zhuda-yige" data-duration-source="official-entry">2023 主打一个××</span>
        <span data-template-family="jichu-bujichu" data-duration-source="official-explanation">2025 ××基础××不基础</span>
      </div>
      <p class="graphic-caveat">四个年份各出现一条明确模板；没有连续词频，不能画“寿命”。</p>
    </div>
  {:else if scene === "semantic-fields"}
    <div class="semantic-withheld">
      <div class="domain-grid" aria-hidden="true">
        {#each ["技术", "工作经济", "公共事件", "情绪关系", "娱乐亚文化", "语言游戏"] as domain}
          <span>{domain}<i>未发布比例</i></span>
        {/each}
      </div>
      <div
        class="withheld-note"
        data-semantic-comparison
        data-denominator-displayed="true"
        data-method-consistent-period-displayed="true"
      >
        <strong>这张图故意没有数字。</strong>
        <p>原计划比较六个语义领域，但当前只有单人编码，主题边界尚未复核。</p>
        <p>可用分母：每年 10 条；方法一致期：无法充分确认。与其画出伪精确比例，我们保留空位。</p>
      </div>
      <p data-copy-id="semantic-caveat">
        主题变化可以被看见，但分类仍是一次有记录的编辑判断。
      </p>
    </div>
  {/if}
</figure>
