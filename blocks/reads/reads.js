export default async function decorate(block) {
  const rows = [...block.children];

  // Detect optional section-head row: single cell with h2
  let headRow = null;
  let cardRows = rows;
  const firstCells = rows[0] ? [...rows[0].children] : [];
  if (firstCells.length === 1 && firstCells[0].querySelector('h2')) {
    headRow = rows[0];
    cardRows = rows.slice(1);
  }

  const wrap = document.createElement('div');
  wrap.className = 'reads-wrap';

  if (headRow) {
    const head = document.createElement('div');
    head.className = 'reads-head';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'reads-eyebrow';
    eyebrow.textContent = 'This Week';
    const h2 = headRow.querySelector('h2');
    head.append(eyebrow);
    if (h2) head.append(h2.cloneNode(true));
    const allLink = document.createElement('a');
    allLink.className = 'reads-all-link';
    allLink.href = '/newsroom';
    allLink.textContent = 'All articles →';
    head.append(allLink);
    wrap.append(head);
  }

  // Each card row: image | chip | title | deck | meta | link
  const grid = document.createElement('div');
  grid.className = 'reads-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imgEl = cells[0]?.querySelector('img');
    const chipText = cells[1]?.textContent.trim();
    const titleText = cells[2]?.textContent.trim();
    const deckText = cells[3]?.textContent.trim();
    const metaText = cells[4]?.textContent.trim();
    const linkHref = cells[5]?.querySelector('a')?.href || cells[5]?.textContent.trim();

    if (!titleText) return;

    const card = document.createElement('a');
    card.className = 'reads-card';
    if (linkHref) card.href = linkHref;

    const thumb = document.createElement('span');
    thumb.className = 'reads-thumb';
    if (imgEl) thumb.append(imgEl.cloneNode(true));
    card.append(thumb);

    const body = document.createElement('div');
    body.className = 'reads-body';

    if (chipText) {
      const chip = document.createElement('span');
      chip.className = 'reads-chip';
      chip.textContent = chipText;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (deckText) {
      const deck = document.createElement('p');
      deck.className = 'reads-deck';
      deck.textContent = deckText;
      body.append(deck);
    }

    if (metaText) {
      const meta = document.createElement('div');
      meta.className = 'reads-meta';
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
