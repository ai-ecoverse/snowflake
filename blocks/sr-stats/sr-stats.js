export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 = eyebrow | h2
  const headRow = rows[0];
  const headCells = [...headRow.querySelectorAll(':scope > div')];

  const head = document.createElement('div');
  head.className = 'sr-stats__head';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'sr-stats__eyebrow';
  eyebrow.textContent = headCells[0]?.textContent?.trim() || '';
  head.appendChild(eyebrow);

  const heading = document.createElement('h2');
  heading.className = 'sr-stats__heading';
  const h2El = headCells[1]?.querySelector('h2');
  heading.innerHTML = h2El ? h2El.innerHTML : (headCells[1]?.textContent?.trim() || '');
  head.appendChild(heading);

  // Build grid
  const grid = document.createElement('div');
  grid.className = 'sr-stats__grid';

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.querySelectorAll(':scope > div')];

    const stat = document.createElement('div');
    stat.className = 'sr-stat';

    const value = document.createElement('span');
    value.className = 'sr-stat__value';
    value.textContent = cells[0]?.textContent?.trim() || '';
    stat.appendChild(value);

    const label = document.createElement('span');
    label.className = 'sr-stat__label';
    label.textContent = cells[1]?.textContent?.trim() || '';
    stat.appendChild(label);

    if (cells[2]) {
      const body = document.createElement('p');
      body.className = 'sr-stat__body';
      body.textContent = cells[2].textContent.trim();
      stat.appendChild(body);
    }

    grid.appendChild(stat);
  }

  block.innerHTML = '';
  block.appendChild(head);
  block.appendChild(grid);
}
