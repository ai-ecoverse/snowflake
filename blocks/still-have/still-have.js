/**
 * Still Have Questions block
 * Authoring rows (positional):
 *   1. h2
 *   2+. contact card rows: 3 cells each [eyebrow | heading | link]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const headingText = rows[0]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const grid = document.createElement('div');
  grid.className = 'still-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const eyebrowText = cells[0]?.textContent?.trim() ?? '';
    const cardHeadText = cells[1]?.textContent?.trim() ?? '';

    // Clone the anchor from cell 3
    const anchor = cells[2]?.querySelector('a');
    let linkEl = null;
    if (anchor) {
      linkEl = anchor.cloneNode(true);
    }

    const card = document.createElement('div');
    card.className = 'still-card';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowText;

    const h3 = document.createElement('h3');
    h3.textContent = cardHeadText;

    card.append(eyebrow, h3);
    if (linkEl) card.append(linkEl);

    grid.append(card);
  });

  const inner = document.createElement('div');
  inner.className = 'still-inner';
  inner.append(h2, grid);

  block.replaceChildren(inner);
}
