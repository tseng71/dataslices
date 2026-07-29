<script>
  export let terms = [];
  export let compact = false;

  $: years = [...new Set(terms.map((term) => term.year))].sort((a, b) => a - b);
</script>

<div class:compact class="static-archive" data-static-archive>
  {#each years as year}
    <section class="archive-year" id={`archive-${year}`}>
      <h3>{year}</h3>
      <ol>
        {#each terms.filter((term) => term.year === year) as term}
          <li class:selected={term.term === "YYDS"}>{term.term}</li>
        {/each}
      </ol>
    </section>
  {/each}
</div>
