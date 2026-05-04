/**
 * task-navigator — 3x3 numbered tile grid for top tasks
 *
 * Authoring rows (positional):
 *   1. <h2> section heading
 *   2..N: tile rows — cells: number | label | URL
 *         Each row becomes a clickable tile card
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'container';

  // First row = header
  const headerRow = rows[0];
  const headerCell = headerRow?.firstElementChild;
  const header = document.createElement('div');
  header.className = 'task-nav-header';
  const h2 = headerCell?.querySelector('h2');
  if (h2) {
    header.append(h2.cloneNode(true));
  } else if (headerCell) {
    const heading = document.createElement('h2');
    heading.textContent = headerCell.textContent.trim();
    header.append(heading);
  }
  container.append(header);

  // Remaining rows = tiles
  const grid = document.createElement('div');
  grid.className = 'task-grid';

  rows.slice(1).forEach((row, idx) => {
    const cells = [...row.children];
    const numCell = cells[0];
    const labelCell = cells[1];
    const urlCell = cells[2];

    const tile = document.createElement('a');
    tile.className = 'task-tile';

    // Determine href: from an anchor in the URL cell, label cell, or number cell
    const linkSource = urlCell?.querySelector('a') || labelCell?.querySelector('a') || numCell?.querySelector('a');
    tile.href = linkSource ? linkSource.href : '#';

    const number = document.createElement('span');
    number.className = 'task-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(idx + 1).padStart(2, '0');

    const label = document.createElement('span');
    label.className = 'task-label';
    label.textContent = labelCell ? labelCell.textContent.trim() : (numCell ? numCell.textContent.trim() : '');

    tile.append(number, label);
    grid.append(tile);
  });

  container.append(grid);
  block.replaceChildren(container);
}
