/**
 * Impact Band block
 * Authoring rows (positional):
 *   1. h2 heading
 *   2+. Stat rows — 2 cells: [number/value | label]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: heading
  const headingText = rows[0]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  // Stat rows
  const grid = document.createElement('div');
  grid.className = 'impact-band-grid';

  const statRows = rows.slice(1);
  statRows.forEach((row) => {
    const cells = [...row.children];
    const nText = cells[0]?.textContent?.trim() ?? '';
    const lText = cells[1]?.textContent?.trim() ?? '';

    const cell = document.createElement('div');
    cell.className = 'impact-band-cell';

    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = nText;

    const l = document.createElement('span');
    l.className = 'l';
    l.textContent = lText;

    cell.append(n, l);
    grid.append(cell);
  });

  const inner = document.createElement('div');
  inner.className = 'impact-band-inner';
  inner.append(h2, grid);

  block.replaceChildren(inner);
}
