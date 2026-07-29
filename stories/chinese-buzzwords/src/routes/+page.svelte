<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import data from "$lib/data/story-data.json";
  import { createStoryState } from "$lib/state/story.svelte.js";
  import Scrolly from "$lib/components/Scrolly.svelte";
  import StoryGraphic from "$lib/components/StoryGraphic.svelte";
  import WordRail from "$lib/components/WordRail.svelte";
  import Explorer from "$lib/components/Explorer.svelte";
  import StaticArchive from "$lib/components/StaticArchive.svelte";

  const steps = [
    {
      id: "field-intro",
      chapter: "00 / 先看词",
      heading: "这些词，你还认得几个？",
      paragraphs: [
        "页面周围只是跨年份挑选的一组词，不是全部 140 条。",
        "它们先作为语言环境出现，而不是被塞进卡片和表格。"
      ],
      note: "本章人口：约 40 个跨年份策展词。"
    },
    {
      id: "field-color",
      chapter: "01 / 时间显影",
      heading: "颜色先教会你时间",
      paragraphs: [
        "朱红来自较早年份，蓝色来自中段，紫色来自最近几年。",
        "YYDS 只是其中一个可追踪对象。"
      ],
      note: "字号表示叙事焦点，不表示热度。"
    },
    {
      id: "title-reveal",
      chapter: "02 / 标题",
      heading: "从一句话，到一种说话方式",
      paragraphs: [
        "2012—2025，十四份年度名单留下 140 种说法。",
        "我们不计算它们的寿命，而是看名单里的语言形式怎样改变。"
      ],
      note: "标题在词场之后出现。"
    },
    {
      id: "year-focus",
      chapter: "03 / 2021",
      heading: "先落到一个年份",
      paragraphs: [
        "YYDS 与“破防”“绝绝子”“躺平”等词共同进入 2021 年度记录。",
        "同年并列只是时代上下文，不是热度排序。"
      ],
      note: "本章人口：2021 年十词；其它年份仅作背景定位。"
    },
    {
      id: "year-river",
      chapter: "04 / 年份河流",
      heading: "十四年，完整 140 个词",
      paragraphs: [
        "向两边展开以后，每个年份都由十个真实词组成。",
        "没有“+7”，也没有用圆点替代读者真正想看的词。"
      ],
      note: "本章人口：完整 140 词。右侧词表可随时检查。"
    },
    {
      id: "form-short",
      chapter: "05 / 构词流带",
      heading: "先看短词和标签",
      paragraphs: [
        "140 个词离开年份列，汇入四条构词流带。",
        "59 个被编码为短词或标签：锦鲤、佛系、硬核、破防、班味儿。"
      ],
      note: "带宽表示本项目编辑编码后的词条数量。"
    },
    {
      id: "form-phrase",
      chapter: "06 / 完整句式",
      heading: "早年的名单更常保留整句话",
      paragraphs: [
        "64 个词条属于固定短语或完整句式。",
        "“小伙伴们都惊呆了”“世界那么大，我想去看看”把原场景一起带进名单。"
      ],
      note: "这是年度名单的形式构成，不代表整个中文社会。"
    },
    {
      id: "form-template",
      chapter: "07 / 模板",
      heading: "有些句子，后来变成了骨架",
      paragraphs: [
        "严格门槛下，只有四个词进入明确模板组。",
        "数量很少，但它们揭示了一种不同的留下方式：词退到后面，槽位继续工作。"
      ],
      note: "本组 4 个；不把“看起来能仿写”自动算作模板。"
    },
    {
      id: "form-mixed",
      chapter: "08 / 混写",
      heading: "还有十三个词，不只使用汉字",
      paragraphs: [
        "数字、字母、英文和汉字在同一个词里并置：996、YYDS、村BA、City不City。",
        "它们不是一路增加的单一趋势，而是名单里反复出现的书写策略。"
      ],
      note: "本组 13 个缩写、数字或中英混写词。"
    },
    {
      id: "length-scatter",
      chapter: "09 / 长短",
      heading: "把 140 个词放到字符长度轴上",
      paragraphs: [
        "从一个字的“怼”，到十四字的“明明可以靠脸吃饭却偏偏靠才华”，每个词先保留自己的位置。",
        "字符数去除常见标点，只描述书写长度。"
      ],
      note: "本章人口：完整 140 词。"
    },
    {
      id: "length-density",
      chapter: "10 / 聚合",
      heading: "聚合以后，才能看见名单形状",
      paragraphs: [
        "2018—2021 的名单更集中在短词一端，之后长句又重新出现。",
        "这只能说明这些年度名单的组成改变，不能外推为“中文越来越短”。"
      ],
      note: "聚合曲线仍能回到组成它的词。"
    },
    {
      id: "template-engine",
      chapter: "11 / 拆开",
      heading: "模板章只需要四个词",
      paragraphs: [
        "“道路千万条，安全第一条”露出“××千万条，××第一条”的槽位。",
        "“主打一个××”和“××基础××不基础”把槽位直接写进词条。"
      ],
      note: "其余 136 个词不需要在本章充当背景装饰。"
    },
    {
      id: "evidence-paths",
      chapter: "12 / 有多少证据",
      heading: "只有五个词进入后续路径",
      paragraphs: [
        "四个词有官方记录的变体说明，一个词有语域扩展说明。",
        "数据不足以支撑宏大的作用域圆环，所以这里直接画五条来源路径。"
      ],
      note: "本章人口：5 个有官方后续说明的词。"
    },
    {
      id: "evidence-results",
      chapter: "13 / 去了哪里",
      heading: "词移动到资料记录的终点",
      paragraphs: [
        "“来财”连接到“来分、来 offer”；“情绪价值”连接到人际关系和职场。",
        "路径只证明来源中记录过后续用法，不证明因果、成功或寿命。"
      ],
      note: "没有来源的终点不画。"
    },
    {
      id: "evidence-matrix",
      chapter: "14 / 我们不知道什么",
      heading: "五个有说明，另外一百三十五个呢？",
      paragraphs: [
        "完整 140 词再次出现为 140 个单元。",
        "灰色单元表示目前只有年度入选记录——不是死亡，只是我们不知道后来的路。"
      ],
      note: "本章人口：完整 140 词；已知 5，未知 135。"
    },
    {
      id: "mixed-stream",
      chapter: "15 / 抽出一个子集",
      heading: "把十三个混写词重新读一遍",
      paragraphs: [
        "江南Style、打call、skr、C位、996、YYDS、村BA、人工智能+、City不City、DeepSeek……",
        "它们从矩阵里被抽出，恢复成一条可读的词流。"
      ],
      note: "这是书写形式子集，不是赢家排行榜。"
    },
    {
      id: "return-field",
      chapter: "16 / 回到词场",
      heading: "退潮以后，留下了什么？",
      paragraphs: [
        "结尾回到跨年份策展词场，而不是只剩一个 YYDS。",
        "有些留下词形，有些留下槽位，有些只留下年度档案中的一格。"
      ],
      note: "完整 140 词仍在常驻词表、探索器与静态档案中。"
    }
  ];

  const story = createStoryState(steps);
  let testState = "";
  let initialQuery = "YYDS";
  let selectedTermId = "2021-02";

  $: railVisible = !["field-intro", "field-color"].includes(story.activeId);

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    testState = params.get("test-state") ?? "";
    const queryTerm = params.get("term");
    initialQuery = queryTerm?.toLowerCase() === "yyds" ? "YYDS" : queryTerm ?? "YYDS";
    const selected = data.terms.find(
      (term) => term.term.toLowerCase() === initialQuery.toLowerCase()
    );
    if (selected) selectedTermId = selected.term_id;
    const forcedScene = params.get("scene");
    if (forcedScene) story.setActive(forcedScene);
    story.setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  });

  function selectTerm(termId) {
    selectedTermId = termId;
    const term = data.terms.find((row) => row.term_id === termId);
    if (!term || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("term", term.term.toLowerCase());
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  function handleQuery(value) {
    const term = data.terms.find((row) => row.term.toLowerCase() === value.trim().toLowerCase());
    if (term) selectedTermId = term.term_id;
  }
</script>

<svelte:head>
  <title>从一句话到一种说话方式｜中文网络流行语档案</title>
  <meta
    name="description"
    content="沿着 2012—2025 年 140 条年度网络用语，观察完整句式、短标签、模板和混写怎样进入年度语言档案。"
  />
</svelte:head>

{#if testState === "loading"}
  <main class="system-state" data-scene-id="loading-state">
    <p class="eyebrow">流行语档案</p>
    <h1>从一句话到一种说话方式</h1>
    <p role="status">正在载入词语档案…</p>
  </main>
{:else if testState === "data-error"}
  <main class="system-state" data-scene-id="data-error">
    <p class="eyebrow">流行语档案</p>
    <h1>从一句话到一种说话方式</h1>
    <p role="alert">互动数据暂时无法载入。你仍可阅读按年份整理的静态词表。</p>
    <StaticArchive terms={data.terms} compact />
  </main>
{:else}
  <main>
    <article>
      <Scrolly
        {steps}
        activeId={story.activeId}
        onactive={(id) => story.setActive(id)}
        label="中文网络流行语的连续滚动叙事"
      >
        <div slot="graphic">
          <StoryGraphic
            state={story.visual}
            terms={data.terms}
            annotations={data.annotations}
            {selectedTermId}
            onselect={selectTerm}
          />
        </div>
      </Scrolly>

      <WordRail
        terms={data.terms}
        annotations={data.annotations}
        {selectedTermId}
        visible={railVisible}
        onselect={selectTerm}
      />

      <section class="afterword">
        <p class="eyebrow">这篇故事没有回答</p>
        <h2>一个流行语究竟能活多久？</h2>
        <p>
          年度名单只记录词语在某一年被选中。若要测量寿命，需要同一平台、同一采样方法、跨越多年的连续语料，还要区分自然使用、解释、复述和怀旧引用。
        </p>
        <p>
          因此这里不提供平均寿命排行榜。我们能可靠展示的是名单里的词形、年份、构词方式，以及少量有来源的后续说明。
        </p>
      </section>

      {#key initialQuery}
        <Explorer
          terms={data.terms}
          annotations={data.annotations}
          {initialQuery}
          onquery={handleQuery}
        />
      {/key}

      <section class="archive-section" id="static-archive">
        <div class="archive-section__header">
          <p class="eyebrow">完整档案</p>
          <h2>2012—2025 年，140 条年度网络用语</h2>
          <p>页面顺序不解释为热度排名。每一条都可以回到官方来源。</p>
        </div>
        <StaticArchive terms={data.terms} />
      </section>

      <footer class="story-footer">
        <nav aria-label="项目资源">
          <a href={`${base}/methodology/`}>方法</a>
          <a href={`${base}/data/annual-network-terms.csv`} download>数据</a>
          <a href="#static-archive">完整词表</a>
        </nav>
        <p>
          来源：
          <a href="https://nlp.ccnu.edu.cn/conference/15" target="_blank" rel="noreferrer">2012—2024 汇总表</a>
          ·
          <a href="https://nlp.ccnu.edu.cn/news/146" target="_blank" rel="noreferrer">2025 发布页</a>
        </p>
      </footer>

      <noscript data-scene-id="no-script-fallback">
        互动功能需要 JavaScript；完整正文、方法与按年份词表仍可阅读。
      </noscript>
    </article>
  </main>
{/if}
