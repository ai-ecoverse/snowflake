/**
 * perks-grid — 4-column secondary pillar grid
 *
 * Authoring rows (positional):
 *   1..N: card rows — cells: label | tagline | cta-text
 */

function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildCard(cells) {
  const card = document.createElement('article');
  card.className = 'perk-card';
  const [labelCell, taglineCell, ctaCell] = cells;
  const tagline = taglineCell?.querySelector('h3, h4') || (() => {
    const h = document.createElement('h3');
    h.textContent = text(taglineCell);
    return h;
  })();
  tagline.className = 'perk-tagline t-title-4';
  card.innerHTML = `<p class="perk-label">${text(labelCell)}</p>`;
  card.append(tagline);
  card.insertAdjacentHTML('beforeend', `<span class="perk-cta" aria-label="Expand">${text(ctaCell) || 'Expand'}</span>`);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.className = 'perks-row';

  rows.forEach((r) => {
    const cells = rowCells(r);
    if (!cells.length) return;
    grid.append(buildCard(cells));
  });

  block.replaceChildren(grid);
}
