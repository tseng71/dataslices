(() => {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_DPR = 1.75;

  /*
   * Fixed catalogue used by every sky in the story.
   * Coordinates and magnitudes are stored locally so all comparisons use the
   * same sky, projection and threshold. The catalogue is deterministic and is
   * never regenerated on scroll.
   */
  const STAR_CATALOGUE = [
    [0.08,0.12,1.5],[0.15,0.24,4.7],[0.22,0.08,5.8],[0.29,0.19,3.2],[0.36,0.11,5.4],[0.44,0.25,2.1],[0.51,0.10,4.1],[0.58,0.20,5.9],[0.66,0.08,3.7],[0.74,0.18,5.1],[0.82,0.11,2.8],[0.91,0.24,4.5],
    [0.05,0.36,5.9],[0.13,0.42,3.6],[0.20,0.33,4.9],[0.27,0.47,2.4],[0.34,0.38,5.5],[0.41,0.49,4.2],[0.48,0.35,1.8],[0.55,0.44,5.7],[0.62,0.31,3.3],[0.70,0.48,4.8],[0.78,0.36,5.2],[0.86,0.45,2.7],[0.94,0.34,4.0],
    [0.09,0.58,4.4],[0.17,0.66,5.6],[0.24,0.55,2.9],[0.31,0.70,4.8],[0.38,0.60,5.9],[0.46,0.73,3.5],[0.53,0.57,4.2],[0.60,0.68,1.9],[0.68,0.55,5.4],[0.75,0.72,3.1],[0.83,0.61,4.6],[0.90,0.69,5.8],[0.96,0.56,2.5],
    [0.04,0.82,3.8],[0.12,0.91,5.3],[0.20,0.79,4.6],[0.28,0.88,2.2],[0.35,0.80,5.7],[0.43,0.93,3.4],[0.50,0.83,4.9],[0.57,0.90,5.9],[0.65,0.78,2.6],[0.72,0.89,4.1],[0.80,0.81,5.5],[0.88,0.92,3.0],[0.95,0.80,4.7],
    [0.11,0.18,6.2],[0.18,0.14,6.0],[0.25,0.27,6.4],[0.32,0.23,5.7],[0.39,0.16,6.1],[0.47,0.18,5.6],[0.54,0.27,6.3],[0.61,0.15,5.8],[0.69,0.24,6.2],[0.76,0.13,5.6],[0.84,0.27,6.4],[0.92,0.17,5.9],
    [0.07,0.49,6.1],[0.16,0.52,5.8],[0.23,0.41,6.3],[0.30,0.57,5.6],[0.37,0.45,6.2],[0.45,0.54,5.9],[0.52,0.47,6.4],[0.59,0.39,5.7],[0.67,0.51,6.1],[0.73,0.43,5.8],[0.81,0.53,6.3],[0.89,0.40,5.6],[0.97,0.48,6.0],
    [0.06,0.72,5.7],[0.14,0.76,6.2],[0.22,0.68,5.9],[0.29,0.74,6.4],[0.36,0.67,5.6],[0.44,0.77,6.1],[0.51,0.71,5.8],[0.58,0.75,6.3],[0.66,0.69,5.7],[0.74,0.76,6.2],[0.82,0.70,5.9],[0.90,0.75,6.4],[0.97,0.66,5.6],
    [0.08,0.95,5.9],[0.17,0.85,6.3],[0.25,0.96,5.6],[0.33,0.86,6.1],[0.40,0.98,5.8],[0.48,0.87,6.4],[0.56,0.96,5.7],[0.63,0.84,6.2],[0.71,0.97,5.9],[0.79,0.86,6.3],[0.87,0.97,5.6],[0.94,0.87,6.1]
  ].map(([x, y, mag], index) => ({ x, y, mag, warm: index % 7 === 0 }));

  function fitCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function drawMilkyWay(ctx, width, height, opacity) {
    if (opacity <= 0) return;
    ctx.save();
    ctx.translate(width * 0.5, height * 0.5);
    ctx.rotate(-0.32);
    const gradient = ctx.createLinearGradient(-width * 0.7, 0, width * 0.7, 0);
    gradient.addColorStop(0, 'rgba(150,170,195,0)');
    gradient.addColorStop(0.25, `rgba(170,185,205,${opacity * 0.25})`);
    gradient.addColorStop(0.5, `rgba(220,225,220,${opacity * 0.42})`);
    gradient.addColorStop(0.75, `rgba(165,180,205,${opacity * 0.22})`);
    gradient.addColorStop(1, 'rgba(150,170,195,0)');
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(18px)';
    ctx.fillRect(-width * 0.75, -height * 0.09, width * 1.5, height * 0.18);
    ctx.restore();
  }

  function drawSky(canvas, { limit = 6.2, glow = 0.05, milky = true } = {}) {
    if (!canvas) return;
    const { ctx, width, height } = fitCanvas(canvas);
    const top = [5 + glow * 24, 8 + glow * 28, 16 + glow * 34];
    const bottom = [10 + glow * 150, 13 + glow * 100, 20 + glow * 45];
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgb(${top.map(Math.round).join(',')})`);
    gradient.addColorStop(1, `rgb(${bottom.map(Math.round).join(',')})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawMilkyWay(ctx, width, height, milky ? clamp((limit - 5.15) / 1.1, 0, 0.9) : 0);

    STAR_CATALOGUE.forEach((star) => {
      if (star.mag > limit) return;
      const contrast = clamp((limit - star.mag + 0.25) / 1.5, 0.18, 1);
      const radius = clamp((6.8 - star.mag) * 0.42, 0.45, 2.35);
      const x = star.x * width;
      const y = star.y * height;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = star.warm
        ? `rgba(255,229,197,${contrast})`
        : `rgba(226,239,255,${contrast})`;
      ctx.fill();
      if (radius > 1.55) {
        ctx.strokeStyle = `rgba(235,243,255,${contrast * 0.22})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - radius * 2.6, y);
        ctx.lineTo(x + radius * 2.6, y);
        ctx.stroke();
      }
    });
  }

  const hero = document.getElementById('heroSky');
  const ageCanvas = document.getElementById('ageSky');
  const limitCanvas = document.getElementById('limitSky');
  const locationCanvas = document.getElementById('locationSky');
  const endingCanvas = document.getElementById('endingSky');

  function visibleStarCount(limit) {
    const normalized = clamp((limit - 3.75) / (6.1 - 3.75), 0, 1);
    return Math.round(100 + 150 * normalized);
  }

  function ageState(age) {
    const t = clamp(age / 18, 0, 1);
    const limit = 6.1 - 2.35 * t;
    return { age, limit, count: visibleStarCount(limit), glow: 0.04 + 0.56 * t };
  }

  const ageValue = document.getElementById('ageValue');
  const starCount = document.getElementById('starCount');
  function setAge(age) {
    const state = ageState(age);
    ageValue.textContent = state.age;
    starCount.textContent = state.count;
    drawSky(ageCanvas, { limit: state.limit, glow: state.glow, milky: state.limit > 5.3 });
  }

  const steps = [...document.querySelectorAll('.step')];
  function updateAgeFromScroll() {
    if (!steps.length) return;
    let active = steps[0];
    let distance = Infinity;
    steps.forEach((step) => {
      const nextDistance = Math.abs(step.getBoundingClientRect().top - window.innerHeight * 0.44);
      if (nextDistance < distance) {
        active = step;
        distance = nextDistance;
      }
    });
    steps.forEach((step) => step.classList.toggle('is-active', step === active));
    setAge(Number(active.dataset.age));
  }

  const magSlider = document.getElementById('magSlider');
  const magOutput = document.getElementById('magOutput');
  const limitCaption = document.getElementById('limitCaption');
  function updateLimit() {
    const limit = Number(magSlider.value);
    magOutput.value = limit.toFixed(1);
    limitCaption.textContent = limit < 3
      ? '只剩最亮的恒星与行星'
      : limit < 4.2
        ? '主要星座仍可辨认'
        : limit < 5.3
          ? '星座之间的暗星开始出现'
          : '银河和丰富暗星有机会被看见';
    drawSky(limitCanvas, { limit, glow: clamp((6.5 - limit) * 0.14, 0.02, 0.7), milky: limit >= 5.3 });
  }
  magSlider?.addEventListener('input', updateLimit);

  const locations = {
    'times-square': { name: '时代广场', range: '2.7—3.2 等', limit: 3.0, glow: 0.72, milky: '不可见', desc: '高强度商业照明与都市光穹下，通常只剩最亮恒星与行星。' },
    'central-park': { name: '中央公园', range: '3.2—3.8 等', limit: 3.6, glow: 0.55, milky: '不可见', desc: '直接眩光减少、视野更开阔，但仍处在曼哈顿光穹中。' },
    'jamaica-bay': { name: '牙买加湾', range: '4.0—4.6 等', limit: 4.4, glow: 0.38, milky: '通常不可见', desc: '城市边缘条件较好，星座周围较暗恒星开始重新出现。' },
    'pelham-bay': { name: '佩勒姆湾公园', range: '4.4—5.0 等', limit: 4.8, glow: 0.30, milky: '极难辨认', desc: '远离核心商业区后，天空结构更加丰富，但仍受都市圈影响。' },
    'montauk': { name: '更暗参照地', range: '5.3—6.0 等', limit: 5.7, glow: 0.12, milky: '条件好时可见', desc: '都市圈外较暗环境的参照情景；不是纽约市内地点。' }
  };

  function setLocation(id) {
    const data = locations[id];
    if (!data) return;
    document.querySelectorAll('.pin').forEach((button) => {
      const selected = button.dataset.location === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.getElementById('locationName').textContent = data.name;
    document.getElementById('locationDesc').textContent = data.desc;
    document.getElementById('locationMag').textContent = data.range;
    document.getElementById('locationMilky').textContent = data.milky;
    drawSky(locationCanvas, { limit: data.limit, glow: data.glow, milky: data.limit >= 5.3 });
  }
  document.querySelectorAll('.pin').forEach((button) => {
    button.addEventListener('click', () => setLocation(button.dataset.location));
    button.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) setLocation(button.dataset.location);
    });
  });

  const comparisonData = [
    ['高亮度商业核心', 3.0, 0.72],
    ['高密度城市中心', 3.6, 0.55],
    ['城市边缘', 4.4, 0.38],
    ['普通郊区', 5.0, 0.25],
    ['暗夜环境', 6.2, 0.05]
  ];
  const multipleHost = document.getElementById('skyMultiples');
  if (multipleHost && !multipleHost.children.length) {
    comparisonData.forEach(([label, limit, glow]) => {
      const article = document.createElement('article');
      article.className = 'mini-sky';
      article.innerHTML = `<canvas aria-label="${label}下的同一天区模拟星空"></canvas><div><h3>${label}</h3><p>可见极限情景：约 ${limit.toFixed(1)} 等</p></div>`;
      multipleHost.appendChild(article);
      drawSky(article.querySelector('canvas'), { limit, glow, milky: limit >= 5.3 });
    });
  }

  const birdSky = document.getElementById('birdSky');
  const lightToggle = document.getElementById('lightToggle');
  const birdCaption = document.getElementById('birdCaption');
  let lightOn = true;
  const birds = [];
  if (birdSky) {
    for (let index = 0; index < 40; index += 1) {
      const bird = document.createElement('i');
      bird.className = 'bird';
      bird.style.setProperty('--row', String(index % 8));
      bird.style.setProperty('--delay', `${(index % 10) * -0.35}s`);
      birdSky.appendChild(bird);
      birds.push(bird);
    }
  }
  function updateBirds() {
    birdSky?.classList.toggle('off', !lightOn);
    birds.forEach((bird, index) => {
      bird.classList.toggle('attracted', lightOn && index % 3 !== 0);
    });
    lightToggle.textContent = lightOn ? '关闭高强度灯光' : '重新开启灯光';
    lightToggle.setAttribute('aria-pressed', String(lightOn));
    birdCaption.textContent = lightOn
      ? '灯光开启：部分轨迹向光源偏转并出现盘旋。'
      : '灯光关闭：轨迹逐渐恢复为更稳定的迁徙方向。';
  }
  lightToggle?.addEventListener('click', () => { lightOn = !lightOn; updateBirds(); });

  const labCanvas = document.getElementById('labSky');
  const tempSlider = document.getElementById('tempSlider');
  const tempOutput = document.getElementById('tempOutput');
  const glowScore = document.getElementById('glowScore');
  function updateLab() {
    const toggles = [...document.querySelectorAll('#lightingControls input[type="checkbox"]')];
    const effects = { useful: 16, shielded: 24, dimmed: 19, timed: 18 };
    let score = 96;
    toggles.forEach((toggle) => { if (toggle.checked) score -= effects[toggle.dataset.effect] || 0; });
    const kelvin = Number(tempSlider.value);
    score += (kelvin - 2200) / 150;
    score = Math.round(clamp(score, 16, 96));
    glowScore.textContent = score;
    tempOutput.value = `${kelvin}K`;
    const limit = 6.15 - score / 100 * 2.8;
    drawSky(labCanvas, { limit, glow: score / 130, milky: limit >= 5.3 });
    document.querySelector('.lab-viz')?.style.setProperty('--spill', String(score / 100));
  }
  document.querySelectorAll('#lightingControls input').forEach((control) => control.addEventListener('input', updateLab));

  function updateHero() {
    if (!hero) return;
    const rect = document.querySelector('.hero').getBoundingClientRect();
    const progress = reducedMotion ? 0.55 : clamp(-rect.top / Math.max(1, rect.height - window.innerHeight), 0, 1);
    drawSky(hero, {
      limit: 6.2 - progress * 3.2,
      glow: 0.04 + progress * 0.68,
      milky: progress < 0.48
    });
    document.querySelector('.hero-copy')?.style.setProperty('--hero-fade', String(clamp(1 - progress * 1.35, 0.18, 1)));
  }

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? clamp(window.scrollY / max, 0, 1) * 100 : 0;
    document.getElementById('progressBar').style.width = `${percent}%`;
  }

  function renderAll() {
    updateHero();
    updateAgeFromScroll();
    updateLimit();
    setLocation(document.querySelector('.pin.active')?.dataset.location || 'times-square');
    updateLab();
    drawSky(endingCanvas, { limit: 5.9, glow: 0.06, milky: true });
    document.querySelectorAll('.mini-sky canvas').forEach((canvas, index) => {
      const [, limit, glow] = comparisonData[index];
      drawSky(canvas, { limit, glow, milky: limit >= 5.3 });
    });
  }

  let scheduled = false;
  function scheduleScrollRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateHero();
      updateAgeFromScroll();
      scheduled = false;
    });
  }

  window.addEventListener('scroll', scheduleScrollRender, { passive: true });
  window.addEventListener('resize', renderAll);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderAll();
  });

  updateBirds();
  setLocation('times-square');
  renderAll();
})();