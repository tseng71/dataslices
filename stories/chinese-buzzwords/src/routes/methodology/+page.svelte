<script>
  import { base } from "$app/paths";
</script>

<svelte:head>
  <title>方法与数据说明｜中文流行语能活多久？</title>
</svelte:head>

<main class="method-page">
  <a class="back-link" href={`${base}/`}>← 返回故事</a>
  <article>
    <p class="eyebrow">方法与数据</p>
    <h1>我们能回答什么，不能回答什么</h1>
    <p class="dek">
      这份数据足以描述 2012—2025 年年度档案收录了什么，却不足以计算一个词的真实寿命。
    </p>

    <h2>数据</h2>
    <p>
      2012—2024 年词表来自国家语言资源监测与研究网络媒体中心汇总表，2025 年来自当年发布页，共 14 年、140 条。发布顺序只保留为页面顺序，不解释为热度排名。
    </p>
    <p>
      2019 年汇总表把第五条写作“是个狠人”，但同时期发布页与逐词解读均为“是个狼人”。处理后数据采用同时期发布页文本。
    </p>

    <h2>形式编码</h2>
    <p>每条词只归入一个互斥主类：短词或标签、固定短语、明确模板、缩写或混写。</p>
    <p>
      明确模板采用严格门槛：词条含“××”、名称明确标“体”，或官方解读明确说明仿写结构。“看起来可以仿写”不构成充分证据。
    </p>

    <h2>没有计算寿命</h2>
    <p>
      年度名单只记录离散的入选事件，没有逐月或逐日的同口径使用频率。未入选不等于没有使用，搜索关注也不能代替自然使用。因此不制作平均寿命、峰值、衰减或死亡判定。
    </p>

    <h2>未发布语义比例</h2>
    <p>
      当前语义主题只有单人编辑判断，缺少独立复核。主题边界不足以支撑趋势结论，因此在故事里明确保留空位。
    </p>

    <h2>下载与复现</h2>
    <ul>
      <li><a href={`${base}/data/annual-network-terms.csv`} download>年度词表 CSV</a></li>
      <li><a href={`${base}/data/term-annotations.csv`} download>逐词形式编码 CSV</a></li>
      <li><a href={`${base}/data/year-summary.csv`} download>年度汇总 CSV</a></li>
    </ul>

    <h2>核心来源</h2>
    <ol>
      <li><a href="https://nlp.ccnu.edu.cn/conference/15">2012—2024 年度十大网络用语汇总</a></li>
      <li><a href="https://nlp.ccnu.edu.cn/news/146">2025 年度十大网络流行语发布</a></li>
      <li><a href="https://nlp.ccnu.edu.cn/news/101">2019 年十大网络用语解读</a></li>
      <li><a href="https://www.news.cn/politics/2021-12/07/c_1128137881.htm">2021 年度十大网络用语发布</a></li>
    </ol>
  </article>
</main>
