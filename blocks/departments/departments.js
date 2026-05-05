export default async function decorate(block) {
  const rows = [...block.children];

  // Detect optional section-head row (single cell with h2)
  let headRow = null;
  let deptRows = rows;
  const firstCells = rows[0] ? [...rows[0].children] : [];
  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headRow = rows[0];
    deptRows = rows.slice(1);
  }

  const wrap = document.createElement('div');
  wrap.className = 'departments-wrap';

  if (headRow) {
    const head = document.createElement('div');
    head.className = 'departments-head';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'departments-eyebrow';
    eyebrow.textContent = 'Inside each section';
    const h2 = headRow.querySelector('h2');
    head.append(eyebrow);
    if (h2) head.append(h2.cloneNode(true));
    wrap.append(head);
  }

  // Each row: label | a1-title | a1-url | a2-title | a2-url | a3-title | a3-url
  const grid = document.createElement('div');
  grid.className = 'departments-grid';

  deptRows.forEach((row) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim();
    if (!label) return;

    const dept = document.createElement('div');
    dept.className = 'dept';

    const labelEl = document.createElement('span');
    labelEl.className = 'dept-label';
    labelEl.textContent = label;
    dept.append(labelEl);

    const list = document.createElement('ul');
    list.className = 'dept-list';

    // Articles in pairs: title (odd index) + url (even index), starting at index 1
    for (let i = 1; i < cells.length; i += 2) {
      const title = cells[i]?.textContent.trim();
      const urlCell = cells[i + 1];
      const url = urlCell?.querySelector('a')?.href || urlCell?.textContent.trim();
      if (!title) continue;

      const li = document.createElement('li');
      li.className = 'dept-item';
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = url || '#';
      a.textContent = title;
      h3.append(a);
      li.append(h3);
      list.append(li);
    }

    dept.append(list);
    grid.append(dept);
  });

  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
