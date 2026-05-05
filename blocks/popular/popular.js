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
  wrap.className = 'popular-wrap';

  // Section head
  const head = document.createElement('div');
  head.className = 'popular-head';
  const eyebrow = document.createElement('span');
  eyebrow.className = 'popular-eyebrow';
  eyebrow.textContent = 'Trending';
  const h2El = document.createElement('h2');
  if (headRow) {
    const sourceH2 = headRow.querySelector('h2');
    h2El.textContent = sourceH2 ? sourceH2.textContent.trim() : 'Most popular';
  } else {
    h2El.textContent = 'Most popular';
  }
  head.append(eyebrow, h2El);
  wrap.append(head);

  // Each row: rank | title | URL | author
  const list = document.createElement('ol');
  list.className = 'popular-list';

  listRows.forEach((row) => {
    const cells = [...row.children];
    const rank = cells[0]?.textContent.trim();
    const title = cells[1]?.textContent.trim();
    const url = cells[2]?.querySelector('a')?.href || cells[2]?.textContent.trim();
    const author = cells[3]?.textContent.trim();

    if (!title) return;

    const item = document.createElement('li');
    item.className = 'popular-item';

    const rankEl = document.createElement('span');
    rankEl.className = 'popular-rank';
    rankEl.setAttribute('aria-hidden', 'true');
    rankEl.textContent = rank || String(list.children.length + 1);

    const textEl = document.createElement('div');
    textEl.className = 'popular-text';

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = url || '#';
    a.textContent = title;
    h3.append(a);
    textEl.append(h3);

    if (author) {
      const authorEl = document.createElement('p');
      authorEl.className = 'popular-author';
      authorEl.textContent = author;
      textEl.append(authorEl);
    }

    item.append(rankEl, textEl);
    list.append(item);
  });

  wrap.append(list);
  block.innerHTML = '';
  block.append(wrap);
}
