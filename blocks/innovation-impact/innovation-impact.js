export default async function decorate(block) {
  const rows = [...block.children];

  // Detect optional section-head row (single cell with h2)
  let headRow = null;
  let cardRows = rows;
  const firstCells = rows[0] ? [...rows[0].children] : [];
  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headRow = rows[0];
    cardRows = rows.slice(1);
  }

  const wrap = document.createElement('div');
  wrap.className = 'innovation-impact-wrap';

  // Section head
  const head = document.createElement('div');
  head.className = 'innovation-impact-head';
  const headLeft = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.className = 'innovation-impact-eyebrow';
  eyebrow.textContent = 'Sponsored';
  const h2El = document.createElement('h2');
  if (headRow) {
    const sourceH2 = headRow.querySelector('h2');
    h2El.textContent = sourceH2 ? sourceH2.textContent.trim() : 'Innovation & Impact';
  } else {
    h2El.textContent = 'Innovation & Impact';
  }
  headLeft.append(eyebrow, h2El);
  head.append(headLeft);
  wrap.append(head);

  // Each card row: image | eyebrow | title | URL
  const grid = document.createElement('div');
  grid.className = 'innovation-impact-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imgEl = cells[0]?.querySelector('img');
    const eyebrowText = cells[1]?.textContent.trim();
    const title = cells[2]?.textContent.trim();
    const url = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim();

    if (!title) return;

    const tile = document.createElement('a');
    tile.className = 'promo-tile';
    if (url) tile.href = url;

    const thumb = document.createElement('div');
    thumb.className = 'promo-thumb';
    if (imgEl) thumb.append(imgEl.cloneNode(true));
    tile.append(thumb);

    const body = document.createElement('div');
    body.className = 'promo-body';

    if (eyebrowText) {
      const eyebrowEl = document.createElement('span');
      eyebrowEl.className = 'promo-eyebrow';
      eyebrowEl.textContent = eyebrowText;
      body.append(eyebrowEl);
    }

    const titleEl = document.createElement('p');
    titleEl.className = 'promo-title';
    titleEl.textContent = title;
    body.append(titleEl);

    const arrow = document.createElement('span');
    arrow.className = 'promo-arrow';
    arrow.textContent = 'Read more →';
    body.append(arrow);

    tile.append(body);
    grid.append(tile);
  });

  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
