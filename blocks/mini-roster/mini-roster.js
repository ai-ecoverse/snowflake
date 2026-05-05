export default async function decorate(block) {
  const rows = [...block.children];

  // Section head row (eyebrow + h2) — first row has a single cell with heading content
  // Detect: if first row has only one cell containing a heading, treat as section head
  const firstCells = rows[0] ? [...rows[0].children] : [];
  let headRow = null;
  let cardRows = rows;

  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headRow = rows[0];
    cardRows = rows.slice(1);
  }

  // Build section head
  const wrap = document.createElement('div');
  wrap.className = 'mini-roster-wrap';

  if (headRow) {
    const head = document.createElement('div');
    head.className = 'mini-roster-head';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'mini-roster-eyebrow';
    eyebrow.textContent = 'Also in the front';
    const h2 = headRow.querySelector('h2');
    head.append(eyebrow);
    if (h2) head.append(h2.cloneNode(true));
    wrap.append(head);
  }

  // Each card row: image | chip | title | link | meta
  // Columns: 0=image, 1=chip text, 2=title, 3=link URL, 4=meta
  const grid = document.createElement('div');
  grid.className = 'mini-roster-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imgEl = cells[0]?.querySelector('img');
    const chipText = cells[1]?.textContent.trim();
    const titleText = cells[2]?.textContent.trim();
    const linkHref = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim();
    const metaText = cells[4]?.textContent.trim();

    if (!titleText) return;

    const card = document.createElement('a');
    card.className = 'mini-card';
    if (linkHref) card.href = linkHref;

    const thumb = document.createElement('span');
    thumb.className = 'mini-thumb';
    if (imgEl) thumb.append(imgEl.cloneNode(true));
    card.append(thumb);

    const body = document.createElement('div');
    body.className = 'mini-body';

    if (chipText) {
      const chip = document.createElement('span');
      chip.className = 'mini-chip';
      chip.textContent = chipText;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (metaText) {
      const meta = document.createElement('div');
      meta.className = 'mini-meta';
      meta.textContent = metaText;
      body.append(meta);
    }

    card.append(body);
    grid.append(card);
  });

  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
