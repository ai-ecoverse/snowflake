export default async function decorate(block) {
  const rows = [...block.children];

  // Rows:
  // 0: eyebrow text
  // 1: h1 headline
  // 2: body paragraph
  // 3: CTAs
  // 4: background image (picture)
  // 5-8: chat bubbles 1-4

  const eyebrowText = rows[0]?.querySelector('div')?.textContent?.trim() || '';
  const titleEl = rows[1]?.querySelector('div');
  const bodyEl = rows[2]?.querySelector('div');
  const ctasEl = rows[3]?.querySelector('div');
  const bgImg = rows[4]?.querySelector('img');

  const chatTexts = [];
  for (let i = 5; i <= 8; i += 1) {
    chatTexts.push(rows[i]?.querySelector('div')?.textContent?.trim() || '');
  }

  // Build copy column
  const copy = document.createElement('div');
  copy.className = 'bc-hero__copy';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'bc-hero__eyebrow';
  eyebrow.textContent = eyebrowText;
  copy.appendChild(eyebrow);

  const titleWrapper = document.createElement('h1');
  titleWrapper.className = 'bc-hero__title';
  if (titleEl) {
    const h1 = titleEl.querySelector('h1');
    titleWrapper.innerHTML = h1 ? h1.innerHTML : titleEl.innerHTML;
  }
  copy.appendChild(titleWrapper);

  const body = document.createElement('p');
  body.className = 'bc-hero__body';
  if (bodyEl) body.textContent = bodyEl.textContent.trim();
  copy.appendChild(body);

  const ctas = document.createElement('div');
  ctas.className = 'bc-hero__ctas';
  if (ctasEl) {
    [...ctasEl.childNodes].forEach((node) => ctas.appendChild(node.cloneNode(true)));
  }
  copy.appendChild(ctas);

  // Build media column
  const media = document.createElement('div');
  media.className = 'bc-hero__media';

  if (bgImg) {
    const bg = bgImg.cloneNode(true);
    bg.className = 'bc-hero__bg';
    media.appendChild(bg);
  }

  chatTexts.forEach((text, idx) => {
    if (!text) return;
    const bubble = document.createElement('div');
    bubble.className = `bc-hero__chat bc-hero__chat--${idx + 1}`;
    bubble.textContent = text;
    media.appendChild(bubble);
  });

  // Assemble
  const inner = document.createElement('div');
  inner.className = 'bc-hero__inner';
  inner.appendChild(copy);
  inner.appendChild(media);

  block.innerHTML = '';
  block.appendChild(inner);
}
