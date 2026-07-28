<script>
  import { base } from "$app/paths";
</script>

<section class="methods" id="method" aria-labelledby="methods-title">
  <div class="methods__header">
    <p class="eyebrow">07 / 怎样读一张夜图</p>
    <h2 id="methods-title">夜间灯光是线索，<br />不是停电账本。</h2>
  </div>

  <div class="methods__steps">
    <article>
      <span>01</span>
      <h3>先校正天空</h3>
      <p>月光、云、气溶胶、雪与观测角度都会改变亮度。Black Marble 产品尝试去除这些影响。</p>
    </article>
    <article>
      <span>02</span>
      <h3>再选择基准</h3>
      <p>灾前和灾后必须使用可比的范围与处理。服务空值或单夜缺测不能自动解释为停电。</p>
    </article>
    <article>
      <span>03</span>
      <h3>最后回到地面</h3>
      <p>电力公司记录、道路损毁、设施位置与现场报道，决定“变暗”究竟意味着什么。</p>
    </article>
  </div>

  <details>
    <summary>数据限制、来源与可复核文件</summary>
    <div class="methods__details">
      <p>
        VIIRS 日度产品的原生空间分辨率约 500 米。文中 30 米街区图来自研究团队结合多源数据的模型化下推。
        不同案例仅比较证据类型与时间尺度，不把颜色或亮度直接放到同一数轴。
      </p>
      <ul>
        <li><a href="https://www.earthdata.nasa.gov/data/projects/black-marble">NASA Black Marble</a></li>
        <li><a href="https://science.nasa.gov/earth/earth-observatory/night-lights-show-slow-recovery-from-maria-144371/">NASA：Maria 后的缓慢恢复</a></li>
        <li><a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0218883">Román 等（2019），PLOS ONE</a></li>
        <li><a href="https://svs.gsfc.nasa.gov/5058/">NASA SVS：飓风 Ian 前后</a></li>
        <li><a href="https://www.earthdata.nasa.gov/news/worldview-image-archive/houston-power-outages-due-hurricane-beryl">NASA Earthdata：Beryl 后的休斯敦</a></li>
        <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10687289/">Kerber 等（2023）：加拉加斯大停电</a></li>
      </ul>
      <p class="methods__files">
        <a href={`${base}/docs/methodology.md`}>完整方法</a>
        <a href={`${base}/docs/sources.md`}>证据台账</a>
        <a href={`${base}/docs/qa-notes.md`}>质量检查</a>
      </p>
    </div>
  </details>
</section>
