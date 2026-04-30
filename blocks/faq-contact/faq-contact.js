/**
 * faq-contact — "Still have questions?" section: dark background with heading
 * and 3 contact cards in a grid.
 *
 * Authoring rows (positional):
 *   Row 1: section heading text (rendered as <h2>)
 *   Row 2+: each row is one card — 3 cells: eyebrow | heading | link(s)
 *
 * Link cells are cloned directly from authored content — no button classes
 * are manufactured. Authors write plain <a> elements.
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';

  // Row 1: heading
  const headingCell = rows[0]?.querySelector('div');
  const h2 = document.createElement('h2');
  h2.textContent = headingCell?.textContent?.trim() ?? '';
  inner.appendChild(h2);

  // Rows 2+: cards
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  for (let i = 1; i < rows.length; i++) {
    const cells = [...rows[i].children];
    const card = document.createElement('div');
    card.className = 'still-card';

    // Cell 0: eyebrow
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'eyebrow';
    eyebrowEl.textContent = cells[0]?.textContent?.trim() ?? '';
    card.appendChild(eyebrowEl);

    // Cell 1: heading
    const h3 = document.createElement('h3');
    h3.textContent = cells[1]?.textContent?.trim() ?? '';
    card.appendChild(h3);

    // Cell 2: links — clone children directly
    const linkCell = cells[2];
    if (linkCell) {
      for (const child of linkCell.childNodes) {
        card.appendChild(child.cloneNode(true));
      }
    }

    grid.appendChild(card);
  }

  inner.appendChild(grid);
  block.textContent = '';
  block.appendChild(inner);
}
