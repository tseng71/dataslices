<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import data from "$lib/data/story-data.json";
  import { createStoryState } from "$lib/state/story.svelte.js";
  import Scrolly from "$lib/components/Scrolly.svelte";
  import StoryGraphic from "$lib/components/StoryGraphic.svelte";
  import Explorer from "$lib/components/Explorer.svelte";
  import StaticArchive from "$lib/components/StaticArchive.svelte";

  const authoredScenes = [
    { id: "encoding-year" },
    { id: "encoding-lanes" },
    { id: "cohort-2021" },
    { id: "archive-overview" },
    { id: "archive-method-breaks" },
    { id: "life-paths" },
    { id: "register-migration" },
    { id: "template-reveal" },
    { id: "template-comparison" },
    { id: "semantic-fields" }
  ];

  const story = createStoryState(authoredScenes);
  let testState = "";
  let initialQuery = "YYDS";

  const steps = [
    {
      id: "encoding-year",
      chapter: "01 / 一条记录",
      heading: "先只确认一件事",
      paragraphs: [
        "YYDS 被列入 <strong>2021 年度十大网络用语</strong>。",
        "这能证明它在那一年进入一份年度语言档案，却不能告诉我们它第一次在哪一天出现，也不能告诉我们今天还有多少人在说。"
      ],
      note: "“入选过”不是“流行了多久”。年度名单是一张快照，不是一张心电图。"
    },
    {
      id: "encoding-lanes",
      chapter: "02 / 证据轨道",
      heading: "不同来源，回答不同问题",
      paragraphs: [
        "年度入选、网络语境、搜索关注和新闻或公共表达，是四条不同的证据轨道。",
        "搜索上升可能是人们在查含义；新闻出现可能是媒体在解释现象。它们彼此有关，却不能互相替代。"
      ],
      note: "缺数据不是零，更不是死亡。"
    },
    {
      id: "cohort-2021",
      chapter: "03 / 同一年",
      heading: "它不是孤零零的一句缩写",
      paragraphs: [
        "YYDS 和“破防”“躺平”“绝绝子”“元宇宙”等九个词共同记录了 2021。",
        "同年的并排只是时代上下文，不是重要性或热度排名。"
      ],
      note: "来源：国家语言资源监测与研究中心年度十大网络用语。"
    },
    {
      id: "archive-overview",
      chapter: "04 / 14 年",
      heading: "140 个词，排成一圈年轮",
      paragraphs: [
        "2012 年的“元芳，你怎么看”，2016 年的“蓝瘦香菇”，2024 年的“班味儿”，都留在同一套年度档案里。",
        "早年的名单常像一句完整台词；近年的短词、标签和混写更醒目。但旧形式并没有消失。"
      ],
      note: "主数据覆盖 2012—2025；2005—2011 只保留历史框架，不补造缺失词条。"
    },
    {
      id: "archive-method-breaks",
      chapter: "05 / 方法边界",
      heading: "同列，不等于同一榜单",
      paragraphs: [
        "“给力”出现在更早的媒体流行语记录中；本文的 140 条主数据来自同名的“年度十大网络用语”。",
        "不同系列观察的语域、语料和方法不同，不能直接拼成一条连续排行。"
      ],
      note: "页面发布顺序也不被解释为热度名次。"
    },
    {
      id: "life-paths",
      chapter: "06 / 后来的路",
      heading: "热词不都活成同一种样子",
      paragraphs: [
        "有的词被官方解读记录了仿写，有的记录了语域扩展。",
        "对绝大多数词，我们只知道它在某年被选中。没有后续证据，就不替它写结局。"
      ],
      note: "“尚不能判断”和有证据的路径同等可见。"
    },
    {
      id: "register-migration",
      chapter: "07 / 搬家",
      heading: "一个词离开原来的语境以后",
      paragraphs: [
        "2025 年的官方解读追溯“情绪价值”到营销学，并记录它后来扩展到人际关系、职场等场景。",
        "词形没有变，使用的地方变了。迁移不自动等于成功，也不能用来推算寿命。"
      ],
      note: "图中只连接来源明确的扩展；搜索轨道保持缺失。"
    },
    {
      id: "template-reveal",
      chapter: "08 / 拆开",
      heading: "原句退场以后，槽位还在",
      paragraphs: [
        "2019 年官方解读记录了网友如何把“道路千万条，安全第一条”拆成“××千万条，××第一条”。",
        "结构不变，替换内容，原句开始生产新的句子。"
      ],
      note: "留下来的，也许不是原句，而是一个还能继续造句的结构。"
    },
    {
      id: "template-comparison",
      chapter: "09 / 保守计算",
      heading: "14 年里，只确认四个明确模板",
      paragraphs: [
        "按严格门槛，只有词条带“××”、名称明确标“体”，或官方解读明确记载仿写结构，才算明确模板。",
        "四条分散在 2012、2019、2023 和 2025。它们不能证明模板比原词活得更久。"
      ],
      note: "可以仿写，和资料中确实记录了仿写，是两件不同的事。"
    },
    {
      id: "semantic-fields",
      chapter: "10 / 没画出来的图",
      heading: "有些空白比漂亮比例更诚实",
      paragraphs: [
        "我们原本想比较技术、工作、情绪等语义主题，但当前只有单人编辑编码。",
        "没有独立复核，就不发布一个看似精确的主题变化图。"
      ],
      note: "语义分类留在待复核清单，不进入发布数据。"
    }
  ];

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    testState = params.get("test-state") ?? "";
    initialQuery = params.get("term") ?? "YYDS";
    const forcedScene = params.get("scene");
    if (forcedScene) story.setActive(forcedScene);
    story.setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  });

  function handleScene(id) {
    story.setActive(id);
  }

  function handleQuery(value) {
    const params = new URLSearchParams(window.location.search);
    params.set("term", value.trim().toLowerCase() || "yyds");
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }
</script>

