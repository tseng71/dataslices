<script>
  export let terms = [];
  export let annotations = [];
  export let selectedTermId = "";
  export let visible = false;
  export let onselect = () => {};

  let open = false;
  let query = "";
  let year = "all";

  $: normalized = query.trim().toLowerCase();
  $: filtered = terms.filter((term) => {
    const queryMatch = !normalized || term.term.toLowerCase().includes(normalized);
    const yearMatch = year === "all" || String(term.year) === year;
    return queryMatch && yearMatch;
  });
  $: selected = terms.find((term) => term.term_id === selectedTermId);
  $: selectedAnnotation = selected
    ? annotations.find((row) => row.term_id === selected.term_id)
    : null;

  function choose(term) {
    onselect(term.term_id);
  }
</script>

<aside
  class:visible
  class:open
  class="word-rail"
  aria-label="140 条年度网络用语词表"
>
  <button
    class="word-rail__toggle"
    type="button"
    aria-expanded={open}
    aria-controls="word-rail-panel"
    on:click={() => (open = !open)}
  >
    <strong>140 词</strong>
    <span>{open ? "收起" : "打开"}</span>
    {#if selected}<small>{selected.term} · {selected.year}</small>{/if}
  </button>

  <div id="word-rail-panel" class="word-rail__panel">
    <header>
      <p>WORD LIST / 词表</p>
      <button type="button" on:click={() => (open = false)} aria-label="关闭词表">×</button>
    </header>
    <div class="word-rail__controls">
      <label>
        <span class="sr-only">搜索词语</span>
        <input bind:value={query} placeholder="搜索词语" />
      </label>
      <label>
        <span class="sr-only">按年份筛选</span>
        <select bind:value={year}>
          <option value="all">全部年份</option>
          {#each [...new Set(terms.map((term) => term.year))].sort((a, b) => b - a) as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>
    </div>
    <div class="word-rail__list">
      {#each filtered as term}
        <button
          type="button"
          class:selected={term.term_id === selectedTermId}
          on:click={() => choose(term)}
        >
          <span>{term.term}</span><small>{term.year}</small>
        </button>
      {/each}
    </div>
    {#if selected}
      <footer>
        <strong>{selected.term}</strong>
        <span>{selected.year} · {selected.list_series}</span>
        {#if selectedAnnotation?.documented_variation}
          <em>有官方变体说明</em>
        {/if}
        {#if selectedAnnotation?.documented_cross_register}
          <em>有官方语域说明</em>
        {/if}
        <a href={selected.source_url} target="_blank" rel="noreferrer">查看来源</a>
      </footer>
    {/if}
  </div>
</aside>

