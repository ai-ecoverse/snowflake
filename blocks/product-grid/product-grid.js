/**
 * product-grid — Tabbed product grid (black, 6 cards).
 *
 * Authoring rows (positional):
 *   1.      Section headline
 *   2–N.    Tab rows: cell 1 = tab label | cell 2 = pane title | cell 3 = pane body
 *           (detected by having 3 cells and no img)
 *   N+1–M.  Card rows: cell 1 = mark text | cell 2 = mark data-mark | cell 3 = card title
 *           | cell 4 = badge text (optional, blank if none) | cell 5 = card body | cell 6 = link href
 *           (detected by having 6 cells)
 *   Last.   Footer CTA row (single <a>)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headCell = rows[0]?.firstElementChild;

  // Classify rows
  const tabRows  = [];
  const cardRows = [];
  let   footRow  = null;

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const hasLink = cells[0]?.querySelector('a');
    if (hasLink && cells.length <= 2) {
      footRow = row;
    } else if (cells.length >= 5) {
      cardRows.push(row);
    } else if (cells.length >= 2) {
      tabRows.push(row);
    }
  });

  // ── Section header ─────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'product-section__header';

  if (headCell) {
    const h2 = document.createElement('h2');
    h2.className = 'title-2 product-section__title';
    h2.textContent = headCell.textContent.trim();
    header.append(h2);
  }

  // ── Scaffold (tabs + panes) ────────────────────────────────────────────────
  const scaffold = document.createElement('div');
  scaffold.className = 'product-section__scaffold';

  const tabStrip = document.createElement('div');
  tabStrip.className = 'product-section__tabs';

  const panesWrap = document.createElement('div');

  const tabDefs = tabRows.map((row, i) => {
    const cells = [...row.children];
    return {
      label:      cells[0]?.textContent.trim() || `Tab ${i + 1}`,
      paneTitle:  cells[1]?.textContent.trim() || '',
      paneBody:   cells[2]?.textContent.trim() || '',
    };
  });

  // If no explicit tabs authored, synthesise one default tab from card rows
  if (tabDefs.length === 0) {
    tabDefs.push({ label: 'All products', paneTitle: '', paneBody: '' });
  }

  const tabButtons = [];
  const paneEls    = [];

  tabDefs.forEach((def, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `product-section__tab${i === 0 ? ' is-active' : ''}`;
    btn.textContent = def.label;
    tabStrip.append(btn);
    tabButtons.push(btn);

    const pane = document.createElement('div');
    pane.className = `product-section__pane${i === 0 ? ' is-active' : ''}`;
    if (def.paneTitle) {
      const pt = document.createElement('h3');
      pt.className = 'title-4 product-section__pane-title';
      pt.textContent = def.paneTitle;
      pane.append(pt);
    }
    if (def.paneBody) {
      const pb = document.createElement('p');
      pb.className = 'product-section__pane-body';
      pb.textContent = def.paneBody;
      pane.append(pb);
    }
    panesWrap.append(pane);
    paneEls.push(pane);
  });

  scaffold.append(tabStrip, panesWrap);

  const listHeading = document.createElement('p');
  listHeading.className = 'product-section__list-heading';
  listHeading.textContent = 'Explore products.';

  // ── Card grids (one per tab) ───────────────────────────────────────────────
  // Group card rows by current tab (all assigned to tab 0 if no grouping info)
  const grids = tabDefs.map((_, i) => {
    const grid = document.createElement('div');
    grid.className = `product-section__grid${i === 0 ? ' is-active' : ''}`;
    return grid;
  });

  cardRows.forEach((row) => {
    const cells  = [...row.children];
    const markText   = cells[0]?.textContent.trim() || '';
    const markKey    = cells[1]?.textContent.trim() || '';
    // Title cell may contain a badge <span> inside — preserve innerHTML
    const titleCell  = cells[2];
    const bodyText   = cells[4]?.textContent.trim() || '';
    const linkCell   = cells[5];

    const card = document.createElement('div');
    card.className = 'explore-card';

    const container = document.createElement('div');
    container.className = 'explore-card-container';

    // Link wrapper
    const href = linkCell?.querySelector('a')?.href || linkCell?.textContent.trim() || '#';
    const link = document.createElement('a');
    link.className = 'explore-card-link-container';
    link.href = href;

    const content = document.createElement('div');
    content.className = 'explore-card-content';

    const markEl = document.createElement('div');
    markEl.className = 'explore-card-mark';
    markEl.dataset.mark = markKey;
    markEl.textContent = markText;

    const textEl = document.createElement('div');
    textEl.className = 'explore-card-text';

    const titleEl = document.createElement('h3');
    titleEl.className = 'title-4';
    titleEl.innerHTML = titleCell?.innerHTML || '';

    const bodyEl = document.createElement('p');
    bodyEl.className = 'body-md';
    bodyEl.textContent = bodyText;

    textEl.append(titleEl, bodyEl);
    content.append(markEl, textEl);
    link.append(content);
    container.append(link);

    // Background image placeholder (no image authored → empty)
    const bg = document.createElement('div');
    bg.className = 'explore-card-background';
    container.append(bg);

    card.append(container);

    // Assign to first grid (all tabs share one set of cards in this simple impl)
    grids[0].append(card);
  });

  // ── Footer CTA ─────────────────────────────────────────────────────────────
  const foot = document.createElement('div');
  foot.className = 'product-section__foot';

  if (footRow) {
    const a = footRow.querySelector('a');
    if (a) {
      const clone = a.cloneNode(true);
      if (!clone.className) clone.className = 'btn btn--ghost-white';
      foot.append(clone);
    }
  }

  // ── Tab interaction ────────────────────────────────────────────────────────
  tabButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b, j) => {
        b.classList.toggle('is-active', j === i);
        paneEls[j]?.classList.toggle('is-active', j === i);
        grids[j]?.classList.toggle('is-active', j === i);
      });
    });
  });

  // ── Assemble ───────────────────────────────────────────────────────────────
  block.replaceChildren(header, scaffold, listHeading, ...grids, foot);
}