<svelte:head>
  <title>从“给力”到“情绪价值”：一个中文流行语能活多久？</title>
  <meta
    name="description"
    content="沿着 2012—2025 年的 140 条年度网络用语，观察词语如何被记录、套写、迁移与留下。"
  />
</svelte:head>

{#if testState === "loading"}
  <main class="system-state" data-scene-id="loading-state">
    <p class="eyebrow">流行语档案</p>
    <h1>从“给力”到“情绪价值”</h1>
    <p role="status">正在载入词语档案…</p>
    <div class="loading-years" aria-hidden="true">
      {#each [2012, 2015, 2018, 2021, 2025] as year}<span>{year}</span>{/each}
    </div>
  </main>
{:else if testState === "data-error"}
  <main class="system-state" data-scene-id="data-error">
    <p class="eyebrow">流行语档案</p>
    <h1>从“给力”到“情绪价值”</h1>
    <p role="alert">互动数据暂时无法载入。你仍可继续阅读正文和按年份整理的静态词表。</p>
    <div class="system-actions">
      <a href="./">重试</a>
      <a data-action="open-static-archive" href="#static-archive">查看按年份词表</a>
    </div>
    <StaticArchive terms={data.terms} compact />
  </main>
{:else}
  <main>
    <article>
      <header class="opening" data-scene-id="opening-yyds" aria-label="开场：你现在还会说 YYDS 吗？">
        <div class="opening__word" data-term-id="yyds">YYDS</div>
        <p data-copy-id="opening-question">你现在还会说它吗？</p>
        <div class="opening__prompt" aria-hidden="true">向下读</div>
      </header>

      <section class="title-panel" data-scene-id="opening-title">
        <div class="title-panel__term" data-term-id="yyds" aria-hidden="true">YYDS</div>
        <p class="eyebrow">一份中文网络流行语档案</p>
        <h1>从“给力”到“情绪价值”：一个中文流行语能活多久？</h1>
        <p class="dek">
          14 年，140 个年度网络用语。我们没有找到一条能宣判词语死亡的曲线，却看见它们怎样被记住、搬用、拆开和套写。
        </p>
        <p class="byline">数据与叙事 · 2026 年 7 月</p>
      </section>

      <Scrolly
        {steps}
        activeId={story.activeId}
        onactive={handleScene}
        label="从 YYDS 到年度档案的滚动叙事"
      >
        <div slot="graphic">
          <StoryGraphic
            state={story.visual}
            terms={data.terms}
            yearSummary={data.year_summary}
          />
        </div>
      </Scrolly>

      <section class="prose-section">
        <p class="eyebrow">词也会搬家</p>
        <h2>同一个词，换了一套生活</h2>
        <p>
          “情绪价值”并不是 2025 年才被发明。发布方的解读追溯到营销学：它原本讨论顾客在消费中的情绪体验，后来进入婚恋、情感内容，又扩展到人际关系和职场。
        </p>
        <p>
          “来财”走的是另一条路。2025 年解读记录了“来分”“来 offer”等仿造：一个看似完整的词，被网民当成了可以替换尾部的接口。
        </p>
        <p>
          前者是语域扩展，后者是词形繁殖。它们都比“今年热不热”更难用一条曲线表达。
        </p>
      </section>

      <section class="prose-section dark-band">
        <p class="eyebrow">仍然未知</p>
        <h2>我们仍不知道一个词能活多久</h2>
        <p>
          如果“寿命”指从第一次使用到最后一次使用，我们几乎永远等不到最后一次。如果定义为高频使用持续多久，就需要同一平台、同一采样方式、跨越多年的连续语料，还要区分复述、解释、引用和自然使用。
        </p>
        <p>
          即使拿到词频，也还有定义问题。一个月出现一万次、下个月出现一百次，是“死了”，还是进入低频常用？多年以后因怀旧或新闻事件再次被提起，算复活还是新一轮流行？
        </p>
        <p class="pullquote">所以，这个故事不提供“平均寿命排行榜”，也不把没有数据画成一条下坠的线。</p>
      </section>

      {#key initialQuery}
        <Explorer
          terms={data.terms}
          annotations={data.annotations}
          {initialQuery}
          onquery={handleQuery}
        />
      {/key}

      <section class="ending" data-scene-id="ending-return">
        <div class="ending__term" data-term-id="yyds">YYDS</div>
        <p class="ending__year">2021 · 年度十大网络用语</p>
        <p data-copy-id="ending-return">
          它没有被宣判活着或死去。它只是回到了自己的年份、结构与证据里。
        </p>
        <p class="ending__coda" data-copy-id="ending-coda">
          语言保存的不只是一个时代谈过什么，也保存人们学会怎样说这些事。
        </p>
        <p class="ending__question">它把什么留在了中文里？</p>
        <nav class="ending__resources" aria-label="项目资源">
          <a data-ending-resource href={`${base}/methodology/`}>方法</a>
          <a data-ending-resource href={`${base}/data/annual-network-terms.csv`} download>数据</a>
          <a data-ending-resource href="#static-archive">完整词表</a>
          <a data-ending-resource href="mailto:corrections@example.com">纠错</a>
        </nav>
      </section>

      <section class="archive-section" id="static-archive">
        <div class="archive-section__header">
          <p class="eyebrow">完整档案</p>
          <h2>2012—2025 年，140 条年度网络用语</h2>
          <p>页面顺序不解释为热度排名。每一条都可以在下载数据中回到官方来源。</p>
        </div>
        <StaticArchive terms={data.terms} />
      </section>

      <footer>
        <p>数据更新至 2025 年度发布。形式分类为编辑编码；语义比例未发布。</p>
        <p>
          来源：
          <a href="https://nlp.ccnu.edu.cn/conference/15" target="_blank" rel="noreferrer">2012—2024 汇总表</a>
          ·
          <a href="https://nlp.ccnu.edu.cn/news/146" target="_blank" rel="noreferrer">2025 发布页</a>
        </p>
      </footer>

      <noscript data-scene-id="no-script-fallback">
        互动功能需要 JavaScript；完整正文、关键结论和按年份词表仍可阅读。
      </noscript>
    </article>
  </main>
{/if}
