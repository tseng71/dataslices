<script>
  import { base } from "$app/paths";
  import CaseExplorer from "./CaseExplorer.svelte";
  import EquityVisual from "./EquityVisual.svelte";
  import EvidenceLadder from "./EvidenceLadder.svelte";
  import HeroCurtain from "./HeroCurtain.svelte";
  import Methods from "./Methods.svelte";
  import PixelExplainer from "./PixelExplainer.svelte";
  import ReadingProgress from "./ReadingProgress.svelte";
  import RecoveryField from "./RecoveryField.svelte";
  import RecoveryScrolly from "./RecoveryScrolly.svelte";
  import { recoveryStates } from "../data/story.js";
</script>

<svelte:head>
  <link rel="stylesheet" href={`${base}/fonts.css`} />
</svelte:head>

<a class="skip-link" href="#story">跳到正文</a>
<ReadingProgress />

<header class="story-nav">
  <a href="../../" class="brand" aria-label="返回数据切片首页">
    <strong>数据切片</strong><span>DATA SLICES</span>
  </a>
  <span>故事 #005</span>
</header>

<main id="story">
  <section class="hero" aria-labelledby="story-title">
    <div class="hero__copy">
      <p class="kicker">VIIRS 夜间灯光 · 停电与恢复</p>
      <h1 id="story-title">城市突然<br />熄灯时，<br />太空看见了什么？</h1>
      <p class="dek">
        灯不是同时灭，也不会同时亮回来。卫星看到的，是一座城市被重新划分成许多种等待时间。
      </p>
      <p class="byline">数据切片 · 2026 年 7 月</p>
    </div>
    <div class="hero__visual">
      <HeroCurtain />
    </div>
    <a class="hero__cue" href="#opening"><span>从第一夜开始</span><i></i></a>
  </section>

  <article>
    <section class="opening prose" id="opening">
      <p class="eyebrow">01 / 第一夜</p>
      <h2>从太空看，黑暗像一个结果。<br />从街道看，它才刚刚开始。</h2>
      <p class="lead">
        2017 年 9 月 20 日，飓风 Maria 横穿波多黎各。电网倒下之后，圣胡安中心、沿海城镇与山区没有进入同一种黑暗。
      </p>
      <p>
        夜间灯光能让这场停电第一次以空间出现：哪里突然变暗，哪里仍有微光，哪里后来先亮起来。
        但它也很容易制造一个误会——当一座岛在卫星图上重新发光，我们会以为“恢复”已经发生。
      </p>
      <blockquote>
        <span>六个月累计</span>
        <strong>39 亿</strong>
        <p>用户小时的供电损失。一个用户停电一小时，计为一个用户小时。</p>
      </blockquote>
      <p class="opening__thesis">
        这篇故事追的不是“灯什么时候回来”，而是：<strong>谁先亮起，谁从平均值里消失，又是谁继续等待。</strong>
      </p>
    </section>

    <PixelExplainer />
    <RecoveryScrolly />

    <figure class="neighborhood-map">
      <img
        src={`${base}/assets/maria-recovery-neighborhoods.webp`}
        alt="波多黎各八个市镇的街道恢复时长模型图，黄色表示较快恢复，蓝紫色表示等待更久"
        width="1600"
        height="900"
      />
      <figcaption>
        <span>把 100 格放回地理空间</span>
        同一场风暴留下八种街区节奏。颜色表示 30 米模型估计的断电持续天数，而不是 VIIRS 原生像素。
        来源：Román 等（2019），PLOS ONE，CC BY。
      </figcaption>
    </figure>

    <EquityVisual />
    <EvidenceLadder />
    <CaseExplorer />
    <Methods />

    <section class="ending" aria-labelledby="ending-title">
      <div class="ending__field" aria-hidden="true">
        <RecoveryField state={recoveryStates[3]} compact ending />
      </div>
      <div class="ending__copy">
        <p>从太空看，城市已经亮了 97%。</p>
        <h2 id="ending-title">从街道看，<br />最后 3% 不是尾数。<br />是还在等待的人。</h2>
        <a href="#story-title">回到第一夜</a>
      </div>
    </section>
  </article>
</main>

<footer class="story-footer">
  <a href="../../">数据切片 / DATA SLICES</a>
  <p>关于日常世界的互动数据故事。</p>
  <span>© 2026</span>
</footer>

<noscript>
  <p class="noscript-note">
    当前为无脚本阅读模式：所有核心结论与来源仍可阅读；拖动比较和滚动状态不可用。
  </p>
</noscript>
