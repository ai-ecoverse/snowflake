/**
 * stats-row — 4-up KPI stat tiles on dark surface.
 * Authoring rows:
 *   1: Section heading
 *   2-5: Stat rows — Cell 1=number, Cell 2=unit, Cell 3=label
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  const grid = document.createElement('div');
  grid.className = 'stats-row-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const number = cells[0]?.textContent.trim() ?? '';
    const unit = cells[1]?.textContent.trim() ?? '';
    const label = cells[2]?.textContent.trim() ?? '';

    const tile = document.createElement('div');
    tile.className = 'stat-tile';

    const numEl = document.createElement('span');
    numEl.className = 'stat-number';
    numEl.textContent = number;

    const unitEl = document.createElement('span');
    unitEl.className = 'stat-unit';
    unitEl.textContent = unit;

    const labelEl = document.createElement('p');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    tile.append(numEl, unitEl, labelEl);
    grid.append(tile);
  });

  fragments.push(grid);
  block.replaceChildren(...fragments);
}
