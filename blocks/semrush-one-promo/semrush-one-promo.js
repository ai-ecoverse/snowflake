/**
 * semrush-one-promo — Asymmetric overlap card (v3 cinematic, L1)
 *
 * Authoring rows (positional):
 *   1. eyebrow text     (e.g. "SEMRUSH ONE")
 *   2. h2 headline
 *   3. body paragraph
 *   4. CTA link         (wrap in <strong><a> for .btn--trial style)
 *   5. aside eyebrow    (side panel label)
 *   6. aside body       (side panel description)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row) { return row?.firstElementChild || null; }

  const [eyebrowRow, headlineRow, bodyRow, ctaRow, asideEyebrowRow, asideBodyRow] = rows;

  // Cover card
  const cover = document.createElement('article');
  cover.className = 'so-card-cover';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 'stat-eyebrow t-eyebrow is-upper';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    cover.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    cover.append(h2);
  }

  if (bodyRow) {
    const p = document.createElement('p');
    p.className = 'body t-body-m';
    p.innerHTML = cell(bodyRow)?.innerHTML || '';
    cover.append(p);
  }

  if (ctaRow) {
    const ctaCell = cell(ctaRow);
    if (ctaCell) {
      [...ctaCell.childNodes].forEach((n) => cover.append(n.cloneNode(true)));
    }
  }

  // Side panel
  const aside = document.createElement('aside');
  aside.className = 'so-card-side';

  if (asideEyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow';
    p.innerHTML = cell(asideEyebrowRow)?.innerHTML || '';
    aside.append(p);
  }

  if (asideBodyRow) {
    const p = document.createElement('p');
    p.className = 'body t-body-m';
    p.innerHTML = cell(asideBodyRow)?.innerHTML || '';
    aside.append(p);
  }

  const card = document.createElement('div');
  card.className = 'so-card';
  card.append(cover, aside);

  block.replaceChildren(card);
}
