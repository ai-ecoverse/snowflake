/**
 * still-have — "Still have questions?" contact CTA with 3 cards on dark background
 *
 * Authoring rows (positional):
 *   1. Section heading (h2)
 *   2..N: Contact cards — each row has two cells:
 *         Cell 1: eyebrow label (e.g. "Call")
 *         Cell 2: card heading + link
 *                 Line 1: card h3 title
 *                 Line 2: <a> link
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: section heading
  const headingCell = rows[0]?.firstElementChild;
  const h2 = headingCell?.querySelector('h2') || document.createElement('h2');
  if (!headingCell?.querySelector('h2')) h2.textContent = headingCell?.textContent?.trim() || 'Still have questions?';

  // Rows 1+: contact cards
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const eyebrowText = cells[0]?.textContent?.trim() || '';
    const contentCell = cells[1];

    const card = document.createElement('div');
    card.className = 'still-card';

    if (eyebrowText) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowText;
      card.append(eyebrow);
    }

    if (contentCell) {
      // Clone content as-is (h3 + links)
      [...contentCell.childNodes].forEach((n) => card.append(n.cloneNode(true)));
    }

    grid.append(card);
  });

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';
  inner.append(h2, grid);

  block.replaceChildren(inner);
}
