export default async function decorate(block) {
  const rows = [...block.children];

  // Each row: number | name | count | URL
  const wrap = document.createElement('div');
  wrap.className = 'topic-band-wrap';

  // Section head
  const head = document.createElement('div');
  head.className = 'topic-band-head';
  const headLeft = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.className = 'topic-band-eyebrow';
  eyebrow.textContent = 'By Topic';
  const h2 = document.createElement('h2');
  h2.textContent = 'Across the channel';
  headLeft.append(eyebrow, h2);
  head.append(headLeft);
  const allLink = document.createElement('a');
  allLink.className = 'topic-band-all-link';
  allLink.href = '/sitemap';
  allLink.textContent = 'All sections →';
  head.append(allLink);
  wrap.append(head);

  // Topic row
  const row = document.createElement('div');
  row.className = 'topic-row';

  rows.forEach((r) => {
    const cells = [...r.children];
    const num = cells[0]?.textContent.trim();
    const name = cells[1]?.textContent.trim();
    const count = cells[2]?.textContent.trim();
    const url = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim();

    if (!name) return;

    const cell = document.createElement('a');
    cell.className = 'topic-cell';
    if (url) cell.href = url;

    const numEl = document.createElement('span');
    numEl.className = 'topic-num';
    numEl.textContent = num || '';

    const nameEl = document.createElement('span');
    nameEl.className = 'topic-name';
    nameEl.textContent = name;

    const countEl = document.createElement('span');
    countEl.className = 'topic-count';
    countEl.textContent = count || '';

    cell.append(numEl, nameEl, countEl);
    row.append(cell);
  });

  wrap.append(row);
  block.innerHTML = '';
  block.append(wrap);
}
