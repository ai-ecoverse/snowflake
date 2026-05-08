export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('div')?.textContent?.trim() || '';
  const titleEl = rows[1]?.querySelector('div');
  const bodyEl = rows[2]?.querySelector('div');
  const ctasEl = rows[3]?.querySelector('div');
  const metricValue = rows[4]?.querySelector('div')?.textContent?.trim() || '';
  const metricLabel = rows[5]?.querySelector('div')?.textContent?.trim() || '';

  // Build copy column
  const copy = document.createElement('div');
  copy.className = 'sr-hero__copy';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'sr-hero__eyebrow';
  eyebrow.textContent = eyebrowText;
  copy.appendChild(eyebrow);

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'sr-hero__title';
  if (titleEl) {
    const h1 = titleEl.querySelector('h1');
    if (h1) {
      titleWrapper.innerHTML = h1.innerHTML;
    } else {
      titleWrapper.innerHTML = titleEl.innerHTML;
    }
  }
  copy.appendChild(titleWrapper);

  const body = document.createElement('p');
  body.className = 'sr-hero__body';
  if (bodyEl) body.textContent = bodyEl.textContent.trim();
  copy.appendChild(body);

  const ctas = document.createElement('div');
  ctas.className = 'sr-hero__ctas';
  if (ctasEl) {
    [...ctasEl.childNodes].forEach((node) => ctas.appendChild(node.cloneNode(true)));
  }
  copy.appendChild(ctas);

  // Build visual column
  const visual = document.createElement('div');
  visual.className = 'sr-hero__visual';

  const chart = document.createElement('div');
  chart.className = 'sr-hero__chart';

  // Decorative SVG chart
  chart.innerHTML = `
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="srHeroLine1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF642D" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#FF642D" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="srHeroLine2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6E3FF3" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#6E3FF3" stop-opacity="0.05"/>
        </linearGradient>
        <clipPath id="srHeroClip">
          <rect width="400" height="260"/>
        </clipPath>
      </defs>
      <g clip-path="url(#srHeroClip)">
        <!-- Area fill line 2 -->
        <path d="M0 200 C40 195 80 185 120 170 C160 155 200 140 240 120 C280 100 320 80 360 65 L400 55 L400 260 L0 260 Z"
          fill="url(#srHeroLine2)" opacity="0.4"/>
        <!-- Area fill line 1 (orange — winner) -->
        <path d="M0 230 C40 220 80 200 120 175 C160 148 200 115 240 85 C280 55 320 35 360 18 L400 10 L400 260 L0 260 Z"
          fill="url(#srHeroLine1)" opacity="0.5"/>
        <!-- Stroke line 2 -->
        <path d="M0 200 C40 195 80 185 120 170 C160 155 200 140 240 120 C280 100 320 80 360 65 L400 55"
          stroke="#6E3FF3" stroke-width="2" fill="none" opacity="0.7"/>
        <!-- Stroke line 1 (orange) -->
        <path d="M0 230 C40 220 80 200 120 175 C160 148 200 115 240 85 C280 55 320 35 360 18 L400 10"
          stroke="#FF642D" stroke-width="2.5" fill="none"/>
        <!-- Dot at end of orange line -->
        <circle cx="400" cy="10" r="5" fill="#FF642D"/>
        <circle cx="400" cy="10" r="9" fill="#FF642D" opacity="0.25"/>
      </g>
    </svg>
    <span class="sr-hero__chart-label">Share of voice</span>
  `;

  const metric = document.createElement('div');
  metric.className = 'sr-hero__chart-metric';
  metric.innerHTML = `<strong>${metricValue}</strong>${metricLabel}`;
  chart.appendChild(metric);

  visual.appendChild(chart);

  // Assemble inner
  const inner = document.createElement('div');
  inner.className = 'sr-hero__inner';
  inner.appendChild(copy);
  inner.appendChild(visual);

  block.innerHTML = '';
  block.appendChild(inner);
}
