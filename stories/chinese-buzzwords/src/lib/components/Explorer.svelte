<script>
  export let terms = [];
  export let annotations = [];
  export let initialQuery = "YYDS";
  export let onquery = () => {};

  let query = initialQuery;
  let year = "all";
  let form = "all";
  let evidence = "all";

  $: normalized = query.trim().toLowerCase();
  $: matching = terms.filter((term) => {
    const annotation = annotations.find((row) => row.term_id === term.term_id);
    const queryMatch = !normalized || term.term.toLowerCase().includes(normalized);
    const yearMatch = year === "all" || String(term.year) === year;
    const formMatch = form === "all" || annotation?.form_primary === form;
    const evidenceMatch =
      evidence === "all" ||
      (evidence === "variation" && annotation?.documented_variation === 1) ||
      (evidence === "migration" && annotation?.documented_cross_register === 1);
    return queryMatch && yearMatch && formMatch && evidenceMatch;
  });
  $: exact =
    terms.find((term) => term.term.toLowerCase() === normalized) ??
    (normalized === "yyds" ? terms.find((term) => term.term === "YYDS") : null);
  $: selected = exact ?? matching[0] ?? null;
  $: selectedAnnotation = selected
    ? annotations.find((row) => row.term_id === selected.term_id)
    : null;
  $: isEmpty = normalized.length > 0 && matching.length === 0;

  function updateQuery() {
    onquery(query);
  }

  function choose(term) {
    query = term;
    updateQuery();
  }

  function reset() {
    query = "YYDS";
    year = "all";
    form = "all";
    evidence = "all";
    updateQuery();
  }
</script>

<section
  class="explorer"
  data-scene-id={isEmpty ? "explorer-empty" : "explorer-default"}
  data-selected-term={selected?.term === "YYDS" ? "yyds" : selected?.term_id ?? ""}
  data-url-contains={`term=${encodeURIComponent(normalized || "yyds")}`}
  aria-labelledby="explorer-title"
>
  <header class="explorer__header">
    <p class="eyebrow">自己找一找</p>
    <h2 id="explorer-title">找一个你记得的词。</h2>
    <p>默认从 YYDS 开始。筛选改变的是真实年份与形式字段，不改变未收录的含义。</p>
  </header>

  <div class="explorer__controls">
    <label class="search-label">
      <span>搜索流行语</span>
      <input
        role="combobox"
        aria-label="搜索流行语"
        aria-controls="term-results"
        aria-expanded={matching.length > 0}
        bind:value={query}
        on:input={updateQuery}
      />
    </label>

    <label>
      <span>年份</span>
      <select bind:value={year} aria-label="按年份筛选">
        <option value="all">全部年份</option>
        {#each [...new Set(terms.map((term) => term.year))].sort((a, b) => b - a) as item}
          <option value={item}>{item}</option>
        {/each}
      </select>
    </label>

    <label>
      <span>构词方式</span>
      <select bind:value={form} aria-label="按构词方式筛选">
        <option value="all">全部方式</option>
        <option value="word_or_short_label">短词或标签</option>
        <option value="fixed_phrase">固定短语</option>
        <option value="productive_template">明确模板</option>
        <option value="abbreviation_or_mixed_script">缩写或混写</option>
      </select>
    </label>

    <label>
      <span>证据层</span>
      <select bind:value={evidence} aria-label="按证据层筛选">
        <option value="all">全部证据</option>
        <option value="variation">记录过变体</option>
        <option value="migration">记录过语域扩展</option>
      </select>
    </label>

    <button type="button" on:click={reset}>重置</button>
  </div>

  <div class="curated" aria-label="策展入口">
    {#each ["YYDS", "躺平", "班味儿", "情绪价值"] as term}
      <button type="button" on:click={() => choose(term)}>{term}</button>
    {/each}
  </div>

  {#if isEmpty}
    <div class="explorer__empty">
      <p id="term-results" data-copy-id="explorer-empty">
        没有找到，不等于这个词从未流行。它可能不在本项目采用的名单与语料范围内。
      </p>
      <button data-empty-action type="button" on:click={() => choose("YYDS")}>查看 YYDS</button>
      <a data-empty-action href="#static-archive">浏览完整词表</a>
    </div>
  {:else if selected}
    <article
      class="term-detail"
      data-term-detail={selected.term === "YYDS" ? "yyds" : selected.term_id}
      aria-live="polite"
    >
      <p class="term-detail__year">{selected.year} · 年度十大网络用语</p>
      <h3>{selected.term}</h3>
      <div class="evidence-chips">
        <span>年度入选：已核实</span>
        <span>可比趋势：没有数据</span>
        {#if selectedAnnotation?.documented_variation}
          <span>官方解读记录变体</span>
        {/if}
        {#if selectedAnnotation?.documented_cross_register}
          <span>官方解读记录语域扩展</span>
        {/if}
      </div>
      <p>
        形式：
        {selectedAnnotation?.form_primary === "fixed_phrase"
          ? "固定短语"
          : selectedAnnotation?.form_primary === "productive_template"
            ? "明确模板"
            : selectedAnnotation?.form_primary === "abbreviation_or_mixed_script"
              ? "缩写或混写"
              : "短词或标签"}
      </p>
      {#if selectedAnnotation?.documented_variant_examples}
        <p>记录中的变体：{selectedAnnotation.documented_variant_examples}</p>
      {/if}
      {#if selectedAnnotation?.cross_register_note}
        <p>语域说明：{selectedAnnotation.cross_register_note}</p>
      {/if}
      <a data-source-link href={selected.source_url} target="_blank" rel="noreferrer">查看官方来源</a>
    </article>
  {/if}
</section>
