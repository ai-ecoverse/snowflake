/**
 * hero — dark mosaic image grid + hub-router 3 product cards
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. <h1> headline
 *   3. body paragraph
 *   4. CTA links (primary = solid white)
 *   5–14. mosaic grid images (10 images: col-1-img-1, col-1-img-2, col-2-img-1... col-5-img-2)
 *   15. hub card 1: title | body | CTA link | data-cx attribute value
 *   16. hub card 2: title | body | CTA link | data-cx attribute value
 *   17. hub card 3: title | body | CTA link | data-cx attribute value
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';

  // Text area
  const text = document.createElement('div');
  text.className = 'hero-text';

  const eyebrowCell = rows[0]?.firstElementChild;
  if (eyebrowCell) {
    const appId = document.createElement('div');
    appId.className = 'hero-app-id';
    const mark = document.createElement('span');
    mark.className = 'cx-mark';
    mark.setAttribute('aria-hidden', 'true');
    const eyebrow = document.createElement('span');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    appId.append(mark, eyebrow);
    text.append(appId);
  }

  const headlineCell = rows[1]?.firstElementChild;
  if (headlineCell) {
    const h1 = headlineCell.querySelector('h1') || headlineCell.querySelector('h2');
    if (h1) text.append(h1.cloneNode(true));
    else {
      const h = document.createElement('h1');
      h.className = 't-title-1';
      h.textContent = headlineCell.textContent.trim();
      text.append(h);
    }
  }

  const bodyCell = rows[2]?.firstElementChild;
  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 't-body-m';
    p.textContent = bodyCell.textContent.trim();
    text.append(p);
  }

  const ctaCell = rows[3]?.firstElementChild;
  if (ctaCell && ctaCell.querySelector('a')) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-ctas';
    [...ctaCell.childNodes].forEach(n => ctas.append(n.cloneNode(true)));
    text.append(ctas);
  }

  wrap.append(text);

  // Mosaic image grid (rows 4–13, 10 images)
  const gridImages = rows.slice(4, 14).map(r => r.querySelector('img, picture'));
  if (gridImages.some(Boolean)) {
    const grid = document.createElement('div');
    grid.className = 'hero-image-grid';
    grid.setAttribute('aria-hidden', 'true');
    // 5 cols × 2 images
    for (let col = 0; col < 5; col++) {
      const colEl = document.createElement('div');
      colEl.className = 'grid-col';
      colEl.dataset.col = col + 1;
      [0, 1].forEach(row => {
        const card = document.createElement('div');
        card.className = 'grid-card';
        const img = gridImages[col * 2 + row];
        if (img) card.append(img.cloneNode(true));
        colEl.append(card);
      });
      grid.append(colEl);
    }
    wrap.append(grid);
  }

  // Hub-router cards (rows 14–16)
  const hubCards = rows.slice(14, 17);
  const cxValues = ['brand-intelligence', 'cx-coworker', 'cx-analytics'];
  if (hubCards.length) {
    const router = document.createElement('div');
    router.className = 'hero-hub-router';
    router.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'hhub-track';

    hubCards.forEach((row, i) => {
      const cells = [...row.children];
      const title = cells[0]?.textContent.trim();
      const body = cells[1]?.textContent.trim();
      const link = cells[2]?.querySelector('a');
      const cx = cells[3]?.textContent.trim() || cxValues[i];

      const card = document.createElement('div');
      card.className = 'hhub-card';
      card.dataset.index = i;
      card.dataset.cx = cx;

      const header = document.createElement('div');
      header.className = 'hhub-card-header';
      const label = document.createElement('span');
      label.className = 'hhub-card-label';
      label.textContent = title;
      header.append(label);

      const media = document.createElement('div');
      media.className = 'hhub-card-media';

      const footer = document.createElement('div');
      footer.className = 'hhub-card-footer';
      const copy = document.createElement('div');
      copy.className = 'hhub-card-copy';
      const bodyP = document.createElement('p');
      bodyP.className = 'hhub-card-body';
      bodyP.textContent = body;
      copy.append(bodyP);
      if (link) {
        const a = link.cloneNode(true);
        a.className = 'hhub-card-learn';
        a.textContent = link.textContent.trim() || 'Learn more';
        copy.append(a);
      }
      footer.append(copy);

      card.append(header, media, footer);
      track.append(card);
    });

    router.append(track);
    wrap.append(router);
  }

  block.replaceChildren(wrap);
}
