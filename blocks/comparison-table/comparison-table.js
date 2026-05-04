/**
 * comparison-table — N-way product spec comparison table.
 * Authoring rows:
 *   1: Section heading
 *   2: Column headers (pipe-separated values)
 *   3+: Spec rows — Cell 1=row label, Cell 2+=values
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — section heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  // Row 2 — column headers
  const headersRaw = rows[1]?.firstElementChild?.textContent.trim() ?? '';
  const headers = headersRaw ? headersRaw.split('|').map((h) => h.trim()) : [];

  const wrap = document.createElement('div');
  wrap.className = 'comparison-table-wrap';

  const table = document.createElement('table');
  table.className = 'comparison-table';

  // Thead
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  // First cell is empty (row label column)
  const thEmpty = document.createElement('th');
  thEmpty.scope = 'col';
  headerRow.append(thEmpty);

  headers.forEach((h) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = h;
    headerRow.append(th);
  });
  thead.append(headerRow);
  table.append(thead);

  // Tbody — rows 3+
  const tbody = document.createElement('tbody');

  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');

    cells.forEach((cell, i) => {
      const text = cell.textContent.trim();
      if (i === 0) {
        const th = document.createElement('th');
        th.scope = 'row';
        th.className = 'row-label';
        th.textContent = text;
        tr.append(th);
      } else {
        const td = document.createElement('td');
        // Detect numeric values
        if (/^[\d,. +x%TB]+$/.test(text)) td.classList.add('cell-num');
        if (text === '—' || text === '-') td.classList.add('em-dash');
        td.textContent = text;
        tr.append(td);
      }
    });

    tbody.append(tr);
  });

  table.append(tbody);
  wrap.append(table);
  fragments.push(wrap);

  block.replaceChildren(...fragments);
}
