export default async function decorate(block) {
  const rows = [...block.children];

  // Detect optional section-head row (single cell with h2)
  let headRow = null;
  let listRows = rows;
  const firstCells = rows[0] ? [...rows[0].children] : [];
  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headRow = rows[0];
    listRows = rows.slice(1);
  }

  const wrap = document.createElement('div');
  wrap.className = 'more-wrap';

  if (headRow) {
    const head = document.createElement('div');
    head.className = 'more-head';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'more-eyebrow';
    eyebrow.textContent = 'More This Week';
    const h2 = headRow.querySelector('h2');
    head.append(eyebrow);
    if (h2) head.append(h2.cloneNode(true));
    wrap.append(head);
  }

  // Each row: title | URL | chip | meta
  const list = document.createElement('ol');
  list.className = 'more-list';

  listRows.forEach((row, i) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim();
    const url = cells[1]?.querySelector('a')?.href || cells[1]?.textContent.trim();
    const chip = cells[2]?.textContent.trim();
    const meta = cells[3]?.textContent.trim();

    if (!title) return;

    const item = document.createElement('li');
    item.className = 'more-item';

    const num = document.createElement('span');
    num.className = 'more-num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = String(i + 1).padStart(2, '0');

    const text = document.createElement('div');
    text.className = 'more-text';

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = url || '#';
    a.textContent = title;
    h3.append(a);
    text.append(h3);

    if (meta) {
      const metaEl = document.createElement('div');
      metaEl.className = 'more-meta';
      metaEl.textContent = meta;
      text.append(metaEl);
    }

    item.append(num, text);

    if (chip) {
      const chipEl = document.createElement('span');
      chipEl.className = 'more-chip';
      chipEl.textContent = chip;
      item.append(chipEl);
    }

    list.append(item);
  });

  wrap.append(list);
  block.innerHTML = '';
  block.append(wrap);
}
