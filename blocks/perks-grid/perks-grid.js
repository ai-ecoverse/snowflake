/**
 * perks-grid — Secondary pillar 4-up grid
 *
 * Authoring rows (positional):
 *   1..N. Perk rows — each row: col1 = label | col2 = tagline
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const grid = document.createElement('div');
  grid.className = 'perks-row';

  rows.forEach((row) => {
    const label = cell(row, 0)?.textContent.trim() || '';
    const tagline = cell(row, 1)?.textContent.trim() || '';
    const slug = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const card = document.createElement('article');
    card.className = 'perk-card';
    card.dataset.pillar = slug;

    const labelEl = document.createElement('p');
    labelEl.className = 'perk-label';
    labelEl.textContent = label;

    const taglineEl = document.createElement('h3');
    taglineEl.className = 'perk-tagline t-title-4';
    taglineEl.textContent = tagline;

    const cta = document.createElement('span');
    cta.className = 'perk-cta';
    cta.setAttribute('aria-hidden', 'true');
    cta.textContent = 'Expand';

    card.append(labelEl, taglineEl, cta);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
