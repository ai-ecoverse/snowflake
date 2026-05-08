/**
 * hero — Mosaic-convergence image grid + hub-router cards.
 *
 * Authoring rows (positional):
 *   1.  Eyebrow text
 *   2.  h1 headline
 *   3.  Body paragraph
 *   4.  CTA link(s)
 *   5.  Hub-router card 1: col 1 = label | col 2 = body text
 *   6.  Hub-router card 2: col 1 = label | col 2 = body text
 *   7.  Hub-router card 3: col 1 = label | col 2 = body text
 *   8.  Mosaic col 1: cell 1 = top img | cell 2 = bottom img
 *   9.  Mosaic col 2: cell 1 = top img | cell 2 = bottom img
 *   10. Mosaic col 3: cell 1 = top img | cell 2 = bottom img
 *   11. Mosaic col 4: cell 1 = top img | cell 2 = bottom img
 *   12. Mosaic col 5: cell 1 = top img | cell 2 = bottom img
 */

const CX_KEYS = ['brand-intelligence', 'cx-coworker', 'cx-analytics'];

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = rows[0]?.firstElementChild;
  const headCell    = rows[1]?.firstElementChild;
  const bodyCell    = rows[2]?.firstElementChild;
  const ctaCell     = rows[3]?.firstElementChild;
  const hubRows     = rows.slice(4, 7);
  const imgRows     = rows.slice(7, 12);

  // ── 1. Hero text overlay ──────────────────────────────────────────────────
  const heroText = document.createElement('div');
  heroText.className = 'hero-text';

  const appId = document.createElement('div');
  appId.className = 'hero-app-id';
  const mark = document.createElement('span');
  mark.className = 'cx-mark';
  mark.setAttribute('aria-hidden', 'true');
  const eyebrow = document.createElement('span');
  eyebrow.className = 't-eyebrow';
  eyebrow.textContent = eyebrowCell?.textContent.trim() || '';
  appId.append(mark, eyebrow);
  heroText.append(appId);

  if (headCell) {
    const hEl = headCell.querySelector('h1') || document.createElement('h1');
    if (!headCell.querySelector('h1')) {
      hEl.textContent = headCell.textContent.trim();
    }
    hEl.className = 't-title-1';
    heroText.append(hEl.cloneNode(true));
  }

  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 't-body-m';
    p.textContent = bodyCell.textContent.trim();
    heroText.append(p);
  }

  if (ctaCell?.querySelector('a')) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-ctas';
    [...ctaCell.querySelectorAll('a')].forEach((a) => {
      const clone = a.cloneNode(true);
      if (!clone.className) clone.className = 'btn btn--solid-white';
      ctas.append(clone);
    });
    heroText.append(ctas);
  }

  // ── 2. Desktop image grid ─────────────────────────────────────────────────
  const imageGrid = document.createElement('div');
  imageGrid.className = 'hero-image-grid';
  imageGrid.setAttribute('aria-hidden', 'true');

  imgRows.forEach((row, colIdx) => {
    const col = document.createElement('div');
    col.className = 'grid-col';
    col.dataset.col = String(colIdx + 1);
    const cells = [...row.children];
    cells.forEach((cell, rowIdx) => {
      const card = document.createElement('div');
      card.className = 'grid-card';
      if (rowIdx > 0) card.dataset.gridRow = '2';
      const img = cell.querySelector('img');
      if (img) card.append(img.cloneNode(true));
      col.append(card);
    });
    imageGrid.append(col);
  });

  // ── 3. Mobile image grid ──────────────────────────────────────────────────
  const mobileGrid = document.createElement('div');
  mobileGrid.className = 'hero-mobile-grid';
  mobileGrid.setAttribute('aria-hidden', 'true');

  const mobileColClasses = [
    'hmg-col--outer-left', 'hmg-col--left', 'hmg-col--center',
    'hmg-col--right', 'hmg-col--outer-right',
  ];
  imgRows.forEach((row, colIdx) => {
    const col = document.createElement('div');
    col.className = `hmg-col ${mobileColClasses[colIdx] || ''}`;
    const cells = [...row.children];
    cells.forEach((cell) => {
      const card = document.createElement('div');
      card.className = 'hmg-card';
      const img = cell.querySelector('img');
      if (img) card.append(img.cloneNode(true));
      col.append(card);
    });
    mobileGrid.append(col);
  });

  // ── 4. Hub-router ─────────────────────────────────────────────────────────
  const hubRouter = document.createElement('div');
  hubRouter.className = 'hero-hub-router';
  hubRouter.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'hhub-track';

  hubRows.forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() || '';
    const body  = cells[1]?.textContent.trim() || '';

    const card = document.createElement('div');
    card.className = 'hhub-card';
    card.dataset.index = String(i);
    card.dataset.cx = CX_KEYS[i] || `cx-${i}`;

    const header = document.createElement('div');
    header.className = 'hhub-card-header';
    const labelEl = document.createElement('span');
    labelEl.className = 'hhub-card-label';
    labelEl.textContent = label;
    header.append(labelEl);

    const media = document.createElement('div');
    media.className = 'hhub-card-media';
    const fallback = document.createElement('div');
    fallback.className = 'hhub-card-img-fallback';
    fallback.innerHTML = label.replace(' Adobe ', '<br>Adobe ');
    media.append(fallback);

    const footer = document.createElement('div');
    footer.className = 'hhub-card-footer';
    const copy = document.createElement('div');
    copy.className = 'hhub-card-copy';
    const bodyP = document.createElement('p');
    bodyP.className = 'hhub-card-body';
    bodyP.textContent = body;
    copy.append(bodyP);
    const cta = document.createElement('span');
    cta.className = 'hhub-card-cta';
    cta.setAttribute('aria-hidden', 'true');
    footer.append(copy, cta);

    card.append(header, media, footer);
    track.append(card);
  });

  hubRouter.append(track);

  // ── Assemble ──────────────────────────────────────────────────────────────
  block.replaceChildren(heroText, imageGrid, mobileGrid, hubRouter);
}
