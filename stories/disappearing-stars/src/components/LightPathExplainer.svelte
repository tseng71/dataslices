<section class="chapter light-path" data-scene-id="light-path" data-contract-target="light-path" aria-labelledby="light-path-heading">
  <div class="section-kicker">04 · 机制</div>
  <div class="chapter-heading">
    <h2 id="light-path-heading">把视线从天空移回地面</h2>
    <p>天空辉光不是从天而降。它从地面的灯开始。</p>
  </div>

  <figure class="mechanism-figure">
    <svg viewBox="0 0 1100 620" role="img" aria-labelledby="light-path-title light-path-desc">
      <title id="light-path-title">人工光形成天空辉光的三条路径</title>
      <desc id="light-path-desc">光可以直接向上，也可以经路面反射，进入大气后发生散射。</desc>
      <defs>
        <marker id="arrow-direct" markerWidth="12" markerHeight="12" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#d38b4a" />
        </marker>
        <marker id="arrow-scatter" markerWidth="12" markerHeight="12" refX="10" refY="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#83c5d5" />
        </marker>
        <radialGradient id="atmosphere">
          <stop offset="0" stop-color="#83c5d5" stop-opacity=".22" />
          <stop offset="1" stop-color="#83c5d5" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect class="mechanism-bg" width="1100" height="620" rx="28" />
      <ellipse cx="565" cy="225" rx="490" ry="210" fill="url(#atmosphere)" />
      <path class="ground" d="M0 505 Q300 475 580 510 T1100 495 L1100 620 L0 620 Z" />
      <g class="lamp" transform="translate(250 245)">
        <path d="M0 250 V52 Q0 0 54 0 H115" />
        <path class="fixture" d="M98 -18 h72 l18 40 h-105 z" />
        <circle cx="132" cy="25" r="10" />
      </g>
      <rect class="task-area" x="354" y="472" width="240" height="36" rx="18" />
      <text x="474" y="535" text-anchor="middle">地面任务区</text>
      <path class="ray direct" d="M384 270 Q500 150 660 73" marker-end="url(#arrow-direct)" />
      <text class="ray-label" x="512" y="127">直接上射</text>
      <path class="ray reflection" d="M373 284 L490 477 L680 258" marker-end="url(#arrow-direct)" />
      <text class="ray-label" x="560" y="410">路面反射</text>
      <path class="ray scatter" d="M680 258 Q820 168 930 286" marker-end="url(#arrow-scatter)" />
      <text class="ray-label cool" x="820" y="156">大气散射</text>
      <g class="observer" transform="translate(880 400)">
        <circle cx="0" cy="0" r="25" />
        <path d="M0 25 V105 M0 48 L-45 78 M0 48 L46 16 M0 105 L-35 150 M0 105 L35 150" />
      </g>
    </svg>
    <figcaption>
      卫星向下测离开地面的光；人在地面向上看散射后的天空。两把尺子有关，却不测量同一个量。
    </figcaption>
  </figure>
</section>
