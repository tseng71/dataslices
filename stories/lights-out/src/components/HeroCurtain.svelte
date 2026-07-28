<script>
  import { base } from "$app/paths";

  let split = $state(52);
</script>

<figure class="curtain">
  <div class="curtain__frame">
    <img
      class="curtain__image"
      src={`${base}/assets/ian-before.jpg`}
      alt="2022 年 8 月 30 日，飓风 Ian 之前的佛罗里达夜间灯光"
      width="1536"
      height="432"
    />
    <div class="curtain__after" style:clip-path={`inset(0 0 0 ${split}%)`}>
      <img
        class="curtain__image"
        src={`${base}/assets/ian-after.jpg`}
        alt="2022 年 9 月 30 日，飓风 Ian 之后的佛罗里达夜间灯光"
        width="1536"
        height="432"
      />
    </div>
    <span class="curtain__line" style:left={`${split}%`} aria-hidden="true">
      <i>↔</i>
    </span>
    <span class="curtain__label curtain__label--before">8 月 30 日 · 灾前</span>
    <span class="curtain__label curtain__label--after">9 月 30 日 · 灾后</span>
    <input
      bind:value={split}
      type="range"
      min="0"
      max="100"
      aria-label="拖动比较飓风 Ian 前后的佛罗里达夜间灯光"
    />
  </div>
  <figcaption>
    拖动分界线。NASA Black Marble 发布影像；两幅图采用同一范围与显示方式。
  </figcaption>
</figure>
