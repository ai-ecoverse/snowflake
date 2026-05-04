/**
 * quick-links — 4-column icon/link grid
 *
 * Authoring rows (positional):
 *   1. header row — <h2> heading
 *   2..N: card rows — cells: icon-name | title | description | link-text | URL
 *
 * Icon SVGs are inline per-block (no shared utility).
 */

const ICONS = {
  home: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#963821" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  clock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#963821" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  globe: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#963821" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>',
  people: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#963821" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/><path d="M12 2a4 4 0 00-4 4c0 1.5.75 3.75 4 7 3.25-3.25 4-5.5 4-7a4 4 0 00-4-4z"/></svg>',
};

function getIcon(name) {
  const key = (name || '').toLowerCase().trim();
  return ICONS[key] || ICONS.home;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'container';

  // First row = header
  const headerRow = rows[0];
  const headerCell = headerRow?.firstElementChild;
  const header = document.createElement('div');
  header.className = 'quick-links-header';

  const h2 = headerCell?.querySelector('h2');
  if (h2) {
    header.append(h2.cloneNode(true));
  } else {
    const heading = document.createElement('h2');
    heading.textContent = headerCell?.textContent.trim() || 'Explore Clark County';
    header.append(heading);
  }
  container.append(header);

  // Remaining rows = cards
  const grid = document.createElement('div');
  grid.className = 'quick-links-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const linkTextCell = cells[3];
    const urlCell = cells[4];

    const card = document.createElement('a');
    card.className = 'ql-card';

    // URL
    const urlSource = urlCell?.querySelector('a') || titleCell?.querySelector('a');
    card.href = urlSource ? urlSource.href : '#';

    // Icon
    const iconWrap = document.createElement('div');
    iconWrap.className = 'ql-icon';
    iconWrap.setAttribute('aria-hidden', 'true');
    iconWrap.innerHTML = getIcon(iconCell?.textContent);
    card.append(iconWrap);

    // Title
    if (titleCell) {
      const title = document.createElement('h3');
      title.className = 'ql-title';
      title.textContent = titleCell.textContent.trim();
      card.append(title);
    }

    // Description
    if (descCell && descCell.textContent.trim()) {
      const desc = document.createElement('p');
      desc.className = 'ql-desc';
      desc.textContent = descCell.textContent.trim();
      card.append(desc);
    }

    // Arrow/link text
    const arrowText = linkTextCell ? linkTextCell.textContent.trim() : 'Learn more';
    const arrow = document.createElement('span');
    arrow.className = 'ql-arrow';
    arrow.innerHTML = `${arrowText} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
    card.append(arrow);

    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
