/**
 * editorial-bento — trust builder; 2-col bento layout
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3. Left card eyebrow ("By the numbers")
 *   4. Left card stat figure (or placeholder markup)
 *   5. Left card body
 *   6. Right card image (<picture> or placeholder)
 *   7. Right card eyebrow ("AI Visibility Index")
 *   8. Right card h3
 *   9. Right card body
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (row) => row?.firstElementChild;

  // Header rows
  const eyebrowText = cell(rows[0])?.textContent?.trim() || '';
  const headlineEl  = cell(rows[1]);

  // Left card
  const leftEyebrowText = cell(rows[2])?.textContent?.trim() || '';
  const leftStatEl      = cell(rows[3]);
  const leftBodyEl      = cell(rows[4]);

  // Right card
  const rightImageEl    = cell(rows[5]);
  const rightEyebrowText = cell(rows[6])?.textContent?.trim() || '';
  const rightH3El       = cell(rows[7]);
  const rightBodyEl     = cell(rows[8]);

  // Section header
  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    header.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = headlineEl.innerHTML;
    header.appendChild(h2);
  }

  // Bento row
  const bentoRow = document.createElement('div');
  bentoRow.className = 'bento-row';

  // Left card (dark stats)
  const bentoLeft = document.createElement('article');
  bentoLeft.className = 'bento-left';

  if (leftEyebrowText) {
    const ey = document.createElement('p');
    ey.className = 'stat-eyebrow';
    ey.textContent = leftEyebrowText;
    bentoLeft.appendChild(ey);
  }

  if (leftStatEl) {
    const statWrap = document.createElement('div');
    statWrap.className = 'stat-figure-wrap';
    statWrap.innerHTML = leftStatEl.innerHTML;
    bentoLeft.appendChild(statWrap);
  }

  if (leftBodyEl) {
    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'stat-body-wrap';
    bodyWrap.innerHTML = leftBodyEl.innerHTML;
    bentoLeft.appendChild(bodyWrap);
  }

  // Right card
  const bentoRight = document.createElement('div');
  bentoRight.className = 'bento-right';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'bento-right-image';
  if (rightImageEl) {
    const pic = rightImageEl.querySelector('picture, img');
    if (pic) {
      imageWrap.appendChild(pic.cloneNode(true));
    } else {
      imageWrap.setAttribute('aria-hidden', 'true');
      imageWrap.textContent = rightImageEl.textContent.trim() || 'AI Visibility Index';
    }
  }
  bentoRight.appendChild(imageWrap);

  const rightCopy = document.createElement('div');
  rightCopy.className = 'bento-right-copy';

  if (rightEyebrowText) {
    const ey = document.createElement('p');
    ey.className = 'ai-eyebrow';
    ey.textContent = rightEyebrowText;
    rightCopy.appendChild(ey);
  }

  if (rightH3El) {
    const h3 = document.createElement('h3');
    h3.className = 't-title-3';
    h3.innerHTML = rightH3El.innerHTML;
    rightCopy.appendChild(h3);
  }

  if (rightBodyEl) {
    const body = document.createElement('div');
    body.className = 'bento-body';
    body.innerHTML = rightBodyEl.innerHTML;
    rightCopy.appendChild(body);
  }

  bentoRight.appendChild(rightCopy);
  bentoRow.appendChild(bentoLeft);
  bentoRow.appendChild(bentoRight);

  block.replaceChildren(header, bentoRow);
}
