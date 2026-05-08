/**
 * product-grid — tabbed product grid
 *
 * Authoring rows (positional):
 *   1. section title (h2)
 *   2. tab names (one per cell in the row)
 *   3. active tab title (h3)
 *   4. active tab body
 *   5–N. product card rows: mark-initials | mark-color | title | body | NEW badge (optional) | link
 *   last. footer CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'container';

  // Header
  const header = document.createElement('div');
  header.className = 'product-section__header';
  const titleCell = rows[0]?.firstElementChild;
  if (titleCell) {
    const h = document.createElement('h2');
    h.className = 'title-2 product-section__title';
    h.textContent = titleCell.textContent.trim();
    header.append(h);
  }
  wrap.append(header);

  // Scaffold (tabs + pane)
  const scaffold = document.createElement('div');
  scaffold.className = 'product-section__scaffold';

  const tabsRow = rows[1];
  if (tabsRow) {
    const tabsWrap = document.createElement('div');
    tabsWrap.className = 'product-section__tabs';
    [...tabsRow.children].forEach((cell, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'product-section__tab' + (i === 0 ? ' is-active' : '');
      btn.textContent = cell.textContent.trim();
      tabsWrap.append(btn);
    });
    scaffold.append(tabsWrap);
  }

  const pane = document.createElement('div');
  pane.className = 'product-section__pane';
  const paneTitle = rows[2]?.firstElementChild?.textContent.trim();
  const paneBody = rows[3]?.firstElementChild?.textContent.trim();
  if (paneTitle) {
    const h3 = document.createElement('h3');
    h3.className = 'title-4 product-section__pane-title';
    h3.textContent = paneTitle;
    pane.append(h3);
  }
  if (paneBody) {
    const p = document.createElement('p');
    p.className = 'product-section__pane-body';
    p.textContent = paneBody;
    pane.append(p);
  }
  scaffold.append(pane);
  wrap.append(scaffold);

  // "Explore products." heading
  const heading = document.createElement('p');
  heading.className = 'product-section__list-heading';
  heading.textContent = 'Explore products.';
  wrap.append(heading);

  // Product grid cards (rows 4..N-1)
  const cardRows = rows.slice(4, rows.length - 1);
  const grid = document.createElement('div');
  grid.className = 'product-grid';

  cardRows.forEach(row => {
    const cells = [...row.children];
    const markInitials = cells[0]?.textContent.trim();
    const markColor = cells[1]?.textContent.trim();
    const title = cells[2]?.textContent.trim();
    const body = cells[3]?.textContent.trim();
    const badge = cells[4]?.textContent.trim();
    const link = cells[5]?.querySelector('a') || document.createElement('a');

    const card = document.createElement('div');
    card.className = 'explore-card';
    const container = document.createElement('div');
    container.className = 'explore-card-container';

    const linkEl = document.createElement('a');
    linkEl.className = 'explore-card-link-container';
    linkEl.href = link.href || '#';

    const content = document.createElement('div');
    content.className = 'explore-card-content';

    const mark = document.createElement('div');
    mark.className = 'explore-card-mark';
    if (markColor) mark.style.background = markColor;
    mark.textContent = markInitials;

    const textWrap = document.createElement('div');
    textWrap.className = 'explore-card-text';
    const h3 = document.createElement('h3');
    h3.className = 'title-4';
    h3.textContent = title;
    if (badge) {
      const badgeEl = document.createElement('span');
      badgeEl.className = 'explore-card-badge';
      badgeEl.textContent = badge;
      h3.append(badgeEl);
    }
    const bodyP = document.createElement('p');
    bodyP.className = 'body-md';
    bodyP.textContent = body;
    textWrap.append(h3, bodyP);

    content.append(mark, textWrap);
    linkEl.append(content);
    container.append(linkEl);
    card.append(container);
    grid.append(card);
  });
  wrap.append(grid);

  // Footer CTA
  const footRow = rows[rows.length - 1];
  if (footRow) {
    const foot = document.createElement('div');
    foot.className = 'product-section__foot';
    [...(footRow.firstElementChild?.childNodes || [])].forEach(n => foot.append(n.cloneNode(true)));
    wrap.append(foot);
  }

  block.replaceChildren(wrap);
}
