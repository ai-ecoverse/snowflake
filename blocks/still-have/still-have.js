/**
 * still-have — "Still have questions?" contact CTA grid on dark teal background.
 *
 * Authoring rows (positional):
 *   Row 1: Section heading (h2, e.g. "Still have questions?")
 *   Row 2..N: Contact cards, one row per card
 *     - Cell 1: Eyebrow label  (e.g. "Call")
 *     - Cell 2: Card heading   (e.g. "Main office")
 *     - Cell 3: Link           (plain <a> — tel:, mailto:, or href)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: section heading
  const headingCell = rows[0]?.firstElementChild;
  const heading = document.createElement('h2');
  heading.textContent = headingCell ? headingCell.textContent.trim() : '';

  // Rows 1+: contact cards
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const eyebrowCell = cells[0];
    const titleCell   = cells[1];
    const linkCell    = cells[2];

    const card = document.createElement('div');
    card.className = 'still-card';

    if (eyebrowCell) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.textContent = eyebrowCell.textContent.trim();
      card.append(p);
    }

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      card.append(h3);
    }

    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        const a = document.createElement('a');
        a.href = anchor.href;
        a.textContent = anchor.textContent.trim();
        card.append(a);
      }
    }

    grid.append(card);
  });

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';
  inner.append(heading, grid);

  block.replaceChildren(inner);
}
